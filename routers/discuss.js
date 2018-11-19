/**
 * 讨论
 */
var logger = require('../utils/log4jsutil').logger(__dirname+'/discuss.js');
var express = require('express');
var router = express.Router();
var utils = require('../utils/utils'); 
var httputil = require('../utils/httputil'); 
var ru = require('../utils/routersutil');
var {AddDiscussExtend,DLoveExtend,DCommentExtend,Notice,NoticeType} = require('../utils/module');

/*---db---*/
var dbDao = require('../dao/dbDao');
var userDao = dbDao.userDao;
var discussDao = dbDao.discussDao;

router.get('/', function(req, res, next) {
	res.send('discuss');
})	
/**
 * 添加作品
 */
router.post('/add', function(req, res, next) {
	ru.logReq(req);
    var userid = req.body.userid;
    var title = req.body.title;
    var content = req.body.content;
    var extend = req.body.extend;
    if(!title||!content||!userid){
		ru.resError(res,'参数错误');
    }else{
    	discussDao.addDiscuss(userid,title,content,extend,function(err,result){
	    	if(err){
				ru.resError(res,err);
	    	}else{
	    		var poem = {};
	    		if(result.length > 0){
	    			poem = result[0];
	    		}
				ru.resSuccess(res,poem);
				// console.log(poem)
				userDao.queryFollowMe(userid,function(err,result){
					if(err){
						logger.error(err);
					}else{
						if(result.length > 0){
							let messages = [];
							for(var i = 0 ; i < result.length ; i ++){
								var title = poem.nickname+'发布了新讨论';
							    var content = poem.nickname+'发布了['+poem.title+']';
								var addDiscussExtend = new AddDiscussExtend(poem.id,poem.userid,poem.head,poem.nickname,poem.title);
							    var message = new Notice(NoticeType.DADD,result[i].fansid,title,content,addDiscussExtend);
								messages.push(message)
							}
							httputil.requstPSPost('/cmapp/message/actionmsgs',{messages:messages},function(err,result){
					    		logger.debug(err);
					    		logger.debug(result);
					    	}); 
						}
					}
				})
	    	}
	    })
    }

});
/**
 * 删除作品
 */
router.post('/del', function(req, res, next) {
	ru.logReq(req);
    var userid = req.body.userid;
    var id = req.body.id;
    if(!id||!userid){
    	ru.resError(res,'参数错误');
    }else{
    	discussDao.delDiscuss(id,userid,function(err,result){
	    	if(err){
	    		ru.resError(res,err);
	    	}else{
	    		var poem = {id:parseInt(id),userid:userid};
				ru.resSuccess(res,poem);
	    	}
	    })
    }
});
/**
 * 作品详情
 */
router.post('/info', function(req, res, next) {
	ru.logReq(req);
	var id = req.body.id;
	var userid = req.body.userid;
	if(!id){
		ru.resError(res,'参数错误')
	}else{
		discussDao.queryDiscussInfo(id,userid,function(err,result){
			if(err){
	    		ru.resError(res,err)
	    	}else{
	    		if(result.del == 1){
	    			ru.resError(res,'作品已删除')
	    		}else{
		    		ru.resSuccess(res,result);
	    		}
	    	}
		});
	}
});

/**
 * 我的最新讨论
 */
router.post('/nmydiscuss', function(req, res, next) {
	ru.logReq(req);
	var userid = req.body.userid;
    var id = req.body.id;
    if(!userid){
		ru.resError(res,'参数错误');
    }else{
    	 discussDao.queryNMyDiscuss(userid,id,function(err,poems){
	    	if(err){
	    	 	logger.error(err);
				ru.resError(res,err);
	    	}else{
	    		ru.resSuccess(res,poems);
	    	}
	    })
    }
});	
/**
 * 我的历史讨论
 */
router.post('/hmydiscuss', function(req, res, next) {
	ru.logReq(req)
	var userid = req.body.userid;
    var id = req.body.id;
    if(!userid){
    	resError(res,'参数错误');
    }else{
    	discussDao.queryHMyDiscuss(userid,id,function(err,poems){
	    	if(err){
				ru.resError(res,err);
	    	}else{
	    		ru.resSuccess(res,poems);
	    	}
	    });
    }
});	
/**
 * 最新作品
 */
router.post('/ndiscuss', function(req, res, next) {
	ru.logReq(req);
    var id = req.body.id;
    var userid = req.body.userid;
    discussDao.queryNDiscuss(id,userid,function(err,poems){
    	if(err){
    		ru.resError(res,err);
    	}else{
    		ru.resSuccess(res,poems);
    	}
    })
});	
/**
 * 历史作品
 */
router.post('/hdiscuss', function(req, res, next) {
	ru.logReq(req);
    var id = req.body.id;
    var userid = req.body.userid;
    discussDao.queryHDiscuss(id,userid,function(err,poems){
    	if(err){
			ru.resError(res,err);
    	}else{
    		ru.resSuccess(res,poems);
    	}
    });
});	

/**
 * 点赞
 */
router.post('/love', function(req, res, next) {
	ru.logReq(req);
    var id = req.body.id;
    var userid = req.body.userid;
    var love = req.body.love;
    var time = utils.getTime();
    if(!id||!userid){
    	ru.resError(res,'参数错误');
    	return ;
    }
    discussDao.queryDiscuss(id,function(err,result){
    	if(err){
    		ru.resError(res,err);
    	}else{
    		if(result.length > 0 ){
    			   discussDao.loveDiscuss(id,userid,love,function(err,love){  	
						if(err){
				    		ru.resError(res,err);
				    	}else{
				    		if(love.love == 1){
				    			discussDao.queryOpDiscuss(id,userid,function(err,poem){
				    				if(userid != poem.userid){//自己点赞自己不发消息
										var title = '有人赞了你的讨论';
									    var content = poem.opnickname+'赞了['+poem.title+']';
										var loveExtend = new DLoveExtend(poem.title,poem.opuser,poem.ophead,poem.opnickname,id);
									    var message = new Notice(NoticeType.DLOVE,poem.userid,title,content,loveExtend);
								    	httputil.requstPSPost('/cmapp/message/actionmsg',message,function(err,result){
								    		logger.debug(err);
								    		logger.debug(result);
								    	}); 
				    				}
						    	});
				    		}
				    		ru.resSuccess(res,love);
				    	}
				    });
    		}else{
				ru.resError(res,'作品不存在或者已经被删除！');
    		}
    	}
    })
});	
/**
 * 获取点赞列表
 */
router.post('/loves', function(req, res, next) {
	ru.logReq(req);
	var pid = req.body.id;
	if(!pid){
		resError(res,'参数错误')
	}else{
		discussDao.queryLoves(pid,function(err,result){
			if(err){
	    		ru.resError(res,err)
	    	}else{
	    		ru.resSuccess(res,result);
	    	}
		});
	}
});




module.exports = router;



