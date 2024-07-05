const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const authRoute = require("./routes/auth");
// const userRoute = require("./routes/users");
// const postRoute = require("./routes/posts");
// const categoryRoute = require("./routes/categories");
// const commentsRoute = require("./routes/comments");
const {PUBLIC_DIR} = require('./utils/Constants') ;
const cors = require('cors');
const db = require('./config/db');
const routes = require('./routes');

dotenv.config();
app.use("/", express.static(PUBLIC_DIR));
//connect to DB
db.connect();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use("/files", express.static("files"));

// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
// app.use("/api/categories", categoryRoute);
// app.use("/api/comments", commentsRoute);

routes(app);

const port =5000
app.listen(port, () => {
  console.log('>> Server đang lắng nghe tại cổng: ', + port);
})