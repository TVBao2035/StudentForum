'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.User, {foreignKey: "userId"});
      Like.belongsTo(models.Post, {foreignKey: "postId"});
      Like.belongsTo(models.Comment, { foreignKey: "commentId"})
    }
  }
  Like.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    isDelete: DataTypes.BOOLEAN

  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};