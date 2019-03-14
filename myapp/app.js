var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var url = require('url');
var cors=require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var cartRouter = require('./routes/cart');
var bannerRouter = require('./routes/banner');
var bannerIndexRouter = require('./routes/bannerIndex');

var apiUsersRouter = require('./api/users');
var apiProductRouter = require('./api/product');
var apiBannerRouter = require('./api/banner');
var apiIndexListRouter = require('./api/indexList');
var apiarticalListRouter = require('./api/articalList');
var apifoodListRouter = require('./api/foodList')
var apibannerIndexRouter = require('./api/bannerIndex')
var zaocanRouter = require('./api/zaocan');
var allRouter = require('./api/all');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
  "origin": ['*'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders:['Content-Type', 'Authorization']
}));

// 使用 session 中间件
app.use(session({
  secret :  'secret', // 对session id 相关的cookie 进行签名//
  resave : true,
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie : {
      maxAge : 1000 * 60 * 10, // 设置 session 的有效时间，单位毫秒
  },
}));

app.all(" * ", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", " * ");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",'3.2.1')
  if(req.method == "OPTIONS") res.send(200);
  else next();
  });
  
app.all('/users/*', (req, res, next) => {
  if (req.session.isLogin == 1) {
    next()
  } else {
    res.redirect('/login')
  }
})
app.all('/product/*', (req, res, next) => {
  if (req.session.isLogin == 1) {
    next()
  } else {
    res.redirect('/login')
  }
})
app.all('/cart/*', (req, res, next) => {
  if (req.session.isLogin == 1) {
    next()
  } else {
    res.redirect('/login')
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/product', productRouter);
app.use('/banner', bannerRouter);
app.use('/bannerIndex', bannerIndexRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/product', apiProductRouter);
app.use('/api/banner', apiBannerRouter);
app.use('/api/indexList', apiIndexListRouter);
app.use('/api/articalList', apiarticalListRouter);
app.use('/api/foodList', apifoodListRouter);
app.use('/api/bannerIndex', apibannerIndexRouter);
app.use('/api/zaocan', zaocanRouter);
app.use('/api/all', allRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
