'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.Post, {foreignKey: "groupId"});
      Group.belongsTo(models.User, {foreignKey: "userId", as: "captain"});
      Group.hasMany(models.GroupUser, {foreignKey: 'groupId', as: "groupuser"})
      Group.belongsToMany(models.User, {through: "GroupUser", foreignKey: "groupId", as: "members"});
      //-----> USER
    }
  }
  Group.init({
    image: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    isDelete: DataTypes.BOOLEAN

  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};