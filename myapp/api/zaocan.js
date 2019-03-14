var express = require('express');
var router = express.Router();
var sql = require("./../tool/sql");//引入数据库封装的sql方法

router.get('/', function(req, res, next) {
  let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 20; // 默认每页显示8条数据
	sql.find('sh1811', 'zaocan', {} ).then(data => {
		data = data.splice((pageCode -  1) * pageNumber, pageNumber)
    res.send(data)
	}).catch(err => {
		console.log(err)
  })
});

//详情
router.get('/detail', (req, res, next) => {
	const { id } = req.query;
	sql.find('sh1811', 'zaocan', { id }).then(data => {
      res.send(data)
	})
})
//分类
router.get("/kind", (req, res, next) =>{
    sql.distinct("sh1811", "zaocan", "type").then((typeArr) =>{//成功之后返回的数据;
        res.send(typeArr);
    })
})

// // 排序；

    router.get("/pingjiaSort", (req, res, next) =>{
      let { type, num } = req.query;
      let sortData = {};
      sortData[type] = num * 1;
      sql.sort("sh1811", "zaocan", sortData).then((data) =>{
            res.send({
              code: 200,
              message: 'success',
              data: data
            })
          })
        })

module.exports = router;
