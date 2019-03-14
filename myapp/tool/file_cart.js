var xlsx = require("node-xlsx");//导入数据所引入的包

var nodeExcel = require('excel-export');//导出数据所引入的包

const filemd = {
    //导入数据
    analysisdata (path) {
        return new Promise((resolve, reject) =>{
            const obj  = xlsx.parse(path);//将所有的数据转化为对象
            resolve(obj);//成功之后返回数据
        })
    },
    //过滤数据
    usersfilterdata (data ) {
        let arr = [];
        data.map((item, index) =>{
            if(index !== 0) {//解析的第一条数据不是数据内容，不使用，第一条数据是表头
                arr.push({
                    id: item[0],
                    img: item[1],
                    title: item[2]
                })//转换为数组里面存放对象；
            }
        })
        return arr;
    },
    //导出数据
    exportdata (_headers, rows) {
        var conf ={};
        conf.name = "mysheet";
        conf.cols = [];
        for(var i = 0; i < _headers.length; i++){
            var col = {};
            col.caption = _headers[i].caption;
            col.type = _headers[i].type;
            conf.cols.push(col);
        }
        conf.rows = rows;
        var result = nodeExcel.execute(conf);
        return result;
    }
   
}
module.exports = filemd;