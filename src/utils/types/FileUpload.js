const fs = require("fs");
const {extension} = require("mime-types");
const path = require("path");
const {UPLOAD_DIR} = require("../Constants.js");

class FileUpload {
    constructor({originalname, mimetype, buffer}) {
        this.originalname = originalname;
        this.mimetype = mimetype;
        this.buffer = buffer;
    }

    toJSON() {
        return {
            originalname: this.originalname,
            mimetype: this.mimetype,
            filepath: this.filepath,
        };
    }

    toString() {
        return `${this.originalname}.${extension(this.mimetype)}`;
    }

    save(...paths) {
        const fileName = `${this.originalname}.${extension(this.mimetype)}`;
        const uploadDir = path.join(UPLOAD_DIR, ...paths);
        fs.mkdirSync(uploadDir, {recursive: true});
        fs.writeFileSync(path.join(uploadDir, fileName), this.buffer);
        const filepath = path.posix.join(...paths, fileName);
        this.filepath = filepath;
        return filepath;
    }

    static remove(filePath) {
        filePath = path.join(UPLOAD_DIR, filePath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}

module.exports = FileUpload;
