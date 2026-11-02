"use strict";

/*
  UserAddress gets a composite primary key, so a user can't be linked to the
  same address twice, and its rows are deleted together with their user or
  address instead of blocking the delete.
*/
const TABLE = "UserAddress";
const PRIMARY_KEY = "UserAddress_pkey";
const FOREIGN_KEYS = [
  { field: "userId", table: "Users" },
  { field: "addressId", table: "Addresses" },
];

// Constraint names differ per dialect, so they are looked up instead of hardcoded
const replaceForeignKeys = async (queryInterface, onDelete, transaction) => {
  const references = await queryInterface.getForeignKeyReferencesForTable(TABLE, {
    transaction,
  });
  for (const { constraintName } of references) {
    await queryInterface.removeConstraint(TABLE, constraintName, { transaction });
  }

  for (const { field, table } of FOREIGN_KEYS) {
    await queryInterface.addConstraint(TABLE, {
      fields: [field],
      type: "foreign key",
      references: { table, field: "id" },
      onDelete,
      transaction,
    });
  }
};

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addConstraint(TABLE, {
        fields: ["userId", "addressId"],
        type: "primary key",
        name: PRIMARY_KEY,
        transaction,
      });
      await replaceForeignKeys(queryInterface, "CASCADE", transaction);
    }),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await replaceForeignKeys(queryInterface, "NO ACTION", transaction);
      await queryInterface.removeConstraint(TABLE, PRIMARY_KEY, { transaction });
    }),
};
