/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('brands', {
    brand_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    brand_title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    brand_descr: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    brand_img: {
      type: DataTypes.STRING(150),
      allowNull: false
    }
  }, {
    tableName: 'brands'
  });
};
