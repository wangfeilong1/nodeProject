var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var md5 = require('md5');
var filemd = require('./../tool/file.js');
var { sendCode } = require('./../tool/mycode.js')

router.get('/', function(req, res, next) {
	let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 50; // 默认每页显示8条数据
	sql.find('sh1811', 'users', {}).then(data => {
		const totalNumber = Math.ceil(data.length / pageNumber);
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
	// { tel: tel}    { tel }
 // post 如何拿数据
 // const obj = req.body;
 let { tel, nickname, password, age } = req.body;
 tel *= 1;
 age *= 1;
 sql.find('sh1811', 'users', { tel: tel }).then(data => {
	if (data.length == 0) {
		// 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
		password = md5(password);
		sql.insert('sh1811', 'users', { tel, nickname, password, age })
			.then(() => {
				res.send({
					code: 200,
					message: 'success',
					data: 1
				})
			})
			.catch((err) => {
				res.redirect('/users/add');
			})
	} else {
		// 该用户已存在
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
 // console.log(obj);
 
});
// 删除
router.get('/remove', function(req, res, next) {
	const { tel } = req.query;
  sql.remove('sh1811', 'users', { tel }).then(() => {
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
	let { tel, nickname } = req.body;
	tel = tel * 1;
  sql.update('sh1811', 'users', 'updateOne', { tel }, {$set: { nickname }})
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

router.get('/search', (req, res, next) => {
	const { nickname } = req.query;
	sql.find('sh1811', 'users', { nickname: eval('/'+nickname+'/') }).then(data => {
		res.send({
			code: 200,
			message: 'success',
			data: data
		})
	})
})

router.get('/ageSearch', (req, res, next) => {
	let { age } = req.query;
	age *= 1;
	sql.find('sh1811', 'users', { age }).then(data => {
		// res.send(data)
		res.send({
			code: 200,
			message: 'success',
			data: data
		})
		
	})
})

router.get('/sort', (req, res, next) => {
	let { type, num } = req.query;
	let sortData = {};
	sortData[type] = num * 1;
	sql.sort('sh1811', 'users', sortData).then(data => {
		// res.send(data)
		res.send({
			code: 200,
			message: 'success',
			data: data
		})
		
	})
})

router.get('/distinct', (req, res, next) => {
	sql.distinct('sh1811', 'users', 'age').then(ageArr => {
		res.send(ageArr)
	})
})

router.get('/sendCode', (req, res, next) => {
	let { tel } = req.query;
	sendCode({
		phoneNum: tel,
		code:'3456',
		success:function(data){
			if(data == "ok"){
				res.send("1")
			}
		}
	})
})

router.post("/login", function(req, res, next){
	let { tel, password } = req.body;
  sql.find('sh1811', 'users', { tel }).then(data => {
      if(data[0].password == password){
        res.send({
          code: 200,
          message: 'success',
          data: 1
        });
       } else {
        res.send({
          code: 404,
          message: 'success',
          data: 0
        });
       }
  })
});

router.post('/register', function(req, res, next) {
    let { tel ,password,nickname} = req.body; 
    sql.find('sh1811', 'users', {tel}).then(data => {
      if (data.length === 0) {
        sql.insert('sh1811', 'users', {"tel":tel,"password":password}).then(() => {
          res.send({
            code: 200,
            message: 'success',
            data: 1
          })
        })
      } else {
        res.send({
          code: 404,
          message: 'err',
          data: 0
        })
      }
    })
  }) 


module.exports = router;
