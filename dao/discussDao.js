var logger = require('../utils/log4jsutil').logger(__dirname+'/discussDao.js');
var pool = require('./dao');
var utils = require('../utils/utils'); 
var dbtable = require('./dbtable').dbtable; 

const DISCUSS_TABLE = dbtable.DISCUSS_TABLE; 
const USER_TABLE = dbtable.USER_TABLE;
const LOVE_TABLE = dbtable.LOVE_TABLE;
const COMMENT_TABLE = dbtable.COMMENT_TABLE;
const STAR_TABLE = dbtable.STAR_TABLE;
const LIMIT_NUM = '100';
const DIS_TYPE = 3;

module.exports = {
    /*------------作品------------*/
    /**
     * 添加作品
     */
    addDiscuss:function(userid,title,content,extend,callback){
        if(extend instanceof Object){
            extend = JSON.stringify(extend);
        }
        var time = utils.getTime();
        var sql = 'INSERT INTO '+DISCUSS_TABLE+' (userid,title,content,extend,time) VALUES (?,?,?,?,?)';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [userid,title,content,extend,time], function(err, result) {
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    let id = result.insertId;
                    sql = 'SELECT * FROM '+DISCUSS_TABLE+' WHERE id = ?';
                    sql = 'SELECT discuss.*,user.head,user.pseudonym FROM ('+sql+') AS discuss LEFT JOIN '+USER_TABLE+' ON discuss.userid = user.userid';
                    connection.query(sql, [id], function(err, result) {
                        callback(err, result)
                        connection.release();
                    });                                  
                }
            });
        });
    },
    /**
     * 删除作品
     */
    delDiscuss:function(id,userid,callback){
        var sql = 'UPDATE '+DISCUSS_TABLE+' SET del = 1 WHERE id = ? AND userid = ?';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [id,userid], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    /**
     * 查询最新作品 
     */
    queryNMyDiscuss(userid,fromid,callback){
        var sql = 'SELECT * FROM '+DISCUSS_TABLE+' WHERE id>? AND userid = ? AND del = 0 ORDER BY id DESC LIMIT '+LIMIT_NUM;
        sql = 'SELECT form.*,user.head,user.pseudonym,form.time FROM ('+sql+') AS form LEFT JOIN '+USER_TABLE+' ON form.userid = user.userid';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,userid], function(err, result) {
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    var data = {};
                    data.discuss = result;
                    sql = 'SELECT count(*) FROM '+DISCUSS_TABLE+' WHERE userid = ? AND del = 0';
                    connection.query(sql, [userid], function(err, result) {
                        if(!err){
                            data.count = result[0]['count(*)'];
                        }
                        callback(err, data)
                        connection.release();
                    }); 
                }
            });
        });
    },
    /**
     * 查询历史作品
     */
    queryHMyDiscuss(userid,fromid,callback){
        var sql = 'SELECT * FROM '+DISCUSS_TABLE+' WHERE id<? AND userid = ? AND del = 0  ORDER BY id DESC LIMIT '+LIMIT_NUM;
        sql = 'SELECT form.*,user.head,user.pseudonym,form.time FROM ('+sql+') AS form LEFT JOIN '+USER_TABLE+' ON form.userid = user.userid';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,userid], function(err, result) {
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    var data = {};
                    data.discuss = result;
                    sql = 'SELECT count(*) FROM '+DISCUSS_TABLE+' WHERE userid = ? AND del = 0';
                    connection.query(sql,[userid], function(err, result) {
                        if(!err){
                            data.count = result[0]['count(*)'];
                        }
                        callback(err, data)
                        connection.release();
                    }); 
                }
            });
        });
    },
    /**
     * 查询作品基本信息
     */
    queryDiscuss(id,callback){
        var sql = 'SELECT * FROM '+DISCUSS_TABLE+' WHERE id = ? AND del = 0 LIMIT 1';
        pool.getConnection(function(err, connection) {
            connection.query(sql, id, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
        /**
     *作品详情
     */
    queryDiscussInfo(id,userid,callback){
        var poem_sql = 'SELECT * FROM '+DISCUSS_TABLE+' WHERE id = '+id+' LIMIT 1';
        var love_commet_sql = 'SELECT * FROM '+LOVE_TABLE+' WHERE iid = '+id+' AND type = '+DIS_TYPE+' AND userid = "'+userid+'" LIMIT 1';
        // var user_sql = 'SELECT * FROM '+USER_TABLE+' WHERE userid = "'+userid+'" LIMIT 1';
        var star_sql = 'SELECT * FROM '+STAR_TABLE+' WHERE sid = '+id+' AND type = '+DIS_TYPE+' AND userid = "'+userid+'" LIMIT 1';
        console.log(star_sql)
        var sql = poem_sql+';'+love_commet_sql+';'+star_sql;
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
                if(err){
                    callback(err, result)
                    connection.release();
                }else{
                    var obj = {};
                    if(result[0].length > 0){
                        obj = result[0][0];
                        obj.love = 0;
                        if(result[1].length > 0){
                            obj.love = result[1][0].love;
                        }
                        if(result[2].length > 0){
                            obj.star = result[2][0].star;
                            console.log('------star------')
                            console.log(result[2][0])
                        }
                        var user_sql = 'SELECT * FROM '+USER_TABLE+' WHERE userid = "'+obj.userid+'" LIMIT 1';
                        connection.query(user_sql, function(err, result) {
                            if(result.length > 0){
                                obj.pseudonym = result[0].pseudonym;
                                obj.head = result[0].head;
                            }
                            callback(err, obj)
                            connection.release();
                        })
                    }else{
                        callback('作品ID失效', null)
                        connection.release();
                    }
                }
            });
        });
    },
    queryOpDiscuss(id,opuserid,callback){
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(err){
                var poem = {};
                var user = {};
                var opuser = {};
                var userid = '';
                var sql0 = 'SELECT * FROM '+DISCUSS_TABLE+' WHERE id = '+id+' LIMIT 1';
                logger.debug('---sql0---');
                connection.query(sql0, function(err, result) {
                    // logger.debug(sql0);
                    // logger.debug(err);
                    // logger.debug(result);
                    if(err){

                    }else{
                        if(result.length > 0){
                         poem = result[0];
                         userid = poem.userid;
                         logger.debug(userid);
                            logger.debug('---sql1---');
                            var sql1 = 'SELECT * FROM '+USER_TABLE+' WHERE userid = "'+userid+'" LIMIT 1';
                            connection.query(sql1, function(err, result) {
                                // logger.debug(sql1);
                                // logger.debug(err);
                                // logger.debug(result);
                                if(err){

                                }else{
                                    if(result.length > 0){
                                     user = result[0];
                                     poem.head = user.head;
                                     poem.pseudonym = user.pseudonym;
                                        logger.debug('---sql2---');
                                        var sql2 = 'SELECT * FROM '+USER_TABLE+' WHERE userid = "'+opuserid+'" LIMIT 1';
                                        connection.query(sql2, function(err, result) {
                                            // logger.debug(sql2);
                                            // logger.debug(err);
                                            // logger.debug(result);
                                            if(err){

                                            }else{
                                                if(result.length > 0){
                                                 opuser = result[0];
                                                 poem.opuser = opuser.userid
                                                 poem.ophead = opuser.head;
                                                 poem.oppseudonym = opuser.pseudonym;
                                                }
                                                connection.commit(function(err){
                                                    // logger.debug('---queryOpLovePoem事务完成---');
                                                    // logger.debug(err);
                                                    // logger.debug(poem);
                                                    callback(err,poem);
                                                });
                                                connection.release();
                                            }
                                        });
                                    }
                                }
                            });
                        }
    
                    }
                });
            });
        });
    },
    /**
     *查询最新讨论圈
     */
    queryNDiscuss(fromid,userid,callback){
        var sql = 'SELECT * FROM '+DISCUSS_TABLE+' WHERE id>? AND del = 0  ORDER BY id DESC LIMIT '+LIMIT_NUM;
        sql = 'SELECT form.*,user.head,user.pseudonym  FROM ('+sql+') AS form LEFT JOIN '+USER_TABLE+' ON form.userid = user.userid';
        var sql1 = 'SELECT * FROM '+LOVE_TABLE+' WHERE userid = ? AND type = '+DIS_TYPE
        sql = 'SELECT tpoem.*,IFNULL(love.love,0) as mylove FROM ('+sql+') AS tpoem LEFT JOIN ('+sql1+') AS love ON tpoem.id = love.iid ORDER BY id DESC';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,userid], function(err, result) {
                if(err){
                    callback(err, null)
                    connection.release();
                }else{
                    var data = {};
                    data.discuss = result;
                    sql = 'SELECT count(*) FROM '+DISCUSS_TABLE+' WHERE del = 0';
                    connection.query(sql, function(err, result) {
                        if(!err){
                            data.count = result[0]['count(*)'];
                        }
                        callback(err, data)
                        connection.release();
                    }); 
                }
            });
        });
    },
    /**
     *查询历史讨论圈
     */
    queryHDiscuss(fromid,userid,callback){
        var sql = 'SELECT * FROM '+DISCUSS_TABLE+' WHERE id < ?  AND del = 0 ORDER BY id DESC LIMIT '+LIMIT_NUM;
        sql = 'SELECT form.*,user.head,user.pseudonym FROM ('+sql+') AS form LEFT JOIN '+USER_TABLE+' ON form.userid = user.userid';
        var sql1 = 'SELECT * FROM '+LOVE_TABLE+' WHERE userid = ?  AND type = '+DIS_TYPE
        sql = 'SELECT tpoem.*,IFNULL(love.love,0) as mylove FROM ('+sql+') AS tpoem LEFT JOIN ('+sql1+') AS love ON tpoem.id = love.iid ORDER BY id DESC';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [fromid,userid], function(err, result) {
                if(err){
                    callback(err, null)
                    connection.release();
                }else{
                    var data = {};
                    data.discuss = result;
                    sql = 'SELECT count(*) FROM '+DISCUSS_TABLE+' WHERE del = 0';
                    connection.query(sql, function(err, result) {
                        if(!err){
                            data.count = result[0]['count(*)'];
                        }
                        callback(err, data)
                        connection.release();
                    }); 
                }
            });
        });
    },
}
