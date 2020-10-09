/* eslint-disable no-console */
const Commando = require('discord.js-commando');
const config = require('./config.json');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');
const { MessageReaction } = require('discord.js');
const { PassThrough } = require('stream');
const token = config.token;

const client = new Commando.Client({
    commandPrefix: '@',
    owner: '271100045787529216',
    disableEveryone: true,
    unknownCommandResponse: false
});

client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('debug', console.log)
    .on('ready', () => {
        console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        // Cache Rules Message
        client.channels.fetch(config.rules_channel)
            .then(channel => channel.messages.fetch(config.rules_message)
                .then(msg => console.log(`Rules Message: ${msg.id}`))
                .catch(console.error))
            .catch(console.error);
        client.user.setActivity(`${client.users.cache.size} users in ${client.guilds.cache.size} guilds!`, {
            type: 'WATCHING',
        });
    })
    .on('disconnect', () => { console.warn('Disconnected!'); })
    .on('commandError', (cmd, err) => {
        if (err instanceof Commando.FriendlyError) return;
        console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
    .on('commandBlocked', (msg, reason) => {
        console.log(oneline`
        Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
        blcoked; ${reason}
        `);
    })
    .on('commandPrefixChange', (guild, prefix) => {
        console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('commandStatusChange', (guild, command, enabled) => {
        console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('groupStatusChange', (guild, group, enabled) => {
        console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('guildCreate', guild => {
        client.user.setActivity(`${client.users.cache.size} users in ${client.guilds.cache.size} guilds!`, {
            type: 'WATCHING',
        });
    })
    .on('guildDelete', guild => {
        client.user.setActivity(`${client.users.cache.size} users in ${client.guilds.cache.size} guilds!`, {
            type: 'WATCHING',
        });
    })
    .on('guildMemberAdd', member => {
        const channel = member.guild.channels.cache.find(ch => ch.name === config.intro_channel);
        const role = member.guild.roles.cache.find(role => role.name === config.default_role);

        member.roles.add(role);

        if (!channel) return;
        channel.send(`Welcome to ${member.guild.name}, ${member}`);

        let roles = [];
        member.roles.cache.forEach(role => {
            roles.push(role.name);
        });

        client.user.setActivity(`${client.users.cache.size} users in ${client.guilds.cache.size} guilds!`, {
            type: 'WATCHING',
        });
    })
    .on('guildMemberRemove', member => {
        client.user.setActivity(`${client.users.cache.size} users in ${client.guilds.cache.size} guilds!`, {
            type: 'WATCHING',
        });
    })
    .on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.id !== config.rules_message) return;

        const member = reaction.message.guild.members.cache.find(guild_member => guild_member.id == user.id);
        const basic_role = reaction.message.guild.roles.cache.find(role => role.name === config.default_role);

        if (!member.roles.cache.some(role => { return basic_role.name === role.name })) return;

        if (reaction.emoji.identifier === '%E2%9C%85') {
            const user_role = reaction.message.guild.roles.cache.find(role => role.name === config.user_role);
            member.roles.remove(basic_role);
            member.roles.add(user_role);
        }

    });

client.setProvider(
    sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.registry
    .registerGroups([
        ['fun', 'Fun commands'],
        ['admin', 'Admin commands']
    ])
    .registerDefaults()
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);