const PostRouter = require('./PostRouter.js');
const UserRouter = require('./UserRouter.js');
const router = (app) => {
    app.use('/post', PostRouter);
    app.use('/', UserRouter);
}

module.exports = router;