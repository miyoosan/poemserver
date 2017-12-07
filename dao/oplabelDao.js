var pool = require('./dao');
var utils = require('../utils/utils'); 
var logger = require('../utils/log4jsutil').logger(__dirname+'/poemDao.js');
const OPLABEL_TABLE = 'oplabel'; 
module.exports = {
	 /**
     *查询最新官方作品标签
     */
	queryOPLabels(callback){

        var sql = 'SELECT * FROM '+OPLABEL_TABLE;
		pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    queryOPLabelsFType(type,callback){

        var sql = 'SELECT temp.* FROM '+OPLABEL_TABLE+' temp WHERE id = (SELECT MAX(id) FROM '+OPLABEL_TABLE+' WHERE author = temp.author) ORDER BY temp.author';
        if(type == 1){
            sql = 'SELECT temp.* FROM '+OPLABEL_TABLE+' temp WHERE id = (SELECT MAX(id) FROM '+OPLABEL_TABLE+' WHERE dynasty = temp.dynasty) ORDER BY temp.dynasty'; 
        }
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    queryAuthor(author,callback){
        var sql = 'SELECT * FROM '+OPLABEL_TABLE+' WHERE author = ? AND del = 0 LIMIT 1';
        pool.getConnection(function(err, connection) {
            connection.query(sql, author, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
}