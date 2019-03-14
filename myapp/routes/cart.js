var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var md5 = require('md5');
// var xlsx = require('node-xlsx');
var filemd = require('./../tool/file_cart.js')
var filemd1 = require('./../tool/file_artical.js')
var filemd2 = require('./../tool/file_food.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.session.isLogin != 1) { // 表示未登录
    res.redirect('/login'); // 跳转到登录页面
    return; // 代码将不再继续往下执行
  }
  res.render('cart', {
	  activeIndex: 4
  });
});

const usersxlsx ="D:/第三阶段/week1-2node/test/myapp/首页列表.xlsx";//绝对路径’
//  const usersxlsx ="/usr/local/node-pro/test/myapp/stu.xlsx";;

router.get('/importUsers', (req, res, next) => {
	filemd.analysisdata(usersxlsx).then(obj => {
		console.log(obj)
		const data = obj[0].data;
		const result = filemd.usersfilterdata(data)
		// res.send(result)
		sql.insert('sh1811', 'indexlist', result).then(() => {
			res.redirect('/cart')
		})
	})
})
const usersxlsx1 ="D:/第三阶段/week1-2node/test/myapp/文章精选.xlsx";//绝对路径’
router.get('/importArticals', (req, res, next) => {
	filemd1.analysisdata(usersxlsx1).then(obj => {
		console.log(obj)
		const data = obj[0].data;
		const result = filemd1.usersfilterdata(data)
		// res.send(result)
		sql.insert('sh1811', 'articallist', result).then(() => {
			res.redirect('/cart')
		})
	})
})

const usersxlsx2 ="D:/第三阶段/week1-2node/test/myapp/美食列表.xlsx";//绝对路径’
router.get('/importDishes', (req, res, next) => {
	filemd2.analysisdata(usersxlsx2).then(obj => {
		console.log(obj)
		const data = obj[0].data;
		const result = filemd2.usersfilterdata(data)
		// res.send(result)
		sql.insert('sh1811', 'foodlist', result).then(() => {
			res.redirect('/cart')
		})
	})
})
module.exports = router;
