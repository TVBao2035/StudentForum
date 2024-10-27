'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Friend.belongsTo(models.User, {foreignKey: 'friendId', as: 'yourFriend'});
      Friend.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Friend.init({
    userId: DataTypes.INTEGER,
    friendId: DataTypes.INTEGER,
    isDelete: DataTypes.BOOLEAN,
    isAccept: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};