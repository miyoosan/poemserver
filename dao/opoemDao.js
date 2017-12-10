var pool = require('./dao');
var utils = require('../utils/utils'); 
var logger = require('../utils/log4jsutil').logger(__dirname+'/poemDao.js');
const OPOEM_TABLE = 'opoem'; 
const STAR_TABLE = 'star';
const LIMIT_NUM = '100';
module.exports = {
	 /**
     *查询最新官方作品
     */
	queryNewestOPoem(fromid,type,label,callback){
		var sql = 'SELECT * FROM '+OPOEM_TABLE+' WHERE id>?  AND del = 0  AND author = ? ORDER BY id DESC LIMIT '+LIMIT_NUM;
		if(type == 1){
			sql = 'SELECT * FROM '+OPOEM_TABLE+' WHERE id>?  AND del = 0  AND dynasty = ? ORDER BY id DESC LIMIT '+LIMIT_NUM;			
		}
		pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,label], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    /**
     *查询历史官方作品
     */
	queryHistoryOPoem(fromid,type,label,callback){
		var sql = 'SELECT * FROM '+OPOEM_TABLE+' WHERE id < ?  AND del = 0 AND author = ? ORDER BY id DESC LIMIT '+LIMIT_NUM;
		if(type == 1){
			sql = 'SELECT * FROM '+OPOEM_TABLE+' WHERE id < ?  AND del = 0 AND dynasty = ? ORDER BY id DESC LIMIT '+LIMIT_NUM;
		}
		pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,label], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	querySearchOPoem(search,callback){ 
		var sql = 'SELECT * FROM '+OPOEM_TABLE+' WHERE CONCAT(IFNULL(`title`,\'\'),IFNULL(`content`,\'\'),IFNULL(`author`,\'\'),IFNULL(`dynasty`,\'\'))  LIKE \'%'+search+'%\' ORDER BY id DESC LIMIT 100';
		pool.getConnection(function(err, connection) {
            connection.query(sql,function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},

	queryOPoem(userid,id,callback){
		var opoem_sql = 'SELECT * FROM '+OPOEM_TABLE+' WHERE id = '+id+' AND del = 0 LIMIT 1';
        var star_sql = 'SELECT * FROM '+STAR_TABLE+' WHERE type = 2 AND sid = '+id+' AND userid = "'+userid+'" LIMIT 1';
        var sql = opoem_sql +';'+star_sql;
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    var opoem = {};
                    if(result[0].length > 0){
                        opoem = result[0][0];
                        if(result[1].length > 0){
                            opoem.star = result[1][0].star;
                        }
                    }
                    console.log(opoem);
                    callback(err, opoem)
                    connection.release();
                }
            });
        });
	}

}