const { sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define("profile", {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Profile;
};
