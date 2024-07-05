const PostRouter =  require('./post');
const UserRouter =  require('./user');
const AuthRouter =  require('./auth');
const CategoryRouter = require('./category')
const CommentRouter = require('./comment')

const routes = (app) => {
    app.use('/api/auth', AuthRouter);
    app.use('/api/post', PostRouter);
    app.use('/api/user', UserRouter);
    app.use('/api/category', CategoryRouter);
    app.use('/api/comments', CommentRouter);
}

module.exports = routes;