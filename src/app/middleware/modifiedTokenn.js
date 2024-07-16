const jwt = require('jsonwebtoken');


module.exports = function authenticateToken(req, res, next) {
  const wellcome = req.cookies.jwt

  if(!wellcome) {
    render('blogs/bye')
  } else {
    next()
  }
}




 


 