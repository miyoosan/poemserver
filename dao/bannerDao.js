var pool = require('./dao');
var utils = require('../utils/utils'); 
var logger = require('../utils/log4jsutil').logger(__dirname+'/bannerDao.js');

const BANNER_TABLE = 'banner'; 

module.exports = {
	/**
	 * 查询banners
	 */
	queryNewestBanner(fromid,callback){
		var sql = 'SELECT * FROM '+BANNER_TABLE+' WHERE id>? AND state = 1 AND del = 0 ORDER BY id ASC ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, fromid, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
}