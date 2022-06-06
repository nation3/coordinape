import * as fs from 'fs'
import * as path from 'path'
import { GuildBudget } from './GuildBudget'
const csvParser = require('csv-parser')
const csvWriter = require('csv-writer')

export function convertCoordinapePayouts(circlesDir: string = 'coordinape-circles') {
    console.log('convertCoordinapePayouts')

    // For each guild, iterate the CSV files generated by Coordinape
    console.log(`circlesDir: "${circlesDir}"`)
    fs.readdir(circlesDir, function(err, files) {
        if (err) {
            console.error(err)
            return
        }

        files.forEach(function(dir) {
            const circleDir = path.join(circlesDir, dir)
            console.log(`\ncircleDir: "${circleDir}"`)

            // Get the guild's budget
            let guildBudget : number = 0
            for (let guildName in GuildBudget) {
                if (circleDir.replaceAll('-', '').endsWith(guildName.toLowerCase())) {
                    guildBudget = Number(GuildBudget[guildName])
                    break
                }
            }
            console.log('guildBudget:', guildBudget)
            if (guildBudget == 0) {
                console.error('No budget found for guild: ' + circleDir)
                return
            }
            
            // Iterate the guild's CSV files
            fs.readdir(circleDir, function(err, files) {
                files.forEach(function(file) {
                    const filePath = path.join(circleDir, file)
                    console.log(`filePath: "${filePath}"`)
                    if (filePath.endsWith('.csv') 
                            && !filePath.endsWith('_disperse.csv') 
                            && !filePath.endsWith('_gnosis.csv')) {
                        // Read the rows of data from the CSV file
                        const csvRows: any[] = []
                        fs.createReadStream(filePath)
                            .pipe(csvParser({ 
                                    headers: ['No', 'name', 'address', 'received', 'sent', 'epoch_number', 'Date'],
                                    skipLines: 1
                                }))
                            .on('data', (row: any) => csvRows.push(row))
                            .on('end', () => {
                                console.log('\nfilePath', filePath)
                                console.log('csvRows:\n', csvRows)

                                // "address" → "receiver"
                                // "received" → "amount"
                                csvRows.forEach(function(row) {
                                    row.receiver = row.address
                                    row.amount = row.received
                                })

                                // Calculate total amount of Coordinape Circle tokens allocated
                                let totalCircleTokensAllocated = summarizeCircleTokens(csvRows)
                                console.log('totalCircleTokensAllocated:', totalCircleTokensAllocated)

                                // Set guild's budgeted $NATION amount to match the percentage of total Circle tokens allocated
                                console.log('guildBudget:', guildBudget)
                                csvRows.forEach(function(row) {
                                    row.amount = (row.amount / totalCircleTokensAllocated) * guildBudget
                                })

                                // Generate CSV for Disperse.app
                                const filePathDisperse = filePath.replace('.csv', '_disperse.csv')
                                console.log('filePathDisperse', filePathDisperse)
                                writeToDisperseCSV(guildBudget, filePathDisperse, csvRows);

                                // Generate CSV for Gnosis Safe
                                const filePathGnosis = filePath.replace('.csv', '_gnosis.csv')
                                console.log('filePathGnosis', filePathGnosis)
                                writeToGnosisCSV(guildBudget, filePathGnosis, csvRows)
                            })
                    }
                })
            })
        })
    })
}

convertCoordinapePayouts()

function writeToDisperseCSV(guildBudget : number, filePathDisperse : string, csvRows: any[]) {
    console.log('writeToDisperseCSV')

    // Set column names
    const writer = csvWriter.createObjectCsvWriter({
        path: filePathDisperse,
        header: ['receiver', 'amount']
    })

    writer.writeRecords(csvRows)
}

function writeToGnosisCSV(guildBudget : number, filePathGnosis: string, csvRows: any[]) {
    console.log('writeToGnosisCSV')

    // Add missing columns
    csvRows.forEach(function(row) {
        row.token_type = 'erc20'
        row.token_address = '0x333A4823466879eeF910A04D473505da62142069'
    })
    
    const writer = csvWriter.createObjectCsvWriter({
        path: filePathGnosis,
        header: [
            {id: 'token_type', title: 'token_type'},
            {id: 'token_address', title: 'token_address'},
            {id: 'receiver', title: 'receiver'},
            {id: 'amount', title: 'amount'},
            {id: 'id', title: 'id'}
        ]
    })

    writer.writeRecords(csvRows)
}

/**
 * Calculates the total amount of Coordinape Circle tokens allocated by 
 * summarizing the `received` column.
 */
function summarizeCircleTokens(csvRows: any[]): number {
    console.log('summarizeCircleTokens')
    let totalCircleTokensAllocated : number = 0
    csvRows.forEach(function(row) {
        totalCircleTokensAllocated += Number(row.received)
    })
    return totalCircleTokensAllocated
}
