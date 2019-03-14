var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');

router.get('/', function(req, res, next) {
  let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
	sql.find('sh1811', 'swiper', {}).then(data => {
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
 let { swiperId, swiperName, smallImage, totalNumber, pageCode, pageNumber } = req.body;
 totalNumber *= 1;
 swiperId *= 1;
 sql.find('sh1811', 'swiper', { swiperId }).then(data => {
	if (data.length == 0) {
		sql.insert('sh1811', 'swiper', { swiperId, swiperName, smallImage, totalNumber, pageCode, pageNumber })
			.then(() => {
				res.send({
          code: 200,
          message: 'success',
          data: 1
        })
			})
			.catch((err) => {
				res.redirect('/swiper/add');
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
	const { swiperId, pageCode, pageNumber } = req.query;
  sql.remove('sh1811', 'swiper', { swiperId }).then(() => {
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
	let { swiperId, swiperName, type, pageCode } = req.body;
  sql.update('sh1811', 'swiper', 'updateOne', { swiperId: swiperId*1 }, {$set: { swiperName, type }})
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
	const { swiperName } = req.query;
	sql.find('sh1811', 'swiper', { swiperName: eval('/'+swiperName+'/') }).then(data => {
		// res.send(data)
    res.send({
			code: 200,
			message: 'success',
			data: data
		})
		})
	})

router.get('/sendCode', (req, res, next) =>   {
    let { swiperId } = req.query;
    sendCode({
      swiperId,
      code:'3456',
      success:function(data){
        if(data == "ok"){
          res.send("1")
        }
      }
    })
  })

module.exports = router;
