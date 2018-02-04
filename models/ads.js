/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ads', {
    id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false
    },
    banner_url: {
      type: DataTypes.STRING(10000),
      allowNull: false
    },
    banner_href: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'ads'
  });
};
