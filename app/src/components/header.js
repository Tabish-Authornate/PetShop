import React from "react";
import { useState } from "react";
import "../style/header.css";
import logo from "../images/logo.png";
import Modal from "../components/modal";

function Header({ ownTokens, setOwnTokens }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="header">
      <div className="header__logo">
        <img
          src={logo}
          alt="notfound"
          style={{ width: "30px", height: "30px" }}
        />
      </div>
      {showModal ? (
        <Modal show={showModal} handleClose={setShowModal}></Modal>
      ) : (
        <div className="header__button">
          <button
            className="OwnTokens__button"
            onClick={(e) => setOwnTokens(!ownTokens)}
          >
            {ownTokens ? "Show All Token" : "View Own Tokens"}
          </button>
          <button
            className="create__button"
            onClick={(e) => setShowModal(true)}
          >
            Create
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
