const blogsRouter = require('./blogs');
const siteRouter = require('./news');
const registerRouter = require('./register');
const storeRouter = require('./stored');







function route(app) {
    app.use('/', siteRouter);
    app.use('/blogs', blogsRouter);
    app.use('/register', registerRouter);
    app.use('/stored', storeRouter);
}

module.exports = route;