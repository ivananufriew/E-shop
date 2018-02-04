/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model_previews', {
    preview_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    model_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false
    },
    preview_url: {
      type: DataTypes.STRING(10000),
      allowNull: false
    }
  }, {
    tableName: 'model_previews'
  });
};
