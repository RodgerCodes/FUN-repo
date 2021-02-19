const { sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const track = sequelize.define("track", {
    art: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    art_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    featured_artist: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lyrics: {
      type: DataTypes.STRING(20000),
      allowNull: true,
    },
    audio_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    audio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  track.associate = (models) => {
    track.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return track;
};
