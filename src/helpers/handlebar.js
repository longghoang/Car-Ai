// Định nghĩa helper Handlebars
Handlebars.registerHelper('isLoggedIn', function(accessToken) {
  if (accessToken) {
    // Nếu access token tồn tại, trả về chữ "Đăng xuất"
    return new Handlebars.SafeString('Đăng xuất');
  } else {
    // Nếu access token không tồn tại, trả về chữ "Đăng nhập"
    return new Handlebars.SafeString('Đăng nhập');
  }
});
