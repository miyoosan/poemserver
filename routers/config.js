var logger = require('../utils/log4jsutil').logger(__dirname+'/config.js');
var server = {
        sms:'',//短信 ali 阿里 jpush 极光
        push:true,//推送
        validate:true,//验证码
        mysqldb:'default',//'default' 默认 'docker'   阿里云'ali' 
}
server.debug = 'debug';
server.ali = 'ali';

server.env = server.debug;
// server.env = server.ali;

if(server.env == server.ali){
    server.sms = 'jpush';
    server.push = true;
    server.validate = true;
    server.mysqldb = 'ali';
}else{

}

logger.info('------ sever config')
logger.info('------ run dev:'+server.env)
logger.info('------ sms type:'+server.sms)
logger.info('------ push state:'+server.push)
logger.info('------ validate statr:'+server.validate)
logger.info('------ mysqldb name:'+server.mysqldb)

//配置项
module.exports = {
    tables:{
    	USER_TABLE:'users',
    	POEM_TABLE:'poem',
    	LOVE_TABLE:'love',
    	COMMENT_TABLE:'comment',
    	FOLLOW_TABLE:'follow',
    },
    server,
};