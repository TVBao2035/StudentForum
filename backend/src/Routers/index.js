const PostRouter = require('./PostRouter.js');
const UserRouter = require('./UserRouter.js');
const LikeRouter = require('./LikeRouter.js');
const CommentRouter = require('./CommentRouter.js');
const FriendRouter = require('./FriendRouter.js');
const router = (app) => {
    app.use('/like', LikeRouter);
    app.use('/comment', CommentRouter);
    app.use('/post', PostRouter);
    app.use('/friend', FriendRouter);
    app.use('/', UserRouter);
}

module.exports = router;