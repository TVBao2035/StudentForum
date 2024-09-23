'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.hasMany(models.Like, {foreignKey: "postId"});
      Post.hasMany(models.Comment, { foreignKey: "postId" });
      Post.belongsTo(models.User, {foreignKey: "userId"});
      Post.belongsTo(models.Categorys, {foreignKey: "categoryId"});
      Post.belongsTo(models.Group, { foreignKey: "groupId"});
    }
  }
  Post.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    image: DataTypes.STRING,
    isDelete: DataTypes.BOOLEAN

  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};