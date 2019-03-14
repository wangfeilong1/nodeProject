var express = require('express');
var router = express.Router();
var sql = require('../tool/sql');


router.get('/', function(req, res, next) {
	let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 50; // 默认每页显示8条数据
	sql.find('sh1811', 'articallist', {}).then(data => {
		const totalNumber = Math.ceil(data.length / pageNumber);
		data = data.splice((pageCode -  1) * pageNumber, pageNumber)
		res.send(data)
	}).catch(err => {
		console.log(err)
	})
});
router.get('/detail', (req, res, next) => {
	const { id } = req.query;
	sql.find('sh1811', 'articallist', { id: id*1  }).then(data => {
		res.send(data)
	})
})


module.exports = router;
