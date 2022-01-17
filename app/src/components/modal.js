import React, { useState, useEffect } from "react";
import { useDrizzleContext } from "../drizzle/drizzleContext";
import { create } from "ipfs-http-client";
import "../style/modal.css";
import Loader from "./Loader";

import close from "../images/cancel.png";
const pinataSDK = require("@pinata/sdk");
const client = create("https://ipfs.infura.io:5001/api/v0");

const pinata = pinataSDK(
  "8eead93deca392528e2e",
  "d3a88784ea2646061e4b891374b07300c74aad9d4c1f66d3246bd1658bbe1023"
);

function Modal({ show, handleClose, account }) {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [metaData, setMetaData] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setloading] = useState(false);
  const drizzle = useDrizzleContext();
  async function metadataUpload() {
    setloading(true);
    try {
      const added = await client.add(image);
      const img = `https://ipfs.infura.io/ipfs/${added.path}`;

      const body = {
        name: name,
        price: price,
        image: img,
      };
      const options = {
        pinataMetadata: {
          name: "PetShop",
          keyvalues: {
            customKey: "PetShop Metadata",
            customKey2: Math.random(),
          },
        },
        pinataOptions: {
          cidVersion: 0,
        },
      };
      await pinata
        .pinJSONToIPFS(body, options)
        .then((result) => {
          var metadataURI =
            "https://gateway.pinata.cloud/ipfs/" + result.IpfsHash;
          setMetaData(metadataURI);
          console.log("Meta data URI ", metadataURI);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const showHideClassName = show ? "modal display-block" : "modal display-none";

  const OnSubmit = async (e) => {
    e.preventDefault();

    await metadataUpload();

    await safeMint();
    setloading(false);
    handleClose(false);
  };

  const getMetadata = async () => {
    let state;

    await setMetaData((metaData) => {
      state = metaData;

      return metaData;
    });

    return state;
  };

  async function safeMint() {
    await drizzle.contracts.PetShop.methods
      .safeMint(drizzle.contracts.PetShop.address, await getMetadata())
      .send({ from: account })
      .then((receipt) => {
        console.log(receipt);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return loading ? (
    <Loader />
  ) : (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h3>Add New Pet</h3>
        <div className="close__div">
          <img
            className="close__image"
            src={close}
            alt="not found"
            onClick={(e) => handleClose(false)}
          />
        </div>
        <div className="dish__data">
          <form onSubmit={OnSubmit} encType="multipart/form-data">
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Price"
              name="price"
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="file"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button type="submit" className="submit">
              Submit
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Modal;
