var Table = function(){

}
Table.INFORMATION = 'information'; 
Table.DISCUSS = 'discuss'; 
/**
 * 1 收录 2 诗歌作品 3 评论 
 */
var Type = function(){

}
Type.DISCUSS = 3;//讨论

function getTable(type){
	var table = '';
	if(type == Type.DISCUSS){
	    table = Table.DISCUSS;
	}
	return table;
}
module.exports = {
	Table,
	Type,
	getTable,
};
