const path = require('path')
const fs = require("fs")
const randomId = require('random-id')

class FileService {
    saveFile(file) { 
        try { 
            const fname = randomId(24, "aA0") + ".png"

            const fpath = path.resolve('static', fname)

            file.mv(fpath)

            return fname
        } catch(e) {
            console.log(e)
            return path.resolve('static', "user64.png")
        }
    }

    saveFileBuf(buf) {
        const fname = randomId(24, "aA0") + ".png"
        const fpath = path.resolve('static', fname)
        fs.writeFileSync(fpath, buf)
        return fname
    }
}

module.exports = new FileService() 