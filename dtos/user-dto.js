module.exports = class UserDto {
    id;
    username;
    pfp
    status
    rating
    description
    online

    constructor(model) {
        this.id = model.id;
        this.username = model.username;
        this.pfp = process.env.STATIC_URL+model.pfp
        this.status = model.status
        this.rating = model.rating
        this.description = model.description
        this.online = model.online
    }
}