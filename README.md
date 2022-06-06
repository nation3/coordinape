# Coordinape Payouts 🦍

This code converts CSVs exported from https://app.coordinape.com into a format that is compatible with Gnosis Safe.

## 1. Input (Circle Tokens) 🍌🦍

```csv
No,name,address,received,sent,epoch_number,Date
1,ape1,0x11115abfa9b2a7e18a610f489fb3510765461111,20,50,1,June 1 2022 12:00 AM UTC - June 5 2022 12:00 AM UTC
2,ape2,0x222272f7b5c075ea5fdeb423da95312c4b992222,30,50,1,June 1 2022 12:00 AM UTC - June 5 2022 12:00 AM UTC
```

## 2. Conversion 🍌🦍 → ☁️🇺🇳

In the example above, a total of `50 + 50 = 100` Coordinape Circle tokens were allocated.

The contributor who received 20 of the Coordinape Circle tokens from his fellow apes would then get `20 / 100 = 20%` of the Circle's budget.

## 3. Output (`$NATION` Tokens) ☁️🇺🇳

Assuming a Circle budget of 0.5 `$NATION` tokens, 20% would equal 0.1 `$NATION`:

```csv
token_type,token_address,receiver,amount,id
erc20,0x333A4823466879eeF910A04D473505da62142069,0x11115abfa9b2a7e18a610f489fb3510765461111,0.1,
erc20,0x333A4823466879eeF910A04D473505da62142069,0x222272f7b5c075ea5fdeb423da95312c4b992222,0.15,
```

## Build

```javascript
npm run build
```

## Convert CSVs

```javascript
node index.js
```
