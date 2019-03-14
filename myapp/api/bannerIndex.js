var express = require('express');
var router = express.Router();
var sql = require('../tool/sql');

router.get('/', function(req, res, next) {
  let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
	sql.find('sh1811', 'bannerIndex', {}).then(data => {
		data = data.splice((pageCode -  1) * pageNumber, pageNumber)
    res.send({
			code: 200,
			message: 'success',
			data: data
		})
	}).catch(err => {
		console.log(err)
  })
});


//搜索


module.exports = router;
