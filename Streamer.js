class Streamer {
    name;
    id;
    status;
    game;
    viewers;
    title;
    profile_img;
    stream_img;

    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.status = false;
    }

    // Setters
    setStatus(status) {
        this.status = status;
    }
    setGame(game) {
        this.game = game;
    }
    setViewers(viewers) {
        this.viewers = viewers;
    }
    setTitle(title) {
        this.title = title;
    }
    setProfileImg(profile_img) {
        this.profile_img = profile_img;
    }
    setStreamImg(stream_img) {
        this.stream_img = stream_img;
    }

    // Getters
    getName() {
        return this.name;
    }
    is_live() {
        return this.status;
    }
    getGame() {
        return this.game;
    }
    getViewers() {
        return this.viewers;
    }
    getTitle() {
        return this.title;
    }
    getProfileImg() {
        return this.profile_img;
    }
    getStreamImg() {
        return this.stream_img;
    }
}

module.exports = Streamer;