const { sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const track = sequelize.define("track", {
    art: {
      type: DataTypes.STRING,
      allowNull: true,
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
      type: DataTypes.STRING,
      allowNull: true,
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
