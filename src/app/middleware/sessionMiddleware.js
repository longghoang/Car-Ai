module.exports = function sessionMiddleware(req, res, next) {
  if (req.session.user) {
       next();
} else {
    res.json('Bạn chưa đăng nhập')
}

};