/**
 * 云控配置
 */
var logger = require('../utils/log4jsutil').logger(__dirname+'/cloud_config.js');
var express = require('express');
var router = express.Router();
var httputil = require('../utils/httputil'); 
var utils = require('../utils/utils'); 
var server = require('../conf/config').server;
var ru = require('../utils/routersutil');

router.get('/', function(req, res, next) {
	try{
		ru.logReq(req);
		var req_url = utils.getEcosystem()+'/papp/cloud_config?app_name='+server.app_name;
		httputil.requstUrl(req_url,function(err,result){
			if(err){
				ru.resError(res,err);
			}else{
				result = JSON.parse(result);
				console.log(result )
				if(result.code == 0){
					ru.resSuccess(res,result.data);
				}else{
					ru.resError(res,result.errmsg);
				}
			}
		})
	}catch(err){
		ru.resError(res,err.message);
	}
});

router.post('/', function(req, res, next) {
  	try{
		ru.logReq(req);
		var req_url = utils.getEcosystem()+'/papp/cloud_config?app_name='+server.app_name;
		httputil.requstUrl(req_url,function(err,result){
			if(err){
				ru.resError(res,err);
			}else{
				result = JSON.parse(result);
				console.log(result )
				if(result.code == 0){
					ru.resSuccess(res,result.data);
				}else{
					ru.resError(res,result.errmsg);
				}
			}
		})
	}catch(err){
		ru.resError(res,err.message);
	}
});

module.exports = router;