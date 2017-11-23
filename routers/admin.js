var express = require('express');
var router = express.Router();
var ru = require('../utils/routersutil');
var httputil = require('../utils/httputil');
var poemDao = require('../dao/poemDao');
var logger = require('../utils/log4jsutil').logger(__dirname+'/admin.js');
var {DelPoemExtend,Message,MessageType} = require('../utils/module');
router.get('/', function(req, res, next) {
	ru.logReq(req);
    res.send('admin');
});

router.post('/user', function(req, res, next) {
	ru.logReq(req);
	var body = req.body;
	httputil.requstPSPost('/user/query',body,function(err,result){
		if(err){
			ru.resError(res,err)
		}else{
			ru.resSuccess(res,result);
		}
	});
});


router.post('/pushall', function(req, res, next) {
	ru.logReq(req);
	var body = req.body;
	httputil.requstPSPost('/message/pushall',body,function(err,result){
		if(err){
			ru.resError(res,err)
		}else{
			ru.resSuccess(res,result);
		}
	});
});

router.post('/pushuser', function(req, res, next) {
	ru.logReq(req);
	var body = req.body;
	httputil.requstPSPost('/message/pushuser',body,function(err,result){
		if(err){
			ru.resError(res,err.message)
		}else{
			ru.resSuccess(res,result);
		}
	});
});

/**
 * 违规删除帖子
 */
router.post('/delpoem', function(req, res, next) {
  	ru.logReq(req);
  	var id = req.body.id;
  	var userid = req.body.userid;
  	var reason = req.body.reason;
  	if(!id||!reason){
  		ru.resError(res,'参数错误')
  	}else{
  		poemDao.delPoem(id,userid,function(err,result){
  			if(err){
	    		ru.resError(res,err)
	    	}else{
	    		poemDao.queryPoemInfo(id,userid,function(err,poem){
	    			if(err){
	    				logger.error(err)
	    			}else{
	    				var title = '你的作品已被官方删除';
					    var content = '你的作品['+poem.title+']已被官方删除，理由:'+reason;
					    var delPoemExtend = new DelPoemExtend(poem.id);
					    var message = new Message(MessageType.DELPOEM_MSG,poem.userid,title,content,delPoemExtend);
			    		httputil.requstPSPost('/message/actionmsg',message,function(err,result){
							if(err){
								logger.error(err)
							}
						})
	    			}
		    	});
	    		ru.resSuccess(res,result);
	    	}
  		})
  	}
});
module.exports = router;