const config = require('./config.json');

module.exports = {
    getUserFromMention: (client, mention) => {
        const matches = mention.match(/^<@!?(\d+)>$/);
        if (!matches) return;
        const id = matches[1];
        return client.users.cache.get(id);
    },
}