'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here'
      Doctor_Info.belongsTo(models.User, { foreignKey: 'doctorId' })

      Doctor_Info.belongsTo(models.AllCode, { foreignKey: 'priceId', targetKey: 'keymap', as: 'priceTypeData' })
      Doctor_Info.belongsTo(models.AllCode, { foreignKey: 'provinceId', targetKey: 'keymap', as: 'provinceTypeData' })
      Doctor_Info.belongsTo(models.AllCode, { foreignKey: 'paymentId', targetKey: 'keymap', as: 'paymentTypeData' })
    }
  };
  Doctor_Info.init({
    doctorId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    priceId: DataTypes.STRING,
    provinceId: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    addressClinic: DataTypes.STRING,
    nameClinic: DataTypes.STRING,
    note: DataTypes.STRING,
    count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Doctor_Info',
    freezeTableName: true
  });
  return Doctor_Info;
};