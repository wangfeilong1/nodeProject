var express = require('express');
var router = express.Router();
var sql = require("./../tool/sql");//引入数据库封装的sql方法
// var xlsx = require("node-xlsx");  //这个是引入的解析Excel表格的数据的包‘
var filemd = require("./../tool/file_product");//引入封装好的导入数据方法；

    // //查询数据并显示产品数据；
    // router.get('/', function(req, res, next) {
    //     sql.find('sh1811', 'product', {}).then(data => {
    //         res.render('product', { 
    //             activeIndex: 3,
    //             data    //  < == > data: data
    //         });
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // });
/* GET users listing. */
// 用户是否登录的验证
router.get('/', function(req, res, next) {
  if (req.session.isLogin != 1) { // 表示未登录
    res.redirect('/login'); // 跳转到登录页面
    return; // 代码将不再继续往下执行
  }
      let { pageCode, pageNumber } = req.query;
      pageCode = pageCode *1 || 1;
      pageNumber = pageNumber * 1 || 8;
      sql.find("sh1811", "product", {}).then((data) =>{
        const totalNumber = Math.ceil( data.length / pageNumber);
        data = data.splice((pageCode - 1) * pageNumber, pageNumber)
        sql.distinct("sh1811", "product", "brand").then((brandArr) =>{//成功之后返回的数据;
                res.render("product", {  // res.render("users")   路由可以直接跳转到用户页面；
                        activeIndex:3,
                        totalNumber,
                        pageCode,
                        pageNumber,
                        data,
                        brandArr
                    });
            })
        
    }).catch((err) =>{
      console.log(err)
    })                                    
});


// 侧边栏样式
    router.get("/add", function(req,res,next){
        res.render("product_add", {
          activeIndex:3
        });
      })
      //添加用户
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
          res.redirect("/product")//成功之后返回产品管理页面product.ejs
        })
        .catch((err) =>{
          res.redirect("/product/add")//添加失败之后返回添加页面;
        });
      }else{
        //商品已存在的
        res.redirect("/product")//商品已存在的话，不需要添加，直接返回产品页面
      }
  }).catch(err =>{
    res.redirect('/product/add');//只要出现添加异常，就重新返回添加产品页面，
  });
  })
//删除商品
router.get("/remove",function(req, res, next ){
    let { id } =req.query;
    id = id*1;
    sql.remove("sh1811", "product",{ id }).then( ()=>{
      res.redirect("/product");//不管删除成功或是失败，都返回user.ejs页面；
    }).catch((err) =>{
      res.redirect("/product")
    });
  })
  //删除全部商品
router.get("/deleteall", function(req, res, next){
    sql.remove("sh1811", "product", {}).then( ()=>{
      res.redirect("/product");
    }).catch((err) =>{
      res.redirect("/product")
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
      res.redirect("/product");
    }).catch(err =>{
      res.redirect("/product");
    })
    });

// 导入数据
// const usersxlsx ="D:/第三阶段/week1-2node/test/myapp/product.xlsx";//绝对路径’
 const usersxlsx ="/usr/local/node-pro/test/myapp/product.xlsx";

router.get("/importProducts", (req, res, next) =>{
    filemd.analysisdata(usersxlsx).then((obj) =>{
      console.log('ok');
      console.log(obj);//获取的所有的数据，为数组形式的
      const data = obj[0].data;//获取第一个表的数据
      console.log(data);//获的第一个表的所有数据[ [ 'tel', 'nickname', 'password' ],
      const result = filemd.usersfilterdata(data);
      console.log(result)
      sql.insert("sh1811",  "product",  result).then( ()=>{
        res.redirect("/product")
      })
    })
})
// 导出数据
router.get('/exportProducts', (req, res, next) => {
	const _headers =  [
		{caption:'id',type:'string'},
		{caption:'images',type:'string'},
        {caption:'name',type:'string'},
        {caption:'brand',type:'string'},
        {caption:'sale',type:'string'},
        {caption:'address',type:'string'},
        {caption:'price',type:'number'}
    ];
	sql.find('sh1811', 'product', {}).then(data => {
		let alldata = new Array();
    data.map((item, index) => {
      let arr = [];
      arr.push(item.id);
      arr.push(item.images);
      arr.push(item.name);
      arr.push(item.brand);
      arr.push(item.sale);
      arr.push(item.address);
      arr.push(item.price);
      alldata.push(arr);
		})
		const result = filemd.exportdata(_headers, alldata);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		res.setHeader("Content-Disposition", "attachment; filename=" + "product.xlsx");
		res.end(result, 'binary');
	})
})
// 搜索和分页
router.get('/search', (req, res, next) => {
	const { name } = req.query;
	sql.find('sh1811', 'product', { name: eval('/'+name+'/') }).then(data => {
        sql.distinct("sh1811", "product", "brand").then((brandArr) =>{//成功之后返回的数据
			res.render('product', {
				activeIndex: 3,
				totalNumber: 1,
				pageCode: 1,
				data,
                pageNumber: data.length,
                brandArr
            })
        })
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
           res.render("product", {
               activeIndex:3,
               totalNumber:1,
               pageCode: 1,
               data,
               pageNumber: data.length,
               brandArr
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
            res.render("product", {
                activeIndex:3,
                totalNumber:1,
                pageCode:1,
                data,
                pageNumber:data.length,
                brandArr
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
