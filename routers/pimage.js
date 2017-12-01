/**
 * 图片服务器
 */
var express = require('express');
var router = express.Router();
//fs读取和写入文件
var fs = require('fs');
var path = require('path'); 
var crypto = require('crypto');
var multiparty = require('multiparty');
var gm = require('gm').subClass({imageMagick: true});;

var ResJson = function(){
	this.code;
	this.data;
	this.errmsg ;
}
/**
 * 返回错误
 */
function resError(res,err){
	console.error(err)
	var resjson = new ResJson();
	resjson.code = 1;
	resjson.errmsg = err;
	res.json(resjson);
  console.log('---res err--- err:',err);
}
/**
 * 返回成功
 */
function resSuccess(res,data){
	var resjson = new ResJson();
	resjson.code = 0;
	resjson.data = data;
	res.json(resjson);
  console.log('---res succes--- data:',data);
}
function logReq(req){
  console.log('url:/pimage'+req.originalUrl+' body:'+JSON.stringify(req.body));
}

router.post('/upload', function (req, res) {
    logReq(req);
    if(Object.keys(req.body).length<=0) {
        resError(res,'参数错误');
        return;
    }
    var jsonBody = req.body;
    //解析jsonBody
    var file = jsonBody['_parts'][0][1];

    // console.log('jsonBody=====' + JSON.stringify(jsonBody) + 'file====' + JSON.stringify(file));

    var response;
    //设置写入文件的路径
    var file_path = path.join(__dirname, '../images/');
    var file_name = Date.now()+'_'+file['name']
    var file_md5_name = crypto.createHash('md5').update(file_name).digest('hex')
    var des_file = file_path + file_md5_name;
    //读取文件地址
    fs.readFile(file['uri'], function (err, data) {
      if(err){
        console.error(err);
      }
        //开始写入文件
        fs.writeFile(des_file, data, function (err) {
            if(err) {
                resError(res,err);
            }else {
                resSuccess(res,{name:file_md5_name})
            }
        })
    })
});

router.get('/file/:fileName', function(req, res, next) {
  logReq(req);
 // 实现文件下载 
 var fileName = req.params.fileName;
 console.log('fileName:'+fileName);
 // console.log('----------------------------fileName:',fileName)
 var file_path = path.join(__dirname, '../images/');
 var filePath = path.join(file_path, fileName);
 var stats = fs.statSync(filePath); 
 if(stats.isFile()){
  res.set({
   'Content-Type': 'application/octet-stream',
   'Content-Disposition': 'attachment; filename='+fileName,
   'Content-Length': stats.size
  });
  fs.createReadStream(filePath).pipe(res);
 } else {
  res.end(404);
 }
});


router.post('/uploadimg', function(req, res, next){
    logReq(req);
    // console.log(req)
    console.log(req.get('Content-Type'));
    var file_path = path.join(__dirname, '../images/');
    var form = new multiparty.Form({uploadDir: file_path});
    form.parse(req, function(err, fields, files){
      // console.log('---fields.info');
      // console.log(fields)
      // console.log(fields.info)
      // console.log(fields.info1)
      // console.log(typeof(fields.info[0]))
      // console.log(fields.info[0])
      // console.log(JSON.parse(fields.info[0]).zoom)
      // console.log('---files');
      // console.log(files);
        let zoom = 8;//基础缩放
        if(fields.info != undefined&&fields.info[0]){
          zoom = JSON.parse(fields.info[0]).zoom;//客户端自定义缩放参数
        }
        console.log('---zoom:',zoom)
        if(err){
            resError(res,err);
        }else{
            var inputFile = files.file[0];
            console.log('---inputFile');
            console.log(inputFile);
            var file_name = Date.now()+'_'+inputFile.originalFilename;
            var file_md5_name = crypto.createHash('md5').update(file_name).digest('hex');
            var uploadedPath = inputFile.path;
            var dstPath = file_path + file_md5_name;
            var bigPath = file_path + file_md5_name+'_big'
            fs.rename(uploadedPath, bigPath, function(err) {
                if(err){
                    resError(res,err);
                } else {
                      console.log('------压缩图片')
                      gm(bigPath)
                              .size(function (err, size) {
                                console.log('---获取图片尺寸')
                                console.log(size)
                                if (err){
                                    resError(res,err);
                                }else{
                                  // let zoom = 8;
                                  let width = size.width/zoom;
                                  let height = size.height/zoom;
                                  console.log('---压缩图片尺寸')
                                  console.log('-----width:',width)
                                  console.log('-----height:',height)
                                  gm(bigPath)
                                  .resize(width, height)
                                  .noProfile()
                                  .write(dstPath, function (err) {
                                    if (err){
                                        resError(res,err);
                                    }else{
                                        resSuccess(res,{name:file_md5_name});
                                    }
                                  });
                                }
                     });
                }
            });
        }
    });

});

module.exports = router;
