
class LogoutController {
  async logout(req, res, next) {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
      }
      res.clearCookie("jwt");
      res.clearCookie('userId', { signed: true });
      res.redirect('/'); 
    });
  }
}

module.exports = new LogoutController();