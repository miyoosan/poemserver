var express = require('express');
var router = express.Router();
var starDao = require('../dao/starDao')
var ru = require('../utils/routersutil');
var logger = require('../utils/log4jsutil').logger(__dirname+'/star.js');

router.get('/', function(req, res, next) {
	res.send('star');
});
router.post('/star', function(req, res, next) {
	ru.logReq(req);
	var userid = req.body.userid;
	var type = req.body.type;
	var sid = req.body.sid;
	var star = req.body.star;
	if(!userid||!type||!sid){
		ru.resError(res,'参数错误');
	}else{
		starDao.upStar(userid,type,sid,star,function(err,result){
			if(err){
				ru.resError(res,err);
			}else{
				ru.resSuccess(res,{userid:userid,type:type,sid:sid,star:star});
			}
		});
	}
});

router.post('/nstars', function(req, res, next) {
	ru.logReq(req);
	var userid = req.body.userid;
	var type = req.body.type;
	var id = req.body.id;
	if(!userid||!type){
		ru.resError(res,'参数错误');
	}else{
		starDao.queryNStars(userid,type,id,function(err,result){
			if(err){
				ru.resError(res,err);
			}else{
				ru.resSuccess(res,result);
			}
		});
	}
});

router.post('/hstars', function(req, res, next) {
	ru.logReq(req);
	var userid = req.body.userid;
	var type = req.body.type;
	var id = req.body.id;
	if(!userid||!type){
		ru.resError(res,'参数错误');
	}else{
		starDao.queryHStars(userid,type,id,function(err,result){
			if(err){
				ru.resError(res,err);
			}else{
				ru.resSuccess(res,result);
			}
		});
	}
});

module.exports = router;