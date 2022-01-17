import React, { useEffect, useState } from "react";
import { useDrizzleContext } from "./drizzle/drizzleContext";
import Header from "./components/header";
import axios from "axios";
import "./App.css";
import PetCard from "./components/PetCard";
import Loader from "./components/Loader";

function App({ account }) {
  const drizzle = useDrizzleContext();

  const [data, setdata] = useState([]);
  const [showLoader, setshowLoader] = useState(true);
  const [OwnTokens, setOwnTokens] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      await getData();
    });
  }, [OwnTokens]);

  const getCurrentAccount = async () => {
    return await drizzle.web3.eth.getAccounts();
  };
  const getData = async () => {
    var dataArr = [];

    if (OwnTokens) {
      const address = await getCurrentAccount();
      let addressBalance = await drizzle.contracts.PetShop.methods
        .balanceOf(address[0])
        .call();
      for (let index = 0; index < addressBalance; index++) {
        const meta = await drizzle.contracts.PetShop.methods
          .tokenURI(index)
          .call();
        const result = await axios.get(meta);
        var nexxt = {
          name: result.data.name,
          price: result.data.price,
          image: result.data.image,
          tokenId: index,
        };
        dataArr.push(nexxt);
      }
      console.log({ address });
      setdata(dataArr);
      setshowLoader(false);
    } else {
      let contractBalance = await drizzle.contracts.PetShop.methods
        .balanceOf(await drizzle.contracts.PetShop.address)
        .call();
      for (let index = 0; index < contractBalance; index++) {
        const meta = await drizzle.contracts.PetShop.methods
          .tokenURI(index)
          .call();
        const result = await axios.get(meta);
        var nexxt = {
          name: result.data.name,
          price: result.data.price,
          image: result.data.image,
          tokenId: index,
        };
        dataArr.push(nexxt);
      }
      setdata(dataArr);
      setshowLoader(false);
    }
  };

  return (
    <div>
      <Header ownTokens={OwnTokens} setOwnTokens={setOwnTokens} />
      <div className="main">
        {showLoader ? (
          <Loader />
        ) : data.length ? (
          data.map((item, index) => {
            return <PetCard item={item} tokenId={index} key={index} />;
          })
        ) : null}
      </div>
    </div>
  );
}

export default App;
