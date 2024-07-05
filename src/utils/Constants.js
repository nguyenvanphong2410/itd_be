const path = require("path");
const short = require("short-uuid");
const { config } = require("dotenv");

config()

const SOURCE_DIR = path.dirname(__dirname);
const PUBLIC_DIR = path.join(path.dirname(SOURCE_DIR), "public");
const VIEW_DIR = path.join(SOURCE_DIR, "views");
const STORAGE_DIR = path.join(SOURCE_DIR, "storage");
const LOG_DIR = path.join(STORAGE_DIR, "logs");
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads");

const UUID_TRANSLATOR = short();

module.exports = {
    SOURCE_DIR,
    PUBLIC_DIR,
    VIEW_DIR,
    SOURCE_DIR,
    LOG_DIR,
    UPLOAD_DIR,
    UUID_TRANSLATOR
}
