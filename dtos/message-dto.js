
module.exports = class MessageDto {
    id;
    refer
    payload 
    timestamp

    constructor(model) {
        this.id = model.id;
        this.refer = model.refer
        this.payload = model.payload
        this.timestamp = model.timestamp
    }
}