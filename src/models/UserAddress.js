import Sequelize, { Model } from "sequelize";

class UserAddress extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: Sequelize.INTEGER,
        addressId: Sequelize.INTEGER,
      },
      {
        sequelize,
        timestamps: true,
        tableName: "UserAddress"
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId" });
    this.belongsTo(models.Address, { foreignKey: "addressId" });
  }
}

export default UserAddress;
