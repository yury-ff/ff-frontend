// import { Link } from "react-router-dom";
import styled from "styled-components";
import { useGlobalContext } from "../context";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Input } from "antd";

import usdcABI from "../assets/USDCABI.json";
import fidFFABI from "../assets/FidFFABI.json";
import vesterABI from "../assets/VesterABI.json";
import usdcVesterABI from "../assets/UsdcVesterABI.json";

import rewardRouterABI from "../assets/RewardRouterABI.json";
import stableCoinTrackerABI from "../assets/StableCoinContractABI.json";
import stableCoinTrackerNoFeeABI from "../assets/StableCoinNoFeeABI.json";

import rewardTrackerABI from "../assets/RewardTrackerABI.json";

import distributorABI from "../assets/DistributorABI.json";
import bonusDistributorABI from "../assets/BonusDistributorABI.json";

import ffABI from "../assets/FfABI.json";
import bnABI from "../assets/BNABI.json";

import env from "react-dotenv";

const url = "https://server.forkedfinance.xyz";

const ff = "0x00295670C7f8C501f58FA66f1a161a66A05ddC78";
const fidFF = "0xDf133869576aBf53FfF6AFD663dcB77661F084bE";
const bnFF = "0x024042e5F784bdD509f6Bd3f128Ec9A657aBD381";
const USDCAddress = "0x55d030B2A681605b7a1E32d8D924EE124e9D01b7";
const rewardRouter = "0x89E9B4AC2eD32a404c63FCCC507e7DD74E03bd4B";

const feeUsdc = "0xD04f6170Db4B957502FC574049624f72DB64C4Ba";
const stakedUsdc = "0x5451D3013Be5cf6504780c929c95149D2BF1B358";
const usdcFeeDistributor = "0xf5fBe7654e9E380Be2f538C3cA2F1D6708E71B17";
const usdcFidFFDistributor = "0xC3F202041e09AEb55307FD24AB086E78301991d3";

const stakedFF = "0x66cd4d64a099dCF1D503C8d0BA01C805DB718afa";
const bonusFF = "0xf1e9791b260488fFcC95ae98BB7113abC7BFcEe8";
const feeFF = "0x81706c695834a6a087D2100B2e52eEeFB158bA7f";
const stakedFFDistributor = "0x4219a25C2e464771D9557Ce03bc3641d964F1723";
const bonusFFDistributor = "0x7688FeC08CD49Ecfb5BA41580C1CDeac6E3e4729";
const feeFFDistributor = "0x21A75a664747BC289180F12c2F80f1Aa3ce105ca";

const ffVester = "0xE26A190Db3c8686C3ed870b14a270e73105247fD";
const usdcVester = "0xf26AB7062E90D0D39fA8964782016714D05a9E18";

const usdcModalLabel = "USDC";
const FFModalLabel = "FF";
const FidFFModalLabel = "fidFF";
const stakeModalButton = "Earn Fee and FidFF";
const unstakeModalButton = "Stop Earning";
const vestModalButton = "Vest FF";
const unvestModalButton = "Stop vesting FF";

const depositModalButton = "Deposit";
const withdrawModalButton = "Withdraw";
const depositStablecoinModalHeading = "Deposit Stablecoin - 0.5% Fee";
const withdrawStablecoinModalHeading = "Withdraw Stablecoin - 0.5% Fee";
const stakeFFModalHeading = "Stake FF";
const unstakeFFModalHeading = "Unstake FF";
const stakeFidFFModalHeading = "Stake FidFF";
const unstakeFidFFModalHeading = "Unstake FidFF";
const vestFidFFModalHeading = "Reserve FF";
const unvestFidFFModalHeading = "Release FF";
const usdcVestFidFFModalHeading = "Reserve USDC";
const usdcUnvestFidFFModalHeading = "Release USDC";

const usdcDecimals = 10 ** 6;
const decimals = 10 ** 18;
const secondsPerYear = 31536000;

function Dashboard() {
  const { user } = useGlobalContext();
  const [currentAccount, setCurrentAccount] = useState(null);
  const [amount, setAmount] = useState(null);
  const [usdcAccountBalance, setUsdcAccountBalance] = useState(null);
  const [fidFFAccountBalance, setFidFFAccountBalance] = useState(null);

  const [stableCoinStakedAmount, setStableCoinStakedAmount] = useState(null);
  const [totalStableCoinStakedAmount, setTotalStableCoinStakedAmount] =
    useState(null);

  const [modal, setModal] = useState(false);
  const [modalHeading, setModalHeading] = useState(false);
  const [modalLabel, setModalLabel] = useState(false);
  const [modalButton, setModalButton] = useState(false);

  const [balance, setBalance] = useState(null);
  const [APR, setAPR] = useState(null);
  const [feeFFAPR, setFeeFFAPR] = useState(null);
  const [sUsdcFidFFAPR, setSUsdcFidFFAPR] = useState(null);
  const [stakedFFFidFFAPR, setStakedFFFidFFAPR] = useState(null);

  const [ffClaimableRewards, setFFClaimableRewards] = useState(null);
  const [usdcClaimableRewards, setUsdcClaimableRewards] = useState(null);
  const [totalFeeClaimableRewards, setTotalFeeClaimableRewards] =
    useState(null);

  const [totalFidFFClaimableRewards, setTotalFidFFClaimableRewards] =
    useState(null);
  const [bonusClaimableRewards, setBonusClaimableRewards] = useState(null);

  const [fidFFTotalDepositSuply, setFidFFTotalDepositSuply] = useState(null);

  const [ffPrice, setFFPrice] = useState(null);
  const [ffSupply, setFFSuply] = useState(null);
  const [fidFFSupply, setFidFFSupply] = useState(null);

  const [usdcReserved, setUsdcReserved] = useState(null);
  const [ffReserved, setFFReserved] = useState(null);
  const [vestedFF, setVestedFF] = useState(null);
  const [vestedStatus, setVestedStatus] = useState(null);

  const [ffBalance, setFFBalance] = useState(null);
  const [ffStakedAmounts, setFFStakedAmounts] = useState(null);
  const [bnStakedAmounts, setBnStakedAmounts] = useState(null);
  const [fidFFStakedAmounts, setFidFFStakedAmounts] = useState(null);
  const [boostPercentageAPR, setBoostPercentageAPR] = useState(0);

  const [ffTotalStakedAmounts, setFFTotalStakedAmounts] = useState(null);

  function changeAmount(e) {
    setAmount(e.target.value);
  }

  function handleModalButton(modalHeading) {
    if (modalHeading == depositStablecoinModalHeading) {
      depositUSDC();
    }
    if (modalHeading == withdrawStablecoinModalHeading) {
      withdrawUSDC();
    }
    if (modalHeading == stakeFFModalHeading) {
      stakeFF();
    }
    if (modalHeading == unstakeFFModalHeading) {
      unstakeFF();
    }
    if (modalHeading == stakeFidFFModalHeading) {
      stakeFidFF();
    }
    if (modalHeading == unstakeFidFFModalHeading) {
      unstakeFidFF();
    }
    if (modalHeading == usdcVestFidFFModalHeading) {
      usdcVest();
    }
    if (modalHeading == usdcUnvestFidFFModalHeading) {
      usdcUnvest();
    }
    if (modalHeading == vestFidFFModalHeading) {
      ffVest();
    }
    if (modalHeading == unvestFidFFModalHeading) {
      ffUnvest();
    }
  }

  const depositUSDC = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const contractRewardRouter = new ethers.Contract(
          rewardRouter,
          rewardRouterABI,
          signer
        );

        const usdcContract = new ethers.Contract(USDCAddress, usdcABI, signer);
        const allowance = await usdcContract.allowance(currentAddress, feeUsdc);
        const parsedAllowance = JSON.parse(allowance);
        if (amount > parsedAllowance) {
          const approveAmount =
            "115792089237316195423570985008687907853269984665640564039457584007913129639935";
          await usdcContract
            .approve(feeUsdc, approveAmount)
            .then((tx) => {})
            .catch((e) => {
              if (e.code === 4001) {
                console.log("Rejected");
              }
            });
        } else {
          if (!amount) {
            return;
          } else {
            const parsedAmount = ethers.utils.parseUnits(amount, 6);

            await contractRewardRouter
              .depositUsdc(parsedAmount)
              .then((tx) => {
                console.log(tx.hash);
                //do whatever you want with tx
              })
              .catch((e) => {
                if (e.code === 4001) {
                  console.log("Rejected");
                }
              });
          }
        }
      }
    }
  };
  const withdrawUSDC = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const contractRewardRouter = new ethers.Contract(
          rewardRouter,
          rewardRouterABI,
          signer
        );
        const parsedAmount = ethers.utils.parseUnits(amount, 6);

        await contractRewardRouter
          .withdrawUsdc(parsedAmount)
          .then((tx) => {
            //do whatever you want with tx
          })
          .catch((e) => {
            if (e.code === 4001) {
              console.log("Rejected");
            }
          });
      }
    }
  };
  const stakeFF = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const contractRewardRouter = new ethers.Contract(
          rewardRouter,
          rewardRouterABI,
          signer
        );
        const ffContract = new ethers.Contract(ff, ffABI, signer);
        const allowance = await ffContract.allowance(currentAddress, stakedFF);

        if (amount > allowance) {
          const approveAmount =
            "115792089237316195423570985008687907853269984665640564039457584007913129639935";
          await ffContract
            .approve(stakedFF, approveAmount)
            .then((tx) => {})
            .catch((e) => {
              if (e.code === 4001) {
                console.log("Rejected");
              }
            });
        } else {
          const parsedUnit = ethers.utils.parseUnits(amount, 18);

          await contractRewardRouter
            .stakeFF(parsedUnit)
            .then((tx) => {
              console.log(tx);
              //do whatever you want with tx
            })
            .catch((e) => {
              if (e.code === 4001) {
                console.log("Rejected");
              }
            });
        }
      }
    }
  };
  const unstakeFF = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const contractRewardRouter = new ethers.Contract(
          rewardRouter,
          rewardRouterABI,
          signer
        );

        const parsedUnit = ethers.utils.parseUnits(amount, 18);

        await contractRewardRouter
          .unstakeFF(parsedUnit)
          .then((tx) => {
            //do whatever you want with tx
          })
          .catch((e) => {
            if (e.code === 4001) {
              console.log("Rejected");
            }
          });
      }
    }
  };
  const stakeFidFF = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const contractRewardRouter = new ethers.Contract(
          rewardRouter,
          rewardRouterABI,
          signer
        );
        const fidFFContract = new ethers.Contract(fidFF, fidFFABI, signer);
        const allowance = await fidFFContract.allowance(
          currentAddress,
          stakedFF
        );
        const parsedAllowance = JSON.parse(allowance);

        if (amount > parsedAllowance) {
          const approveAmount =
            "115792089237316195423570985008687907853269984665640564039457584007913129639935";
          await fidFFContract
            .approve(stakedFF, approveAmount)
            .then((tx) => {})
            .catch((e) => {
              if (e.code === 4001) {
                console.log("Rejected");
              }
            });
        } else {
          const parsedUnit = ethers.utils.parseUnits(amount, 18);

          await contractRewardRouter
            .stakeFidFF(parsedUnit)
            .then((tx) => {
              //do whatever you want with tx
            })
            .catch((e) => {
              if (e.code === 4001) {
                console.log("Rejected");
              }
            });
        }
      }
    }
  };
  const unstakeFidFF = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const contractRewardRouter = new ethers.Contract(
          rewardRouter,
          rewardRouterABI,
          signer
        );

        const parsedUnit = ethers.utils.parseUnits(amount, 18);

        await contractRewardRouter
          .unstakeFidFF(parsedUnit)
          .then((tx) => {
            //do whatever you want with tx
          })
          .catch((e) => {
            if (e.code === 4001) {
              console.log("Rejected");
            }
          });
      }
    }
  };
  const compound = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const contractRewardRouter = new ethers.Contract(
          rewardRouter,
          rewardRouterABI,
          signer
        );

        await contractRewardRouter
          .handleRewards(true, true, true, true, true, true, true)
          .then((tx) => {
            //do whatever you want with tx
          })
          .catch((e) => {
            if (e.code === 4001) {
              console.log("Rejected");
            }
          });
      }
    }
  };
  const claimRewards = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const contractRewardRouter = new ethers.Contract(
          rewardRouter,
          rewardRouterABI,
          signer
        );

        await contractRewardRouter
          .handleRewards(true, false, true, false, false, true, false)
          .then((tx) => {
            //do whatever you want with tx
          })
          .catch((e) => {
            if (e.code === 4001) {
              console.log("Rejected");
            }
          });
      }
    }
  };

  const usdcVest = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const vesterContract = new ethers.Contract(
          usdcVester,
          usdcVesterABI,
          signer
        );

        const parsedAmount = ethers.utils.parseUnits(amount, 18);

        await vesterContract
          .deposit(parsedAmount)
          .then((tx) => {
            console.log(tx.hash);

            //do whatever you want with tx
          })
          .catch((e) => {
            if (e.code === 4001) {
              console.log("Rejected");
            }
          });
      }
    }
  };
  const usdcUnvest = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const vesterContract = new ethers.Contract(
          usdcVester,
          usdcVesterABI,
          signer
        );

        // const parsedAmount = ethers.utils.parseUnits(amount, 18);

        await vesterContract
          .withdraw()
          .then((tx) => {
            //do whatever you want with tx
          })
          .catch((e) => {
            if (e.code === 4001) {
              console.log("Rejected");
            }
          });
      }
    }
  };
  const ffVest = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const vesterContract = new ethers.Contract(ffVester, vesterABI, signer);

        const parsedAmount = ethers.utils.parseUnits(amount, 18);

        await vesterContract
          .deposit(parsedAmount)
          .then((tx) => {
            //do whatever you want with tx
          })
          .catch((e) => {
            if (e.code === 4001) {
              console.log("Rejected");
            }
          });
      }
    }
  };

  const ffUnvest = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      const signer = provider.getSigner();

      if (network.chainId == 5) {
        const vesterContract = new ethers.Contract(ffVester, vesterABI, signer);

        await vesterContract
          .withdraw()
          .then((tx) => {
            //do whatever you want with tx
          })
          .catch((e) => {
            if (e.code === 4001) {
              console.log("Rejected");
            }
          });
      }
    }
  };

  const getAccountContractsData = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      await provider.send("eth_requestAccounts");
      const currentAddress = await provider
        .getSigner()
        .getAddress()
        .catch((e) => {
          if (e.code === 4001) {
            console.log("Rejected");
          }
        });
      setCurrentAccount(currentAddress);

      const signer = provider.getSigner();

      async function signerContract(address, ABI) {
        return new ethers.Contract(address, ABI, signer);
      }

      function formatUsdc(chainOutput) {
        return (
          Math.round(
            parseFloat(ethers.utils.formatUnits(chainOutput, 6)) * 10
          ) / 10
        );
      }
      function formatErc(chainOutput) {
        return (
          Math.round(parseFloat(ethers.utils.formatEther(chainOutput)) * 10) /
          10
        );
      }

      if (network.chainId == 5) {
        // Trackers

        const usdcContract = new ethers.Contract(USDCAddress, usdcABI, signer);
        const fidFFContract = new ethers.Contract(fidFF, fidFFABI, signer);

        const usdcFeeTrackerContract = new ethers.Contract(
          feeUsdc,
          stableCoinTrackerABI,
          signer
        );
        const usdcFidFFTrackerContract = new ethers.Contract(
          stakedUsdc,
          stableCoinTrackerNoFeeABI,
          signer
        );

        const stakedFFContract = new ethers.Contract(
          stakedFF,
          rewardTrackerABI,
          signer
        );
        const feeFFTrackerContract = new ethers.Contract(
          feeFF,
          rewardTrackerABI,
          signer
        );
        const bonusTrackerContract = new ethers.Contract(
          bonusFF,
          rewardTrackerABI,
          signer
        );

        const currentUsdcBalance = await usdcContract.balanceOf(currentAddress);
        const parsedUsdcBalance = ethers.utils.formatUnits(
          JSON.parse(currentUsdcBalance, null, 2),
          6
        );
        setUsdcAccountBalance(Math.round(parsedUsdcBalance * 10) / 10);

        const currentFidFFBalance = await fidFFContract.balanceOf(
          currentAddress
        );
        setFidFFAccountBalance(
          Math.round(ethers.utils.formatEther(currentFidFFBalance) * 10) / 10
        );

        const currentUsdcStaked = await usdcFeeTrackerContract.stakedAmounts(
          currentAddress
        );

        // FidFF to claim

        const usdcClaimableFidFFReward =
          await usdcFidFFTrackerContract.claimable(currentAddress);

        const ffClaimableFidFFReward = await stakedFFContract.claimable(
          currentAddress
        );

        setTotalFidFFClaimableRewards(
          Math.round(
            (parseFloat(ethers.utils.formatEther(usdcClaimableFidFFReward)) +
              parseFloat(ethers.utils.formatEther(ffClaimableFidFFReward))) *
              10
          ) / 10
        );

        //.................................................................

        const claimableBonusReward = await bonusTrackerContract.claimable(
          currentAddress
        );
        setBonusClaimableRewards(formatErc(claimableBonusReward));

        const claimableUsdcFeeReward = await usdcFeeTrackerContract.claimable(
          currentAddress
        );

        setUsdcClaimableRewards(formatUsdc(claimableUsdcFeeReward));
        setStableCoinStakedAmount(formatUsdc(currentUsdcStaked));

        const ffStakedAmount = await stakedFFContract.depositBalances(
          currentAddress,
          ff
        );
        setFFStakedAmounts(
          Math.round(ethers.utils.formatEther(ffStakedAmount) * 10) / 10
        );

        const claimableFFFeeReward = await feeFFTrackerContract.claimable(
          currentAddress
        );
        setFFClaimableRewards(formatUsdc(claimableFFFeeReward));

        const fidFFStakedBalance = await stakedFFContract.depositBalances(
          currentAddress,
          fidFF
        );

        setFidFFStakedAmounts(
          Math.round(ethers.utils.formatEther(fidFFStakedBalance) * 10) / 10
        );

        const bnStakedBalance = await feeFFTrackerContract.depositBalances(
          currentAddress,
          bnFF
        );
        setBnStakedAmounts(
          Math.round(ethers.utils.formatEther(bnStakedBalance) * 10) / 10
        );

        const boostPercentage =
          (100 * parseInt(ethers.utils.formatEther(bnStakedBalance))) /
          parseInt(
            ethers.utils.formatEther(ffStakedAmount) +
              parseInt(ethers.utils.formatEther(fidFFStakedBalance))
          );

        if (!boostPercentage) {
          setBoostPercentageAPR("0");
        } else {
          setBoostPercentageAPR(Math.round(boostPercentage * 10) / 10);
        }

        // Tokens

        const ffContract = new ethers.Contract(ff, ffABI, signer);
        const ffAccountBalance = await ffContract.balanceOf(currentAddress);
        if (!ffAccountBalance) {
          setFFBalance("0");
        } else {
          setFFBalance(
            Math.round(ethers.utils.formatEther(ffAccountBalance) * 10) / 10
          );
        }

        // Distributors
        const stableFeeDistributor = new ethers.Contract(
          usdcFeeDistributor,
          distributorABI,
          signer
        );
        const stableRewards = await stableFeeDistributor.pendingRewards();

        const ffFeeDistributor = new ethers.Contract(
          feeFFDistributor,
          distributorABI,
          signer
        );

        const fidFFdistributor = new ethers.Contract(
          usdcFidFFDistributor,
          distributorABI,
          signer
        );
        const fidFFRewards = await fidFFdistributor.pendingRewards();

        const bonusDistributor = new ethers.Contract(
          bonusFFDistributor,
          bonusDistributorABI,
          signer
        );
        const pendingBonusReward = await bonusDistributor.pendingRewards();

        setTotalFeeClaimableRewards(
          Math.round(
            (formatUsdc(claimableUsdcFeeReward) +
              formatUsdc(claimableFFFeeReward)) *
              10
          ) / 10
        );

        // Vesters

        const usdcVesterContract = await signerContract(
          usdcVester,
          usdcVesterABI
        );
        const ffVesterContract = await signerContract(ffVester, vesterABI);

        const usdcVestedFF = await usdcVesterContract.claimable(currentAddress);
        const ffVestedFF = await ffVesterContract.claimable(currentAddress);

        const getUsdcVestedAmount = await usdcVesterContract.getVestedAmount(
          currentAddress
        );
        const getUsdcPairAmount = await usdcVesterContract.getPairAmount(
          currentAddress,
          getUsdcVestedAmount
        );

        const getFFVestedAmount = await ffVesterContract.getVestedAmount(
          currentAddress
        );

        const getFFPairAmount = await ffVesterContract.getPairAmount(
          currentAddress,
          getFFVestedAmount
        );

        setUsdcReserved(formatErc(getUsdcPairAmount));
        setFFReserved(formatErc(getFFPairAmount));
        setVestedFF(
          Math.round((formatErc(usdcVestedFF) + formatErc(ffVestedFF)) * 10) /
            10
        );

        if (formatErc(usdcVestedFF) + formatErc(ffVestedFF) === 0) {
          setVestedStatus("0");
        } else {
          setVestedStatus(
            Math.round(
              ((100 * (formatErc(usdcVestedFF) + formatErc(ffVestedFF))) /
                (formatErc(getUsdcVestedAmount) +
                  formatErc(getFFVestedAmount))) *
                10
            ) / 10
          );
        }
      }
    }
  };
  const getContractsData = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`
    );
    const network = await provider.getNetwork();

    async function providerContract(address, ABI) {
      return new ethers.Contract(address, ABI, provider);
    }

    function formatUsdc(chainOutput) {
      return (
        Math.round(parseFloat(ethers.utils.formatUnits(chainOutput, 6)) * 10) /
        10
      );
    }
    function formatErc(chainOutput) {
      return (
        Math.round(parseFloat(ethers.utils.formatEther(chainOutput)) * 10) / 10
      );
    }
    if (network.chainId == 5) {
      const stableCoinTrackerContract = await providerContract(
        feeUsdc,
        stableCoinTrackerABI
      );
      const stableCoinFidFFTrackerContract = await providerContract(
        stakedUsdc,
        stableCoinTrackerNoFeeABI
      );

      const stakedFFContract = await providerContract(
        stakedFF,
        rewardTrackerABI
      );

      const feeFFTracker = await providerContract(feeFF, stableCoinTrackerABI);

      const sUsdcSupply = await stableCoinFidFFTrackerContract.totalSupply();
      const sUsdcTPI = await stableCoinFidFFTrackerContract.tokensPerInterval();
      const sFFSupply = await stakedFFContract.totalSupply();
      const sFFTPI = await stakedFFContract.tokensPerInterval();

      setSUsdcFidFFAPR(
        Math.round(
          ((parseFloat(ethers.utils.formatEther(sUsdcTPI)) * secondsPerYear) /
            formatUsdc(sUsdcSupply)) *
            1000
        ) / 10
      );

      setStakedFFFidFFAPR(
        Math.round(
          ((parseFloat(ethers.utils.formatEther(sFFTPI)) * secondsPerYear) /
            formatErc(sFFSupply)) *
            1000
        ) / 10
      );

      const fidFFTotalStaked = await stakedFFContract.totalDepositSupply(fidFF);
      setFidFFTotalDepositSuply(
        Math.round(ethers.utils.formatEther(fidFFTotalStaked) * 10) / 10
      );

      const fidFFContract = await providerContract(fidFF, fidFFABI);

      const fidFFTotalSupply = await fidFFContract.totalSupply();
      setFidFFSupply(Math.round(ethers.utils.formatEther(fidFFTotalSupply)));

      const ffTotalStaked = await stakedFFContract.totalDepositSupply(ff);
      setFFTotalStakedAmounts(formatErc(ffTotalStaked));

      const totalStableCoinStaked =
        await stableCoinTrackerContract.totalDepositSupply(USDCAddress);

      setTotalStableCoinStakedAmount(formatUsdc(totalStableCoinStaked));

      const feeTokensPerInterval =
        await stableCoinTrackerContract.tokensPerInterval();
      const tokensPerYear = feeTokensPerInterval * secondsPerYear;

      setAPR(
        Math.round(
          (formatUsdc(tokensPerYear) / formatUsdc(totalStableCoinStaked)) * 1000
        ) / 10
      );

      const feeFFTotalSupply = await feeFFTracker.totalSupply();

      const ffFeeTokensPerInterval = await feeFFTracker.tokensPerInterval();
      const ffFeeAPR =
        Math.round(
          (formatUsdc(ffFeeTokensPerInterval * secondsPerYear) /
            formatErc(feeFFTotalSupply)) *
            1000
        ) / 10;
      setFeeFFAPR(ffFeeAPR);

      const ffContract = new ethers.Contract(ff, ffABI, provider);

      const ffTotalSupply = await ffContract.totalSupply();
      setFFSuply(Math.round(ethers.utils.formatEther(ffTotalSupply)));
    }
  };

  const updateBalance = async () => {
    try {
      setBalance(Math.round((user / 1000000) * 100) / 100);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = (heading, label, button) => {
    setModalHeading(heading);
    setModalLabel(label);
    setModalButton(button);
    setModal(!modal);
  };

  const closeModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  // getAccountContractsData();
  // getContractsData();
  const chainChanged = () => {
    window.location.reload();
  };
  window.ethereum.on("chainChanged", chainChanged);
  window.ethereum.on("accountChanged", getAccountContractsData);

  useEffect(() => {
    updateBalance();
    getAccountContractsData();
    getContractsData();
  }, []);

  return (
    <Wrapper className="page">
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>{alert.text}</div>
      )}
      {modal && (
        <>
          <div onClick={closeModal} className="overlay"></div>
          <div className="modal">
            <div className="modal-content">
              <div className="modal-heading">{modalHeading}</div>
              <div className="modal-divider">
                <hr class="solid"></hr>
              </div>
              <button className="close-modal" onClick={closeModal}>
                ✕
              </button>
              <div className="modal-input">
                <Input
                  type="number"
                  placeholder="0.0"
                  bordered={false}
                  onChange={changeAmount}
                />
                <div className="label">{modalLabel}</div>
              </div>
              <div className="modal-divider">
                <hr class="solid"></hr>
              </div>
              <div className="modal-buttons">
                <div
                  type="button"
                  className="modalButton"
                  onClick={() => {
                    handleModalButton(modalHeading);
                  }}
                >
                  {modalButton}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="header">
        <Link to="/transfer" className="inTextLink">
          Pay Someone without Gas or Transaction Fees
        </Link>
        <br></br>
        Avaliable Balance: <span>{balance}</span>
        <br></br>
        Connected Wallet: <span>{currentAccount}</span>
      </div>

      <div className="stakeContent">
        <div className="stakeCards">
          <div className="stakeCard">
            <div className="stakeCardHeader">
              <div>USDC {sUsdcFidFFAPR}</div>
            </div>
            <div className="divider">
              <hr class="solid"></hr>
            </div>
            <div className="cardRow">
              <div>
                <div>Wallet</div>
              </div>
              <div>
                <div>{usdcAccountBalance} </div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Staked</div>
              </div>
              <div>
                <div>{stableCoinStakedAmount} </div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>APR</div>
              </div>
              <div>
                <div>{APR}%</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Rewards</div>
              </div>
              <div>
                <div>${usdcClaimableRewards}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Reserved for Vesting</div>
              </div>
              <div>
                <div>{usdcReserved}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Total Staked</div>
              </div>
              <div>
                <div>${totalStableCoinStakedAmount}</div>
              </div>
            </div>

            <div className="stakeCardFooter">
              <div className="divider">
                <hr class="solid"></hr>
              </div>
              <div className="cardRow">
                <div className="cardRowButtons">
                  <div
                    type="button"
                    className="cardButton"
                    onClick={() => {
                      toggleModal(
                        depositStablecoinModalHeading,
                        usdcModalLabel,
                        depositModalButton
                      );
                    }}
                  >
                    Stake
                  </div>
                  <div
                    type="button"
                    className="cardButton"
                    onClick={() => {
                      toggleModal(
                        withdrawStablecoinModalHeading,
                        usdcModalLabel,
                        withdrawModalButton
                      );
                    }}
                  >
                    Unstake
                  </div>
                  <div
                    type="button"
                    className="cardButton"
                    onClick={() => {
                      toggleModal(
                        usdcVestFidFFModalHeading,
                        FidFFModalLabel,
                        vestModalButton
                      );
                    }}
                  >
                    Vest
                  </div>
                  <div
                    type="button"
                    className="cardButton"
                    onClick={() => {
                      toggleModal(
                        usdcUnvestFidFFModalHeading,
                        FidFFModalLabel,
                        unvestModalButton
                      );
                    }}
                  >
                    <strike>Vest</strike>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="stakeCard">
            <div className="stakeCardHeader">
              <div>Total Rewards</div>
            </div>
            <div className="divider">
              <hr class="solid"></hr>
            </div>
            <div className="cardRow">
              <div>
                <div>USDC</div>
              </div>
              <div>
                <div>${totalFeeClaimableRewards}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>FF</div>
              </div>
              <div>
                <div>{vestedFF}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Fiduciary FF</div>
              </div>
              <div>
                <div>{totalFidFFClaimableRewards}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Multiplier Points APR</div>
              </div>
              <div>
                <div>100%</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Multiplier Points</div>
              </div>
              <div>
                <div>{bonusClaimableRewards}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Staked Multiplier Points</div>
              </div>
              <div>
                <div>{bnStakedAmounts}</div>
              </div>
            </div>
            {/* <div className="cardRow">
              <div>
                <div>Total</div>
              </div>
              <div>
                <div>100</div>
              </div>
            </div> */}
            <div className="stakeCardFooter">
              <div className="divider">
                <hr class="solid"></hr>
              </div>
              <div className="cardRow">
                <div className="cardRowButtons">
                  <div type="button" className="cardButton" onClick={compound}>
                    Compound
                  </div>
                  <div
                    type="button"
                    className="cardButton"
                    onClick={claimRewards}
                  >
                    Claim
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="stakeCardFF">
            <div className="stakeCardHeader">
              <div>FF</div>
            </div>
            <div className="divider">
              <hr class="solid"></hr>
            </div>
            <div className="cardRow">
              <div>
                <div>Price</div>
              </div>
              <div>
                <div> Soon!</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Wallet</div>
              </div>
              <div>
                <div>{ffBalance}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Staked</div>
              </div>
              <div>
                <div>{ffStakedAmounts}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>APR</div>
              </div>
              <div>
                <div>{feeFFAPR}%</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Rewards</div>
              </div>
              <div>
                <div>${ffClaimableRewards}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Boost Percentage</div>
              </div>
              <div>
                <div>{boostPercentageAPR}%</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Reserved for Vesting</div>
              </div>
              <div>
                <div>{ffReserved}</div>
              </div>
            </div>
            <br></br>
            <div className="cardRow">
              <div>
                <div>Total Staked</div>
              </div>
              <div>
                <div>{ffTotalStakedAmounts}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Total Supply</div>
              </div>
              <div>
                <div>{ffSupply}</div>
              </div>
            </div>
            <div className="stakeCardFooter">
              <div className="divider">
                <hr class="solid"></hr>
              </div>
              <div className="cardRow">
                <div className="cardRowButtons">
                  <a className="cardButton">Buy</a>
                  <div
                    type="button"
                    className="cardButton"
                    onClick={() => {
                      toggleModal(
                        stakeFFModalHeading,
                        FFModalLabel,
                        stakeModalButton
                      );
                    }}
                  >
                    Stake
                  </div>
                  <div
                    type="button"
                    className="cardButton"
                    onClick={() => {
                      toggleModal(
                        unstakeFFModalHeading,
                        FFModalLabel,
                        unstakeModalButton
                      );
                    }}
                  >
                    Unstake
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="stakeCardFF">
            <div className="stakeCardHeader">
              <div>Fiduciary FF</div>
            </div>
            <div className="divider">
              <hr class="solid"></hr>
            </div>
            <div className="cardRow">
              <div>
                <div>Price</div>
              </div>
              <div>
                <div>Soon... I promise</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Wallet</div>
              </div>
              <div>
                <div>{fidFFAccountBalance}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Staked</div>
              </div>
              <div>
                <div>{fidFFStakedAmounts}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>APR</div>
              </div>
              <div>
                <div>{feeFFAPR}%</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Rewards</div>
              </div>
              <div>
                <div>${ffClaimableRewards}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Vesting Status</div>
              </div>
              <div>
                <div>{vestedStatus}%</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>FF Claimable</div>
              </div>
              <div>
                <div>{vestedFF}</div>
              </div>
            </div>
            <br></br>

            <div className="cardRow">
              <div>
                <div>Total Staked</div>
              </div>
              <div>
                <div>{fidFFTotalDepositSuply}</div>
              </div>
            </div>
            <div className="cardRow">
              <div>
                <div>Total Supply</div>
              </div>
              <div>
                <div>{fidFFSupply}</div>
              </div>
            </div>
            <div className="stakeCardFooter">
              <div className="divider">
                <hr class="solid"></hr>
              </div>
              <div className="cardRow">
                <div className="cardRowButtons">
                  <div
                    type="button"
                    className="cardButton"
                    onClick={() => {
                      toggleModal(
                        stakeFidFFModalHeading,
                        FidFFModalLabel,
                        stakeModalButton
                      );
                    }}
                  >
                    Stake
                  </div>
                  <div
                    type="button"
                    className="cardButton"
                    onClick={() => {
                      toggleModal(
                        unstakeFidFFModalHeading,
                        FidFFModalLabel,
                        unstakeModalButton
                      );
                    }}
                  >
                    Unstake
                  </div>
                  <div
                    type="button"
                    className="cardButton"
                    onClick={() => {
                      toggleModal(
                        vestFidFFModalHeading,
                        FidFFModalLabel,
                        vestModalButton
                      );
                    }}
                  >
                    Vest
                  </div>
                  <div
                    type="button"
                    className="cardButton"
                    onClick={() => {
                      toggleModal(
                        unvestFidFFModalHeading,
                        FidFFModalLabel,
                        unvestModalButton
                      );
                    }}
                  >
                    <strike>Vest</strike>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  input-span {
    background: var(--primary-0);
    padding: 0.15rem 0.25rem;
    color: green;
    border-radius: var(--borderRadius);
    letter-spacing: var(--letterSpacing);
  }
  button {
    margin: 0.15rem;
  }
  body.active-modal {
    overflow-y: hidden;
  }

  .btn-modal {
    padding: 10px 20px;
    display: block;
    margin: 100px auto 0;
    font-size: 18px;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--black);
    padding: 50px;
    z-index: 1000;
  }
  .modal-heading {
    font-size: 17px;
  }
  .overlay {
    position: fixed;
    top: -100px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    min-height: 1052.5px;
    z-index: 1000;
  }

  .overlay {
    background: rgba(0, 0, 0, 0.8);
  }
  .modal-content {
    position: absolute;
    top: 40%;
    left: 50%;
    border-style: solid;
    border-color: var(--primary-100);
    transform: translate(-50%, -50%);
    line-height: 1.4;
    background: var(--black);
    padding: 14px 28px;
    border-radius: 3px;
    max-width: 600px;
    min-width: 350px;
  }

  .close-modal {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 1px 3px;
    margin-right: 16px;
  }
  .modal-input {
    display: flex;
    justify-content: space-between;
    padding: 12px 8px;
  }
  input {
    color: var(--primary-100);
    background: var(--black);
    font-size: 20px;
  }
  input::placeholder {
    font-weight: bold;
    opacity: 0.5;
    color: white;
  }
  .label {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;

    margin-left: 2px;
  }

  @media (max-width: 830px) {
    .overlay {
      top: -122.5px;
      min-height: 1862.5px;
    }
    .modal {
      top: 40vh;
    }
    .modal-content {
      position: absolute;
    }
  }
`;

export default Dashboard;
