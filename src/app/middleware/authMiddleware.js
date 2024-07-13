const jwt = require('jsonwebtoken');


module.exports = function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.render('blogs/notifi');
  }

  // jwt.verify(token, 'secret-key', (err, user) => {
  //   if (err) {
  //     return res.status(403).json({ message: "Forbidden" });
  //   }

    req.user = user;

  next();
  // });
}




 


 