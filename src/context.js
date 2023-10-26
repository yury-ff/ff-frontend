import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
const AppContext = React.createContext();
// const url = "http://localhost:3000/api/v1/balances";
const url = "https://ff-backend-y8on.onrender.com/api/v1/balances";

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const saveUser = (user) => {
    setUser(user);
  };

  const removeUser = () => {
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const currentAddress = await provider
          .getSigner()
          .getAddress()
          .catch((error) => {
            if (error.code === 4001) {
              console.log("Rejected");
            }
            return;
          });

        const resp = await axios({
          url: `${url}/${currentAddress}`,
          method: "get",
        });
        if (resp.data == 0) {
          saveUser("0");
        } else {
          saveUser(resp.data);
        }
      }
    } catch (error) {
      removeUser();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        saveUser,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
