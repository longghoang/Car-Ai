module.exports = function sessionMiddleware(req, res, next) {
  if (req.cookies.jwt) {
       next();
} else {
  return res.render('blogs/notifi');
}

};