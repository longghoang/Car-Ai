const express = require('express');
const app = express();
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const port = 4451;
const route = require('./routes');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Kết nối DB
const db = require('./config/db');
db.conect();

// Middleware
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('my-secret'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Cho phép xử lý JSON nếu cần thiết
app.use(methodOverride('_method'));

// Cấu hình session
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Cấu hình Handlebars
app.engine(
    'hbs',
    handlebars.engine({
        defaultLayout: 'main',
        extname: 'hbs',
        helpers: {
            sum: (a, b) => a + b,
            encodeURIComponent: (value) => encodeURIComponent(value)
        }
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes
route(app);

// Khởi động server
app.listen(port, () => console.log(`App listening in http://localhost:${port}`));
