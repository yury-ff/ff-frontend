import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Input, Popover, Radio, Modal, message } from "antd";
import { WalletTwoTone } from "@ant-design/icons";

import axios from "axios";
import { ethers } from "ethers";
import BankABI from "../assets/BankABI.json";
// const bankAddress = "0xb58AB2cdC285B31bb9CD2440DEe6faaa5E98336b";
const bankAddress = "0x3149496ED8C90FC2418b3dD389ca606b87d23D45";

const url = "https://server.forkedfinance.xyz";

const Withdraw = () => {
  const [withdrawalAmount, setwithdrawalAmount] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  let [balance, setBalance] = useState(null);

  function changeAmount(e) {
    setwithdrawalAmount(e.target.value);
  }

  const updateBalance = async () => {
    try {
      const { data } = await axios.get(`${url}/api/v1/users/updateBalance`, {
        withCredentials: true,
      });
      setBalance(Math.round((data.balance / 1000000) * 100) / 100);
    } catch (error) {
      console.log(error);
    }
  };

  const setting = () => {
    return (
      <>
        <div>{balance} USDC</div>
      </>
    );
  };

  const getWalletAddress = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });

      setCurrentAccount(currentAddress);
    }
  };

  const withdraw = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(bankAddress, BankABI, signer);

    await contract
      .initiateWithdraw(withdrawalAmount * 10 ** 6)
      .then((tx) => {
        //do whatever you want with tx
      })
      .catch((e) => {
        if (e.code === 4001) {
          console.log("Rejected");
        }
      });
  };

  const chainChanged = () => {
    window.location.reload();
  };
  window.ethereum.on("chainChanged", chainChanged);
  window.ethereum.on("accountChanged", getWalletAddress);

  useEffect(() => {
    updateBalance();
  }, []);

  return (
    <Wrapper className="page">
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>USDC Out - 0.5% Fee...</h4>
          <Popover
            content={setting}
            title="Balance"
            trigger="click"
            placement="bottom"
          >
            <WalletTwoTone twoToneColor="#504acc" className="cog" />
          </Popover>
        </div>

        <div className="inputs">
          <Input
            placeholder="Amount"
            type="number"
            value={withdrawalAmount}
            onChange={changeAmount}
          />
        </div>

        {!currentAccount && (
          <div className="buttons">
            <div
              type="button"
              className="swapButton"
              onClick={getWalletAddress}
            >
              Connect Wallet
            </div>
          </div>
        )}
        {currentAccount && (
          <div className="buttons">
            <div type="button" className="swapButton" onClick={withdraw}>
              Withdraw
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: flex;
  flex-flow: column wrap;
  justify-content: start;
  text-align: center;
  padding-top: 3rem;

  .tradeBox {
    width: 400px;
    background-color: var(--black);
    border-style: solid;
    border-color: var(--primary-100);
    min-height: 300px;
    border-radius: 15px;
    display: flex;
    align-self: center;
    justify-content: flex-end;
    flex-direction: column;
    padding-left: 30px;
    padding-right: 30px;
  }

  .tradeBoxHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 98%;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .validation {
    color: red;
  }

  .inputs {
    display: flex;
    width: 100%;
  }
  input {
    hover: black;
    border-radius: 4px;
    color: var(--primary-100);
    background: var(--black);
    padding: 12px 20px;
    margin: 6px 0;
  }
  input:focus {
    border: 3px solid #555;
  }

  h1 {
    font-size: 9rem;
  }
`;

export default Withdraw;
