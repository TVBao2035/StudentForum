'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Post, {foreignKey: "commentId"});
      Comment.belongsTo(models.User, {foreignKey: "userId"});
      Comment.hasMany(models.Like, { foreignKey: "commentId" });
      Comment.hasMany(models.Comment, { as: 'children', foreignKey: "commentId" });
    }
  }
  Comment.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    isDelete: DataTypes.BOOLEAN

  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};