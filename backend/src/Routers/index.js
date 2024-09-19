
const UserRouter = require('./UserRouter.js');
const router = (app) => {
    app.use('/', UserRouter);
}

module.exports = router;