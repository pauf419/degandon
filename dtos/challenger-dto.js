
module.exports = class ChallengerDto {
    id
    refer
    preview
    votes
    title 

    constructor(m) {
        this.id = m.id 
        this.refer = m.refer
        this.preview = process.env.STATIC_URL + m.preview 
        this.title = m.title
        this.votes = m.votes
    }
}