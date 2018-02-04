/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('params_list', {
    param_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    model_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Power_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Battery_capacity: {
      type: DataTypes.INTEGER(100),
      allowNull: false
    },
    Battery_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Width: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Height: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Depth: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Weight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Main_camera: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    Main_camera_MP: {
      type: DataTypes.INTEGER(50),
      allowNull: false
    },
    Front_camera: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    Front_camera_MP: {
      type: DataTypes.INTEGER(50),
      allowNull: false
    },
    WiFi: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    FM: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    ROM: {
      type: DataTypes.INTEGER(150),
      allowNull: false
    },
    RAM: {
      type: DataTypes.INTEGER(150),
      allowNull: false
    },
    Processor: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    Processor_cores_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Processor_speed: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Display_diagonal: {
      type: DataTypes.DECIMAL(65,1),
      allowNull: false
    },
    Display_resolution: {
      type: "SET('800X480','1024X600','1280X800','1024X768','800X600','2048X1536','1920X1200','2560X1600','320X240','480X320','960X640','854X480','1136X640','960X540','1280X720','1280X768','480X854','480×360','360×640','480X800','2048×1536','3840X2160','1920X1080','2960X1440','-')",
      allowNull: false,
      defaultValue: '-'
    },
    Display_type: {
      type: "SET('TFT','IPS','-')",
      allowNull: false,
      defaultValue: '-'
    },
    OS: {
      type: "SET('WINDOWS','ANDROID','IOS','BLACKBERRY','-')",
      allowNull: false,
      defaultValue: '-'
    }
  }, {
    tableName: 'params_list',
    underscored: true
  });
};
