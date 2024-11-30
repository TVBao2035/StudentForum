const PostRouter = require('./PostRouter.js');
const UserRouter = require('./UserRouter.js');
const LikeRouter = require('./LikeRouter.js');
const CommentRouter = require('./CommentRouter.js');
const FriendRouter = require('./FriendRouter.js');
const CategoryRouter = require('./CategoryRouter.js');
const GroupRouter = require('./GroupRouter.js');
const HistoryRouter = require('./HistoryRouter.js');

const router = (app) => {
    app.use('/history', HistoryRouter);
    app.use('/like', LikeRouter);
    app.use('/comment', CommentRouter);
    app.use('/post', PostRouter);
    app.use('/friend', FriendRouter);
    app.use('/category', CategoryRouter);
    app.use('/group', GroupRouter);
    app.use('/', UserRouter);
}

module.exports = router;