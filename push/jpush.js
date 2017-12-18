var JPush = require('jpush-sdk');
var jiguang = require('../conf/jpushconf');
var client = JPush.buildClient(jiguang.appKey, jiguang.masterSecret);

var request = require('request')
var logger = require('../utils/log4jsutil').logger(__dirname+'/jpush.js');
var {PushType} = require('../utils/module');
var server = require('../conf/config').server;
var messageDao = require('../dao/messageDao');

module.exports = {
	sendAllPush:function(title,content,os,callback){
	  logger.info('---发送极光推送')
	  logger.info('---server.push:'+server.push);
	  if(!server.push){
        callback(null,{sendno:'sendno',msg_id:'msg_id'});
        return
      } 
	  logger.info('---title:'+title)
	  logger.info('---content:'+content)
	  logger.info('---os:'+os)
	  var platform = JPush.ALL;
	  var extras = {
	    type:PushType.NEWS,
	  }
	  if(os == 'android'||os == 'ios'){
	      platform = os;
	      // if(os == 'ios'){
	      // 	notification = JPush.ios(content,'',1,true,extras);
	      // }else{
	      // 	notification = JPush.android(content,title,0,extras);
	      // }
	  }
	  // logger.info('---notification:'+notification)
		//easy push
		var production = server.env === server.ali;
	    logger.info('---production:'+production);
		client.push().setPlatform(platform)
		    .setAudience(JPush.ALL)
		    .setNotification(content,
		    	JPush.ios(content,'',1,true,extras),
		    	JPush.android(content,title,0,extras))
	        // .setMessage(content,title,'text',extras)
	        .setOptions(null,null,null,production)
		    .send(function(err, res) {
		        if (err) {
		        	logger.error(err);
		            callback(err,null);
		        } else {
		            callback(null,res);
		        }
		    });
	},
	/**
	 * 发送单个推送
	 */
	sendPush:function(userid,msgid,title,content,pushtype,callback){
      logger.info('---发送极光推送');
	  logger.info('---server.push:'+server.push);
      if(!server.push){
        callback(null,{sendno:'sendno',msg_id:'msg_id'});
        return
      }
      messageDao.getPush(userid,function(err,result){
        if(err){
            logger.error(err)
            callback(err,null);
        }else{
        	logger.info(result);
            if(result.length > 0){
              var push = result[0];
              var pushid =  push.pushid;
              var os = push.os;
              logger.info('---push obj:'+pushid);
              if(pushid){
              	  logger.info('--- msgid:'+msgid+' pushid:'+pushid+' os:'+os);
				  logger.info('---title:'+title);
				  logger.info('---content:'+content);
				  logger.info('---pushtype:'+pushtype);
				  // extras{
				  //   type:'news','chat',
				  // }
				  var extras = {
				    type:pushtype,
				  }
				  try{
				    var platform = JPush.ALL;
				    var notification = content;
				    if(os == 'ios'){
				        platform = 'ios';
				        // {title:title,subtitle:content} 支持json格式
				        notification = JPush.ios({title:title,subtitle:content},'sound.caf',1,true,extras);
				    }else if(os == 'android'){
				        platform = 'android';
				        notification = JPush.android(content,title,0,extras);
				    }
				    logger.info('---extras:');
				    logger.info(extras);
				    var production = server.env === server.ali;
				    logger.info('---production:'+production);
				    client.push().setPlatform(platform)
				      .setAudience(JPush.registration_id(pushid))
				      .setNotification(notification)
				      // .setMessage(content,title,'text',extras)
				      .setOptions(null,null,null,production)
				      .send(function(err, res) {
				          if (err) {
				          	logger.error(err);
				             callback(err,null);
				          } else {
				          	logger.info(res)
				            callback(null,res);
				          }
				      });
				  }catch(err){
				      logger.error(err);
				      callback(err,null);
				  }
              }else{
              	callback('获取用户pushid失败',null);
              } 
            }else{
              callback('获取用户pushid失败',null);
            }
        }
      }); 
	},
	/**
	 * 发送多个推送
	 */
	sendPushs:function(userids,msgid,title,content,pushtype,callback){
      logger.info('---发送极光推送');
	  logger.info('---server.push:'+server.push);
      if(!server.push){
        callback(null,{sendno:'sendno',msg_id:'msg_id'});
        return
      }
      logger.info('---userids:'+userids);
      messageDao.getPushs(userids,function(err,result){
        if(err){
            logger.error(err)
            callback(err,null);
        }else{
        	logger.info(result);
            if(result.length > 0){
              var pushids = '' ;
              for(var i = 0 ; i < result.length ; i ++){
              	var push = result[i];
              	if(push.pushid){
					pushids += push.pushid+',';
              	}
              }
              if(pushids){
              	pushids = pushids.substr(0,pushids.length-1)
              }
              if(pushids){
              	  logger.info('--- msgid:'+msgid+' pushids:');
              	  logger.info(pushids)
				  logger.info('---title:'+title);
				  logger.info('---content:'+content);
				  logger.info('---pushtype:'+pushtype);
				  // extras{
				  //   type:'news','chat',
				  // }
				  var extras = {
				    type:pushtype,
				  }
				  try{
				    logger.info('---extras:');
				    logger.info(extras);
				    var production = server.env === server.ali;
				    logger.info('---production:'+production);
				    client.push().setPlatform(JPush.ALL)
				      .setAudience(JPush.registration_id(pushids))
				      .setNotification(content,JPush.android(content,title,0,extras),JPush.ios({title:title,subtitle:content},'sound.caf',1,true,extras))
				      // .setMessage(content,title,'text',extras)
				      .setOptions(null,null,null,production)
				      .send(function(err, res) {
				          if (err) {
				          	logger.error(err);
				             callback(err,null);
				          } else {
				          	logger.info(res)
				            callback(null,res);
				          }
				      });
				  }catch(err){
				      logger.error(err);
				      callback(err,null);
				  }
              }else{
              	callback('获取用户pushids失败',null);
              } 
            }else{
              callback('获取用户pushids失败',null);
            }
        }
      }); 
	},
	// https://api.sms.jpush.cn/v1/codes
	sendCodeSms:function(phone,code,callback){
		// Content-Type: application/json
		// POST https://api.sms.jpush.cn/v1/codes
		// 	mobile temp_id		
		let requestData = {
			mobile:phone,
			temp_id:1,
			temp_para:{code:code}
		}
		var options = {
			url:'https://api.sms.jpush.cn/v1/messages',
			method:'POST',
			json: true,
			auth: {
			    user: jiguang.appKey,
			    pass: jiguang.masterSecret,
		    },
		    headers: {
		        "content-type": "application/json",
		    },
		    body: requestData,
		}
		logger.info('---jpusn sms')
		logger.info('---options')
		logger.info(options)
		request(options, function(error, response, body) {
			logger.info('---request')
			logger.info(error)
			logger.info(response.statusCode)
			logger.info(body)
		    if (!error && response.statusCode == 200) {
		    	callback(null,body)
		    }else{
		    	if(error){
		    	  callback(error,'')
		    	}else{
		    	  callback(response.statusCode,'')
		    	}
		    }
		}); 
	},

	sendTemplates(callback){
		var options = {
			url:'https://api.sms.jpush.cn/v1/templates/1',
			method:'GET',
			json: true,
			auth: {
			    user: jiguang.appKey,
			    pass: jiguang.masterSecret,
		    },
		}
		logger.info('---jpusn sms')
		logger.info('---options')
		logger.info(options)
		request(options, function(error, response, body) {
			logger.info('---request')
			logger.info(error)
			logger.info(response.statusCode)
			logger.info(body)
		    if (!error && response.statusCode == 200) {
		    	callback(null,body)
		    }else{
		    	if(error){
		    	  callback(error,'')
		    	}else{
		    	  callback(response.statusCode,'')
		    	}
		    }
		}); 
	}

}