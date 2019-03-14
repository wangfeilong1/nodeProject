var express = require('express');
var router = express.Router();
var sql = require("./../tool/sql");//引入数据库封装的sql方法
var filemd = require("./../tool/file_product");//引入封装好的导入数据方法；
var { sendCode } = require('./../tool/mycode.js')

   
router.get('/', function(req, res, next) {
  
      let { pageCode, pageNumber } = req.query;
      pageCode = pageCode *1 || 1;
      pageNumber = pageNumber * 1 || 20;
      sql.find("sh1811", "product", {}).then((data) =>{
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



router.post("/addAction", function(req, res, next ){
    //
    // post 拿数据的方法是 const obj = req.body;
    // get 拿数据的方法是 const obj = req.query；
    let  {id, images,name, brand, sale,address,price} = req.body;
    
   price = price*1;
    id = id*1;
    sql.find("sh1811", "product", {id:id} ).then(data =>{
      if(data.length == 0){
        //数据库中没有商品数据;直接进行添加，，
        sql.insert("sh1811", "product", {id, images,name,brand,sale,address,price})
        .then(() =>{
          // res.redirect("/product")//成功之后返回产品管理页面product.ejs
          res.send({
            code: 200,
            message: 'success',
            data: 1})
        })
        .catch((err) =>{
          // res.redirect("/product/add")//添加失败之后返回添加页面;
        });
      }else{
        //商品已存在的
        // res.redirect("/product")//商品已存在的话，不需要添加，直接返回产品页面
        res.send({
          code: 200,
          message: 'success',
          data: 0
        })
      }
  }).catch(err =>{
    // res.redirect('/product/add');//只要出现添加异常，就重新返回添加产品页面，
    res.send({
      code: 200,
      message: 'success',
      data: -1
    })
  });
  })
//删除商品
router.get("/remove",function(req, res, next ){
    let { id } =req.query;
    id = id*1;
    sql.remove("sh1811", "product",{ id }).then( ()=>{
      // res.redirect("/product");//不管删除成功或是失败，都返回user.ejs页面；
      res.send({
        code: 200,
        message: 'success',
        data: 1
      })
    }).catch((err) =>{
      // res.redirect("/product")
      res.send({
        code: 200,
        message: 'success',
        data: 0
      })
    });
  })
  router.get("/detail",function(req, res, next ){
    let { id } =req.query;
    id = id*1;
    sql.find('sh1811', 'product', { id: eval('/'+id+'/') }).then(data => {
      sql.distinct("sh1811", "product", "brand").then((brandArr) =>{
      // res.redirect("/product");//不管删除成功或是失败，都返回user.ejs页面；
      res.send({
        code: 200,
        message: 'success',
        data: 1,
      })
    }).catch((err) =>{
      // res.redirect("/product")
      res.send({
        code: 200,
        message: 'success',
        data: 0
      })
    });
  })
  })
  //删除全部商品
router.get("/deleteall", function(req, res, next){
    sql.remove("sh1811", "product", {}).then( ()=>{
      // res.redirect("/product");
      res.send({
        code: 200,
        message: 'success',
        data: 0
      })
    }).catch((err) =>{
      // res.redirect("/product")
      res.send({
        code: 200,
        message: 'success',
        data: 0
      })
    });
})
//修改
router.post("/updateAction", function(req, res, next){
      let  {id, images,name, brand, sale,address,price} = req.body;
      price =price *1;//转化为number类型
      id = id*1;
      
      //post的获取数据的方法；
      sql.update("sh1811", "product", "updateOne", { id},  { $set :{images,name, brand, sale, address, price}})
    .then(() =>{//修改成功或者失败都会返回product.ejs页面；
      // res.redirect("/product");
      res.send({
        code: 200,
        message: 'success',
        data: 1
      })
    }).catch(err =>{
      // res.redirect("/product");
      res.send({
        code: 200,
        message: 'success',
        data: 1
      })
    })
    });


router.get('/searchN', (req, res, next) => {
	const { name } = req.query;
	sql.find('sh1811', 'product', { name: eval('/'+name+'/') }).then(data => {
        sql.distinct("sh1811", "product", "brand").then((brandArr) =>{//成功之后返回的数据
      res.send(data)
    })
	})
})
router.get('/searchI', (req, res, next) => {
	const { id } = req.query;
	sql.find('sh1811', 'product', { id: id*1 }).then(data => {
      res.send(data)
	})
})
//分类
router.get("/distinct", (req, res, next) =>{
    sql.distinct("sh1811", "product", "brand").then((brandArr) =>{//成功之后返回的数据;
        res.send(brandArr);
    })
})
router.get("/brandSearch" , (req, res, next) =>{
    let { brand } = req.query;
    sql.find("sh1811" , "product" , { brand }).then((data) =>{
       sql.distinct("sh1811", "product", "brand").then((brandArr) =>{
          //  res.render("product", {
          //      activeIndex:3,
          //      totalNumber:1,
          //      pageCode: 1,
          //      data,
          //      pageNumber: data.length,
          //      brandArr
          //  })
          res.send({
            code: 200,
            message: 'success',
            data: data
          })
       })
    })
})

// // 排序；

router.get("/sort", (req, res, next) =>{
    let { type, num} = req.query;
    let sortData = {};
    sortData[type] = num * 1;
    sql.sort("sh1811", "product", sortData).then((data) =>{
        sql.distinct("sh1811", "product", "price").then( (brandArr) =>{
            // res.render("product", {
            //     activeIndex:3,
            //     totalNumber:1,
            //     pageCode:1,
            //     data,
            //     pageNumber:data.length,
            //     brandArr
            // })
            res.send({
              code: 200,
              message: 'success',
              data: data
            })
        })
    })
})
router.get("/distinct", (req, res, next) =>{
  sql.distinct("sh1811", "product", "price").then((priceArr) =>{//成功之后返回的数据;
      res.send(priceArr);
  })
})
module.exports = router;
