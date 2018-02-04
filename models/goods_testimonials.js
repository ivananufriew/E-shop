/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goods_testimonials', {
    comment_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false
    },
    good_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false
    },
    comment_text: {
      type: DataTypes.STRING(3000),
      allowNull: false
    }
  }, {
    tableName: 'goods_testimonials'
  });
};
