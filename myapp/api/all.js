var express = require('express');
var router = express.Router();
var sql = require("./../tool/sql");//引入数据库封装的sql方法
 
router.get('/', function(req, res, next) {
  
      let { pageCode, pageNumber } = req.query;
      pageCode = pageCode *1 || 1;
      pageNumber = pageNumber * 1 || 20;
      sql.find("sh1811", "all", {}).then((data) =>{
        const totalNumber = Math.ceil( data.length / pageNumber);
        data = data.splice((pageCode - 1) * pageNumber, pageNumber);
                    res.send({
                      code: 200,
                      message: 'success',
                      data: data
                    })        
            
        
    }).catch((err) =>{
      console.log(err)
    })                                    
});
router.get('/searchDetail', (req, res, next) => {
	const { id } = req.query;
	sql.find('sh1811', 'all', { id }).then(data => {
      res.send(data)
	})
})

router.get('/titleSearch', (req, res, next) => {
	const { title } = req.query;
	sql.find('sh1811', 'all', { title: eval('/'+title+'/') }).then(data => {//成功之后返回的数据
    res.send({
      code: 200,
      message: 'success',
      data: data,
    })
    })
	})

router.get('/emtitleSearch', (req, res, next) => {
	const { emtitle } = req.query;
	sql.find('sh1811', 'all', { emtitle: eval('/'+emtitle+'/')}).then(data => {
    res.send({
      code: 200,
      message: 'success',
      data: data,
    })
	})
})
//分类
router.get("/type", (req, res, next) =>{
    sql.distinct("sh1811", "all", "type").then((typeArr) =>{//成功之后返回的数据;
      res.send({
        code: 200,
        message: 'success',
        data: typeArr,
      })
    })
})
router.get("/zongtype", (req, res, next) =>{
  sql.distinct("sh1811", "all", "zongtype").then((typeArr) =>{//成功之后返回的数据;
    res.send({
      code: 200,
      message: 'success',
      data: typeArr,
    })
  })
})
router.get("/caitype", (req, res, next) =>{
  sql.distinct("sh1811", "all", "caitype").then((typeArr) =>{//成功之后返回的数据;
    res.send({
      code: 200,
      message: 'success',
      data: typeArr,
    })
  })
})
router.get('/typeKind', (req, res, next) => {
	const { type } = req.query;
	sql.find('sh1811', 'all', { type: eval('/'+type+'/')}).then(data => {
    res.send({
      code: 200,
      message: 'success',
      data: data,
    })
	})
})
router.get('/chuancai', (req, res, next) => {
	sql.find('sh1811', 'all', '川菜').then(data => {
    res.send({
      code: 200,
      message: 'success',
      data: data,
    })
	})
})
router.get('/zongtypeKind', (req, res, next) => {
	const { zongtype } = req.query;
	sql.find('sh1811', 'all', { zongtype: eval('/'+zongtype+'/')}).then(data => {
    res.send({
      code: 200,
      message: 'success',
      data: data,
    })
	})
})
router.get('/caitypeKind', (req, res, next) => {
	const { caitype } = req.query;
	sql.find('sh1811', 'all', { caitype: eval('/'+caitype+'/')}).then(data => {
    res.send({
      code: 200,
      message: 'success',
      data: data,
    })
	})
})
// // 排序；

router.get("/renqi", (req, res, next) =>{
    let { type, num} = req.query;
    let sortData = {};
    sortData[type] = num * 1;
    sql.sort("sh1811", "all", sortData).then((data) =>{
            res.send({
              code: 200,
              message: 'success',
              data: data
            })
        })
    })

module.exports = router;
