/**
 * 收藏 dao
 * @type {[type]}
 */
var logger = require('../utils/log4jsutil').logger(__dirname+'/starDao.js');
var pool = require('./dao');
var utils = require('../utils/utils'); 
var dbtable = require('./dbtable').dbtable;

const STAR_TABLE = 'star'; 
const POEM_TABLE = 'poem'; 
const OPOEM_TABLE = 'opoem'; 
const DISCUSS_TABLE = dbtable.DISCUSS_TABLE; 
const LIMIT_NUM = '100';

module.exports = {
	/**
	 * 收藏取消
	 */
	upStar(userid,type,sid,star,callback){
        var time = utils.getTime();
        pool.getConnection(function(err, connection) {
            var sql = 'INSERT INTO '+STAR_TABLE+' (userid,type,sid,star,time) VALUES ("'+userid+'",'+type+','+sid+','+star+','+time+') ON DUPLICATE KEY UPDATE star='+star+' AND time = '+time;
            connection.query(sql,function(err,result){
                callback(err, result)
                connection.release();               
            });
        });
	},
    queryNStars(userid,type,id,callback){
        var sql = 'SELECT * FROM '+STAR_TABLE+' WHERE sid > ? AND userid = ? AND type = ? AND star = 1 AND del = 0 ORDER BY sid DESC LIMIT '+LIMIT_NUM;
        if(type == 1){
            sql = 'SELECT '+POEM_TABLE+'.* FROM ('+sql+') AS star LEFT JOIN '+POEM_TABLE+' ON star.sid = '+POEM_TABLE+'.id';
        }else if(type == 2){
            sql = 'SELECT '+OPOEM_TABLE+'.* FROM ('+sql+') AS star LEFT JOIN '+OPOEM_TABLE+' ON star.sid = '+OPOEM_TABLE+'.id';
        }else if(type == 3){
            sql = 'SELECT '+DISCUSS_TABLE+'.* FROM ('+sql+') AS star LEFT JOIN '+DISCUSS_TABLE+' ON star.sid = '+DISCUSS_TABLE+'.id';
        }
        console.log(sql)
        pool.getConnection(function(err, connection) {
            connection.query(sql, [id,userid,type], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    queryHStars(userid,type,id,callback){
        var sql = 'SELECT * FROM '+STAR_TABLE+' WHERE sid < ? AND userid = ? AND type = ? AND star = 1  AND del = 0 ORDER BY sid DESC LIMIT '+LIMIT_NUM;
        if(type == 1){
            sql = 'SELECT '+POEM_TABLE+'.* FROM ('+sql+') AS star LEFT JOIN '+POEM_TABLE+' ON star.sid = '+POEM_TABLE+'.id';
        }else if(type == 2){
            sql = 'SELECT '+OPOEM_TABLE+'.* FROM ('+sql+') AS star LEFT JOIN '+OPOEM_TABLE+' ON star.sid = '+OPOEM_TABLE+'.id';
        }else if(type == 3){
            sql = 'SELECT '+DISCUSS_TABLE+'.* FROM ('+sql+') AS star LEFT JOIN '+DISCUSS_TABLE+' ON star.sid = '+DISCUSS_TABLE+'.id';
        }
        pool.getConnection(function(err, connection) {
            connection.query(sql, [id,userid,type], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },

}