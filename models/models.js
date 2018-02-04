/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('models', {
    id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    rate: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
      defaultValue: '5'
    },
    price: {
      type: DataTypes.INTEGER(255),
      allowNull: false
    },
    available: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    phone_status: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(10000),
      allowNull: false
    },
    brand_id: {
      type: DataTypes.INTEGER(35),
      allowNull: false
    }
  }, {
    tableName: 'models',
    underscored: true
  });//.belongsTo('params_list');

  // phone_models.associate =

};
