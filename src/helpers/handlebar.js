// Định nghĩa helper Handlebars
// Handlebars.registerHelper('isLoggedIn', function(accessToken) {
//   if (accessToken) {
//     // Nếu access token tồn tại, trả về chữ "Đăng xuất"
//     return new Handlebars.SafeString('Đăng xuất');
//   } else {
//     // Nếu access token không tồn tại, trả về chữ "Đăng nhập"
//     return new Handlebars.SafeString('Đăng nhập');
//   }
// });

const handlebars = require('handlebars');

handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case '===':
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case '!=':
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case '!==':
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case '<':
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case '<=':
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case '>':
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case '>=':
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

