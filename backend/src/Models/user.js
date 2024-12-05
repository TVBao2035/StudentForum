'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.History, {foreignKey: "userId"});
      User.hasMany(models.Post, {foreignKey: "userId"});
      User.hasMany(models.Like, { foreignKey: "userId" });
      User.hasMany(models.Comment, { foreignKey: "userId" });
      User.hasOne(models.Group, {foreignKey: "userId", as: "captain"});
      User.belongsToMany(models.Group, {through: "GroupUser", foreignKey: "userId", as: "members"});
      User.belongsToMany(models.User, { through: "Friend", as: "friends", foreignKey: 'userId' }); 
      User.hasMany(models.GroupUser, {foreignKey: "userId", as: "invitation"})
    }
  }
  User.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isDelete: DataTypes.BOOLEAN

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};