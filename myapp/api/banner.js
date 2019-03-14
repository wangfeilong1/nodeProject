var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');

router.get('/', function(req, res, next) {
  let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
	sql.find('sh1811', 'banner', {}).then(data => {
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

router.post('/addAction', function(req, res, next) {
 let { l_id, l_pic, smallImage, totalNumber, pageCode, pageNumber } = req.body;
 totalNumber *= 1;
 l_id *= 1;
 sql.find('sh1811', 'banner', { l_id }).then(data => {
	if (data.length == 0) {
		sql.insert('sh1811', 'banner', { l_id, l_pic, smallImage, totalNumber, pageCode, pageNumber })
			.then(() => {
				res.send({
          code: 200,
          message: 'success',
          data: 1
        })
			})
			.catch((err) => {
				res.redirect('/banner/add');
			})
	} else {
		res.send({
			code: 200,
			message: 'success',
			data: 0
		})
	}
 }).catch(err => {
	 console.log(err)
	 res.send({
    code: 200,
    message: 'success',
    data: -1
  })
 })
});

// 删除
router.get('/remove', function(req, res, next) {
	const { l_id, pageCode, pageNumber } = req.query;
  sql.remove('sh1811', 'banner', { l_id }).then(() => {
	  res.send({
			code: 200,
			message: 'success',
			data: 1
		})
  }).catch((err) => {
	  res.send({
			code: 200,
			message: 'success',
			data: 0
		})
  })
});
// 更新
router.post('/updateAction', function(req, res, next) {
	let { l_id, l_pic, type, pageCode } = req.body;
  sql.update('sh1811', 'banner', 'updateOne', { l_id: l_id*1 }, {$set: { l_pic, type }})
  .then(() => {
	  res.send({
			code: 200,
			message: 'success',
			data: 1
		})
  }).catch(err => {
	  res.send({
			code: 200,
			message: 'success',
			data: 0
		})
  })
});

//搜索
router.get('/search', (req, res, next) => {
	const { l_pic } = req.query;
	sql.find('sh1811', 'banner', { l_pic: eval('/'+l_pic+'/') }).then(data => {
		// res.send(data)
    res.send({
			code: 200,
			message: 'success',
			data: data
		})
		})
	})

router.get('/sendCode', (req, res, next) =>   {
    let { l_id } = req.query;
    sendCode({
      l_id,
      code:'3456',
      success:function(data){
        if(data == "ok"){
          res.send("1")
        }
      }
    })
  })

module.exports = router;
