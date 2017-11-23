var pool = require('./dao');
var utils = require('../utils/utils'); 
var logger = require('../utils/log4jsutil').logger(__dirname+'/reportDao.js');

const REPORT_TABLE = 'report'; 
module.exports = {
	/**
	 * 添加举报
	 */
	addReport(userid,type,report,custom,rid,ruserid,callback){
		var time = utils.getTime();
        var sql = 'INSERT INTO '+REPORT_TABLE+' (userid,type,report,custom,rid,ruserid,time) VALUES (?,?,?,?,?,?,?)';
        pool.getConnection(function(err, connection) {
            connection.query(sql,[userid,type,report,custom,rid,ruserid,time], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	},

}