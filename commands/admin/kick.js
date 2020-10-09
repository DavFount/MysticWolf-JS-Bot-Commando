const Commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const helpers = require('../../helpers.js');

module.exports = class KickCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            aliases: ['kick-user', 'kick-users', 'k'],
            group: 'admin',
            memberName: 'kick',
            description: 'Kicks users.',
            details: oneLine`
                This command will kick someone from the channel. Make sure to document why.
            `,
            examples: ['kick @Baconator He\'s a NOOB!'],
            userPermissions: ['KICK_MEMBERS'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    label: 'user',
                    prompt: 'What user would you like to give the boot?',
                    type: 'string',
                    infinate: false
                },
                {
                    key: 'reason',
                    label: 'reason',
                    prompt: 'What are you kicking the user for?',
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
            member.kick(reason).then(() => {
                return msg.reply(`Successfully kicked ${userObject.tag}`);
            })
        }
    }
}