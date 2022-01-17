import React, { useEffect, useState } from "react";
import "../style/PetCard.css";
import { useDrizzleContext } from "../drizzle/drizzleContext";

function PetCard({ item, tokenId }) {
  const drizzle = useDrizzleContext();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      await getTokenOwner();
    });
  }, []);

  const getCurrentAccount = async () => {
    return await drizzle.web3.eth.getAccounts();
  };
  const getTokenOwner = async () => {
    const tokenOwner = await drizzle.contracts.PetShop.methods
      .ownerOf(tokenId)
      .call();
    const account = await getCurrentAccount();
    if (tokenOwner === account[0]) {
      setIsOwner(true);
    }
  };
  const buyNFT = async () => {
    const account = await getCurrentAccount();

    await drizzle.contracts.PetShop.methods
      .Buy(tokenId)
      .send({
        from: account[0],
        value: drizzle.web3.utils.toWei(item.price, "ether"),
      })
      .then((receipt) => {
        console.log(receipt);
        setIsOwner(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="main__container">
      <div className="nftImageBox">
        <img src={item.image} alt="notfound" className="nftImage" />
      </div>
      <div className="nftInfo">
        <div className="nftInfoBox">
          <p className="name">{item.name}</p>
          <p className="price">{item.price} ETH</p>
        </div>
        {isOwner ? null : (
          <div className="info__record">
            <button onClick={buyNFT}>Buy</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PetCard;
