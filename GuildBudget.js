"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildBudget = void 0;
/**
 * The amount of $NATION budgeted for each guild.
 */
var GuildBudget;
(function (GuildBudget) {
    GuildBudget[GuildBudget["CommunityGuild"] = 0.1] = "CommunityGuild";
    GuildBudget[GuildBudget["BrandDesignGuild"] = 0.1] = "BrandDesignGuild";
    GuildBudget[GuildBudget["EventsGuild"] = 0] = "EventsGuild";
    GuildBudget[GuildBudget["RewardsGuild"] = 0.2] = "RewardsGuild";
    GuildBudget[GuildBudget["ResearchGuild"] = 0.1] = "ResearchGuild";
    GuildBudget[GuildBudget["DevelopersGuild"] = 0.25] = "DevelopersGuild";
    GuildBudget[GuildBudget["MetaGuild"] = 0.05] = "MetaGuild";
    GuildBudget[GuildBudget["GrowthGuild"] = 0.05] = "GrowthGuild";
})(GuildBudget = exports.GuildBudget || (exports.GuildBudget = {}));
