const { sequelize ,DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user',{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },

        email:{
            type:DataTypes.STRING,
        allowNull:false
        },

        password:{
            type:DataTypes.STRING,
            allowNull:false
        },

        activation_token:{
            type:DataTypes.STRING,
            allowNull:true
        },

        active:{
            type:DataTypes.BOOLEAN ,
            allowNull:false
        },

        reset_pass_token:{
            type:DataTypes.STRING,
            allowNull:true
        },

        reset_token_timer:{
            type:DataTypes.STRING,
            allowNull:true
        }
    })

    return User;
}