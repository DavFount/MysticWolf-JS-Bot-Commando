const Commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const helpers = require('../../helpers.js');

module.exports = class BanCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: ['ban-user', 'ban-users', 'b'],
            group: 'admin',
            memberName: 'ban',
            description: 'Bans a users.',
            details: oneLine`
                This command will ban someone from the channel. Make sure to document why.
            `,
            examples: ['ban @Baconator He\'s a NOOB!'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    key: 'user',
                    label: 'user',
                    prompt: 'Which user would you like to ban?',
                    type: 'string',
                    infinate: false
                },
                {
                    key: 'reason',
                    label: 'reason',
                    prompt: 'What is the reason you are banning the user?',
                    type: 'string',
                    infinite: true
                }
            ]
        });
    }

    async run(msg, { user, reason }) {
        const userObject = helpers.getUserFromMention(msg.client, user);
        const member = msg.guild.member(userObject);
        if (member) {
            member.ban(reason).then(() => {
                return msg.reply(`Successfully banned ${userObject.tag}`);
            })
        }
    }
}