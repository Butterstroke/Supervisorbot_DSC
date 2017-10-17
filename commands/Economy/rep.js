exports.run = async (client, message, [member]) => {
    const sql = require("sqlite");
    sql.open("./bwd/data/score.sqlite");

    var user = client.funcs.userSearch(client, message, member);
    
    if (user.username === null || user.username === undefined) { return; }
    if (user.bot === true) { return message.reply("You can't give reputation to a bot user!"); }
    if (user.id === message.author.id) { return message.reply("You can't give reputation to yourself! That's like saying hire me for your nuclear plant because I'm a high school student!"); }

    sql.get(`SELECT * FROM scores WHERE userId = "${message.author.id}"`).then(row => {
        if (!row) { return message.reply("You have not redeemed your first daily yet!"); }
        if ((parseInt(row.repDaily) + 86400000) > Date.now()) { return message.reply("You've already have given someone else rep today!"); }
        else { 
            sql.get(`SELECT * FROM scores WHERE userId = "${user.id}"`).then(row => {
                if (!row) { return message.channel.send(`That user has not gotten their first daily to start off with so you can not give them any rep at the moment. :sad:`); } 
                else {
                    sql.run(`UPDATE scores SET rep = ${row.rep + 1} WHERE userId = ${user.id}`);
                    return message.channel.send(`You have given <@${user.id}> a reputation point!`);
                }
            });
            sql.run(`UPDATE scores SET repDaily = ${Date.now()} WHERE userId = ${message.author.id}`); 
        }
    }).catch(error => { 
        console.log(error);
        return message.reply("Error in command. Please try again later!");
    });
};

exports.conf = {
    enabled: true,
    runIn: ["text"],
    aliases: [],
    permLevel: 0,
    botPerms: [],
    requiredFuncs: [],
};
  
exports.help = {
    name: "rep",
    description: "Give someone a reputation point!",
    usage: "[member:str]",
    usageDelim: "",
};