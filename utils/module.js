/**
 * 模块定义类
 */

var LoveExtend = function(title,userid,head,pseudonym,pid){
	this.title = title||'';
	this.userid = userid||'';
	this.head = head||'';
	this.pseudonym = pseudonym||'';
	this.pid = pid||'';
}
var CommentExtend = function(title,userid,head,pseudonym,pid,cid,comment){
	this.title = title||'';
	this.userid = userid||'';
	this.head = head||'';
	this.pseudonym = pseudonym||'';
	this.pid = pid||'';
	this.cid = cid||'';
	this.comment = comment||'';
}
var FollowExtend = function(userid,head,pseudonym){
	this.userid = userid||'';
	this.head = head||'';
	this.pseudonym = pseudonym||'';
}
/**
 * 删除作品
 */
var DelPoemExtend = function(pid){
	this.pid = pid||'';
}

var AddPoemExtend = function(pid,userid,head,pseudonym,title){
	this.pid = pid||0;
	this.userid = userid||'';
	this.head = head||'';
	this.pseudonym = pseudonym||'';
	this.title = title||'';
}

var Message = function(type,userid,title,content,extend){
	this.type = type||0;
	this.userid = userid||'';
	this.title = title||'';
	this.content = content||'';
	this.extend = extend||{};
}

// 添加讨论
var AddDiscussExtend = function(id,userid,head,nickname,title){
	this.id = id||0;
	this.userid = userid||'';
	this.head = head||'';
	this.nickname = nickname||'';
	this.title = title||'';
}

/**
 * 删除讨论
 */
var DelDiscussExtend = function(id){
	this.id = id||'';
}


var DLoveExtend = function(title,userid,head,nickname,id){
	this.title = title||'';
	this.userid = userid||'';
	this.head = head||'';
	this.nickname = nickname||'';
	this.id = id||'';
}
var DCommentExtend = function(title,userid,head,nickname,id,cid,comment){
	this.title = title||'';
	this.userid = userid||'';
	this.head = head||'';
	this.nickname = nickname||'';
	this.id = id||'';
	this.cid = cid||'';
	this.comment = comment||'';
}


var MessageType = function(){

}
MessageType.SYS_MSG = 0;//系统消息
MessageType.LOVE_MSG = 1;//点赞
MessageType.COMMENT_MSG = 2;//评论
MessageType.FOLLOW_MSG = 3;//关注
MessageType.DELPOEM_MSG = 4;//作品违规被删除
MessageType.ADD_POEM_MSG = 5;//发布作品
MessageType.DADD = 6;//添加讨论
MessageType.DLOVE = 7;//点赞讨论
MessageType.DCOMMENT = 8;//评论讨论
var PushType = function(){

}
PushType.NEWS = 'news';
PushType.CHAT = 'chat';

module.exports = {
	LoveExtend,
	CommentExtend,
	FollowExtend,
	DelPoemExtend,
	AddPoemExtend,
	AddDiscussExtend,
	DelDiscussExtend,
	DLoveExtend,
	DCommentExtend,
	Message,
	MessageType,
	PushType,
};