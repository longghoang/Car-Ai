const jwt = require('jsonwebtoken');


module.exports = function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Bạn phải đăng nhập đã chứ" });
  }

  jwt.verify(token, 'secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Đã đăng nhập đâu" });
    }

    req.user = user;

    next();
  });
}




 


 