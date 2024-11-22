'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    // define association here
    GroupUser.belongsTo(models.User, {foreignKey: "userId", as: "invitation"});
    GroupUser.belongsTo(models.Group, { foreignKey: "groupId", as: "groupuser" });
    }
  }
  GroupUser.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    isAccept: DataTypes.BOOLEAN,
    isDelete: DataTypes.BOOLEAN

  }, {
    sequelize,
    modelName: 'GroupUser',
  });
  return GroupUser;
};