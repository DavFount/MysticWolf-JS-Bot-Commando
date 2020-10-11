const config = require('./config.json');
const axios = require('axios');
const Streamer = require('./Streamer.js');

const {
    MessageEmbed,
} = require('discord.js');

let streamers = [];

module.exports = {
    getUserFromMention: (client, mention) => {
        const matches = mention.match(/^<@!?(\d+)>$/);
        if (!matches) return;
        const id = matches[1];
        return client.users.cache.get(id);
    },
    initiateStreamers: () => {
        config.twitch_users.forEach(streamer => {
            streamers.push(new Streamer(streamer.name, streamer.id));
        });
    },
    checkTwitchStatus: client => {
        streamers.forEach(streamer => {
            axios.get(`https://api.twitch.tv/helix/search/channels?query=${streamer.name}&first=1`, {
                headers: {
                    "client-id": config.twitch_token,
                    "Authorization": `Bearer ${config.twitch_secret}`
                }
            }).then(response => {
                if (streamer.status !== response.data.data[0].is_live) {

                    streamer.setStatus(response.data.data[0].is_live);
                    streamer.setTitle(response.data.data[0].title);
                    streamer.setProfileImg(response.data.data[0].thumbnail_url);

                    if (streamer.is_live) {
                        // Get Stream Info
                        axios.get(`https://api.twitch.tv/helix/streams?user_login=savsin`, {
                            headers: {
                                "client-id": config.twitch_token,
                                "Authorization": `Bearer ${config.twitch_secret}`
                            }
                        }).then(response => {
                            streamer.setViewers(response.data.data[0].viewer_count);
                            // Get Game Info
                            axios.get(`https://api.twitch.tv/helix/games?id=${response.data.data[0].game_id}`, {
                                headers: {
                                    "client-id": config.twitch_token,
                                    "Authorization": `Bearer ${config.twitch_secret}`
                                }
                            }).then(response => {
                                streamer.setGame(response.data.data[0].name);
                                console.log(`Name: ${streamer.getName()} - Viewer Count: ${streamer.getViewers()}`);
                                console.log(`Name: ${streamer.getName()} - Game Name: ${streamer.getGame()}`);
                                console.log(`Name: ${streamer.getName()} - Status: ${streamer.is_live()} - Title: ${streamer.getTitle()} - Profile Image: ${streamer.getProfileImg()}`);
                                const embed = new MessageEmbed()
                                    .setColor('#6e0002')
                                    .setTitle(`${streamer.getTitle()}`)
                                    .setURL(`https://www.twitch.tv/${streamer.getName()}`)
                                    .setDescription(`@everyone ${streamer.getName()} is now live!`)
                                    .setThumbnail(streamer.getProfileImg())
                                    .addField('Game', streamer.getGame(), true)
                                    .addField('Viewers', streamer.getViewers(), true)
                                    .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer.getName()}-450x253.jpg`)
                                    .setTimestamp()
                                    .setFooter('Mysticl Wolf Gaming', 'https://pbs.twimg.com/profile_images/1177094635119726598/e2KdhWsu_400x400.jpg');


                                // Get Stream Channel
                                client.channels.fetch(config.twitch_channel).then(channel => {
                                    channel.send(embed);
                                });
                            });
                        });
                    }
                }
            }).catch(error => console.error(error));
        });
    },
}