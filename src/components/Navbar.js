import React, { useState, useEffect } from "react";
import styled from "styled-components";
import logo from "../assets/FF-logo.png";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";

import { ethers } from "ethers";

// import BankABI from "../assets/BankABI.json";
// import USDCABI from "../assets/USDCABI.json";

const Navbar = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const { user } = useGlobalContext();

  const getWalletAddress = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts");
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((error) => {
          if (error.code === 4001) {
            console.log("Rejected");
          }
          return;
        });
      setCurrentAccount(currentAddress);
    }
  };

  return (
    <Wrapper>
      <div className="nav-center">
        <Link to="/" className="home-link">
          <img src={logo} alt="ForkedFinance app" className="logo" />
        </Link>
        {/* <Link to="/transfer" className="link">
          <div className="headerItem">Transfer</div>
        </Link> */}

        {/* Wallet: <span>{currentAccount}</span> */}

        {!user && (
          <div className="nav-links">
            <div className="nav-links-buttons">
              <Link to="/dashboard" className="link">
                <div className="headerItem">Dashbord</div>
              </Link>
              <Link to="/transfer" className="link">
                <div className="headerItem">Transfer</div>
              </Link>
            </div>
            <div>
              <button
                className="btn btn-small"
                onClick={() => {
                  getWalletAddress();
                }}
              >
                {" "}
                Connect{" "}
              </button>
            </div>
          </div>
        )}

        {user && (
          <div className="nav-links">
            <div className="nav-links-buttons">
              <Link to="/dashboard" className="link">
                <div className="headerItem">Dashbord</div>
              </Link>
              <Link to="/transfer" className="link">
                <div className="headerItem">Transfer</div>
              </Link>
            </div>
            <div className="connect">
              <button
                className="btn btn-small-connect"
                onClick={() => {
                  getWalletAddress();
                }}
              >
                {" "}
                Connected{" "}
              </button>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  .nav-center {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    border-bottom-style: solid;
    border-bottom-color: var(--primary-100);
  }
  .nav-center-nouser {
    display: flex;

    justify-content: space-around;
  }
  .noUserIcon {
    display: inline-block;
  }
  .logo {
    width: 100%;
    height: auto;
  }
  .nav-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
   
  }
  .nav-links-buttons {
    display: flex;
  }
  .nav-links p {
    margin: 0;
    text-transform: capitalize;
    margin-bottom: 0.25rem;
  }
  .home-link {
    display: flex;
    align-items: center;
    width: 300px;
    height: 96px;
  }
  span {
    background: var(--primary-500);
    padding: 0.1rem 0.2rem;
    color: var(--white);
    border-radius: var(--borderRadius);
    letter-spacing: var(--letterSpacing);
  .connect {
    display: inline;
  }
`;

export default Navbar;
