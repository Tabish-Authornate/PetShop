const MyPetShop = artifacts.require("PetShop");

module.exports = function (deployer) {
  deployer.deploy(MyPetShop);
};
