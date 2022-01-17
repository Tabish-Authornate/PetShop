import PetShop from "../contracts/PetShop.json";
const options = {
  contracts: [PetShop],
  events: {
    PetShop: ["Transfer"],
  },
  syncAlways : true ,
};
export default options;
