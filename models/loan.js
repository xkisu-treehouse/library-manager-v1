'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATEONLY,
    return_by: DataTypes.DATEONLY,
    returned_on: DataTypes.DATEONLY 
  }, {
    timestamps: false
  });
  Loan.associate = function(models) {
    // associations can be defined here
    Loan.belongsTo(models.Patron, {
      foreignKey: 'patron_id',
      as: 'patron'
    })
    
    Loan.belongsTo(models.Book, {
      foreignKey: 'book_id',
      as: 'book'
    })
  };
  return Loan;
};