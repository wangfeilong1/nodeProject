var express = require('express');
var router = express.Router();
var sql = require("./../tool/sql");
var filemd = require("./../tool/file");
var filemd = require("./../tool/file_banner");


/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.isLogin != 1) { // 表示未登录
        res.redirect('/login'); // 跳转到登录页面
        return; // 代码将不再继续往下执行
      }
      sql.find('sh1811', 'banner', {}).then(data => {
      res.render('banner', {
          activeIndex: 5,
          data
      });
    }).catch(err =>{
        console.log(err);
    })
    });

    router.get('/', function(req, res, next) {
        sql.find('sh1811', 'banner', {}).then(data => {
            res.render('banner', { 
                activeIndex: 5,
                data    //  < == > data: data
            });
        }).catch(err => {
            console.log(err)
        })
    });
    router.get('/add', function(req, res, next) {
        res.render('banner_add', { 
              activeIndex: 5
          });
      });


      // 显示页面
   

// 增加;
      router.post("/addAction", function(req, res, next ){
        //
        // post 拿数据的方法是 const obj = req.body;
        // get 拿数据的方法是 const obj = req.query；
        let  {l_id,l_pic} = req.body;
        l_id = l_id*1;
      sql.find("sh1811", "banner", {l_id:l_id} ).then(data =>{
          if(data.length == 0){
            //数据库中没有商品数据;直接进行添加，，
            sql.insert("sh1811", "banner", {l_id,l_pic})
            .then(() =>{
              res.redirect("/banner")//成功之后返回产品管理页面product.ejs
            })
            .catch((err) =>{
              res.redirect("/banner/add")//添加失败之后返回添加页面;
            });
          }else{
            //商品已存在的
            res.redirect("/banner")//商品已存在的话，不需要添加，直接返回产品页面
          }
      }).catch(err =>{
        res.redirect('/banner/add');//只要出现添加异常，就重新返回添加产品页面，
      });
      })


    //   删除
      router.get('/remove', function(req, res, next) {
        let { l_id } = req.query;
        l_id  = l_id *1;
      sql.remove('sh1811', 'banner', { l_id }).then(() => {
          res.redirect('/banner');
      }).catch((err) => {
          res.redirect('/banner');
      })
    });


    router.post("/updateAction", function(req, res, next){
        let  {l_id, l_pic} = req.body;
        l_id = l_id*1;//转化为number类型
        //post的获取数据的方法；
        sql.update("sh1811", "banner", "updateOne", { l_id},  { $set :{l_pic}})
      .then(() =>{//
        res.redirect("/banner");
      }).catch(err =>{
        res.redirect("/banner");
      })
      });

      // 导入数据
// const usersxlsx ="D:/第三阶段/week1-2node/test/myapp/banner.xlsx";//绝对路径’
 const usersxlsx ="/usr/local/node-pro/test/myapp/banner.xlsx";

router.get("/importProducts", (req, res, next) =>{
    filemd.analysisdata(usersxlsx).then((obj) =>{
      console.log('ok');
      console.log(obj);//获取的所有的数据，为数组形式的
      const data = obj[0].data;//获取第一个表的数据
      console.log(data);//获的第一个表的所有数据[ [ 'tel', 'nickname', 'password' ],
      const result = filemd.usersfilterdata(data);
      console.log(result)
      sql.insert("sh1811",  "banner",  result).then( ()=>{
        res.redirect("/banner")
      })
    })
})
// 导出数据
router.get('/exportProducts', (req, res, next) => {
	const _headers =  [
		{caption:'id',type:'string'},
		{caption:'images',type:'string'},
    {caption:'src',type:'string'},
    ];
	sql.find('sh1811', 'banner', {}).then(data => {
		let alldata = new Array();
    data.map((item, index) => {
      let arr = [];
      arr.push(item.id);
      arr.push(item.images);
      arr.push(item.images);
      arr.push(item.imagesrc);
      alldata.push(arr);
		})
		const result = filemd.exportdata(_headers, alldata);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		res.setHeader("Content-Disposition", "attachment; filename=" + "banner.xlsx");
		res.end(result, 'binary');
	})
})
module.exports = router;