const jwt = require('jsonwebtoken');


module.exports = function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;

  if(token) {
    return res.json('Bạn đã đăng nhập rồi')
  }
  // if (!token) {
  //   return res.status(401).json({ message: "Bạn chưa đăng nhập" });
  // }

  // jwt.verify(token, 'secret-key', (err, user) => {
  //   if (err) {
  //     return res.status(403).json({ message: "Forbidden" });
  //   }

  //   req.user = user;

  next();
  // });
}




 


 