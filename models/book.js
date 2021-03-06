'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  Book.associate = function(models) {
    // associations can be defined here
    Book.hasMany(models.Loan, {
      foreignKey: 'book_id',
      as: 'loan'
    })
  };
  return Book;
};