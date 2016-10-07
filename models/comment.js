var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Comment(postId, comment) {
    this.postId = postId;
    this.comment = comment;
}

module.exports = Comment;

//存储一条留言信息
Comment.prototype.save = function(callback) {
    var postId = this.postId;
    var comment = this.comment;
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //通过id查找文档，并把一条留言对象添加到该文档的 comments 数组
            collection.update({ _id: new ObjectID(postId) }, { $push: { "comments": comment } }, function(err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};
