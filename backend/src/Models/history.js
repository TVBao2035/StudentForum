'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Historys.belongsTo(models.User, {foreignKey: "userId"});
    }
  }
  Historys.init({
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    title: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN,

  }, {
    sequelize,
    modelName: 'History',
  });
  return Historys;
};