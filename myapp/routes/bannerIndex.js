var express = require('express');
var router = express.Router();
var sql = require("../tool/sql");

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.isLogin != 1) { // 表示未登录
        res.redirect('/login'); // 跳转到登录页面
        return; // 代码将不再继续往下执行
      }
      sql.find('sh1811', 'bannerIndex', {}).then(data => {
      res.render('bannerIndex', {
          activeIndex: 6,
          data
      });
    }).catch(err =>{
        console.log(err);
    })
    });

    router.get('/', function(req, res, next) {
        sql.find('sh1811', 'bannerIndex', {}).then(data => {
            res.render('bannerIndex', { 
                activeIndex: 6,
                data    //  < == > data: data
            });
        }).catch(err => {
            console.log(err)
        })
    });
    router.get('/add', function(req, res, next) {
        res.render('bannerIndex_add', { 
              activeIndex: 6
          });
      });


      // 显示页面
   

// 增加;
      router.post("/addAction", function(req, res, next ){
        //
        // post 拿数据的方法是 const obj = req.body;
        // get 拿数据的方法是 const obj = req.query；
        let  {id, pic1, pic2, pic3} = req.body;
        id = id*1;
      sql.find("sh1811", "bannerIndex", {id:id} ).then(data =>{
          if(data.length == 0){
            //数据库中没有商品数据;直接进行添加，，
            sql.insert("sh1811", "bannerIndex", {id,pic1, pic2, pic3})
            .then(() =>{
              res.redirect("/bannerIndex")//成功之后返回产品管理页面product.ejs
            })
            .catch((err) =>{
              res.redirect("/bannerIndex/add")//添加失败之后返回添加页面;
            });
          }else{
            //商品已存在的
            res.redirect("/bannerIndex")//商品已存在的话，不需要添加，直接返回产品页面
          }
      }).catch(err =>{
        res.redirect('/bannerIndex/add');//只要出现添加异常，就重新返回添加产品页面，
      });
      })


    //   删除
      router.get('/remove', function(req, res, next) {
        let { id } = req.query;
        id  = id *1;
      sql.remove('sh1811', 'bannerIndex', { id }).then(() => {
          res.redirect('/bannerIndex');
      }).catch((err) => {
          res.redirect('/bannerIndex');
      })
    });


    router.post("/updateAction", function(req, res, next){
        let  {id, pic1, pic2, pic3} = req.body;
        id = id*1;//转化为number类型
        //post的获取数据的方法；
        sql.update("sh1811", "bannerIndex", "updateOne", { id },  { $set :{pic1, pic2, pic3}})
      .then(() =>{//
        res.redirect("/bannerIndex");
      }).catch(err =>{
        res.redirect("/bannerIndex");
      })
      });

module.exports = router;