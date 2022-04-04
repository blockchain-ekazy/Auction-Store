import React, { useState, useEffect } from "react";
import abi from "./abi.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

const REACT_APP_CONTRACT_ADDRESS = "0x95085aF0eaE3F64786B695c172AFED8819bDC22c";
const SELECTEDNETWORK = "1";
const SELECTEDNETWORKNAME = "Ethereum Mainnet";
const nftquantity = 14165;

function Mintbtn() {
  const [errormsg, setErrorMsg] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalSupply, settotalSupply] = useState("*****");
  const [walletConnected, setWalletConnected] = useState(0);
  const [maxallowed, setmaxallowed] = useState(10);

  useEffect(async () => {
    if (await detectEthereumProvider()) {
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);
        settotalSupply(await ct.methods.totalSupply().call());
        setmaxallowed(await ct.methods.MAX_PER_Transtion().call());

        if (nftquantity - (await ct.methods.totalSupply().call()) == 0) {
          setErrorMsg("All NFTs minted, Sale has ended");
        }
      } else {
        // setProvider(false);
        setErrorMsg(
          'Select "' +
            SELECTEDNETWORKNAME +
            '" network in your wallet to buy the nft'
        );
      }
    } else {
      setErrorMsg(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      // setProvider(false);
    }
    if (window.ethereum) {
      handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      });
      setTimeout(handleEthereum, 10000);
    }

    function handleEthereum() {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        console.log("Ethereum successfully detected!");
        // setProvider(true);
      } else {
        setErrorMsg("Please install MetaMask!");
        // setProvider(false);
      }
    }
  }, []);

  async function loadWeb3() {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      // Meta Mask Connected Account Address
      let metaMaskAccount = await web3.eth.getAccounts();
      metaMaskAccount = metaMaskAccount[0];

      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        // // creating contract instance
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);
        let current = await ct.methods.totalSupply().call();
        if (Number(current) === nftquantity) {
          console.log("Sold out");
          return;
        }

        let price = await ct.methods.getPrice().call();
        await ct.methods
          .mint(quantity)
          .send({ from: metaMaskAccount, value: price * quantity });
        settotalSupply(await ct.methods.totalSupply().call());
        setQuantity(1);
      } else {
        setErrorMsg(
          'Select "' +
            SELECTEDNETWORKNAME +
            '" network in your wallet to buy the nft'
        );
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      // window.alert(
      //   "Non-Ethereum browser detected. You should consider trying MetaMask!"
      // );
      {
        setErrorMsg(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    }
  }

  async function connectWallet() {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;

      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        // // creating contract instance
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let metaMaskAccount = await web3.eth.getAccounts();
        metaMaskAccount = metaMaskAccount[0];

        let statusone = await ct.methods.getStatus().call();

        if (statusone == 1) {
          let wl = await ct.methods.isWhitelisted(metaMaskAccount).call();
          if (wl) setWalletConnected(1);
          else setErrorMsg("You are not Whitelisted");
        } else if (statusone == 2) setWalletConnected(1);
        else setErrorMsg("Sale not started");
      }
    }
  }

  return (
    <div className="BtnDiv">
      {!errormsg ? (
        <div className="row align-items-center">
          {walletConnected == 0 ? (
            <div className="col-12">
              <a
                href="#"
                className="hero_button w-inline-block"
                style={{ marginBottom: "0px" }}
              >
                <div
                  className="button_text"
                  onClick={() => {
                    connectWallet();
                  }}
                >
                  MINT (NOW)
                </div>
              </a>
            </div>
          ) : (
            ""
          )}
          {walletConnected == 1 ? (
            <>
              <div className="col-sm-5">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    className="hero_button w-inline-block"
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity == 1}
                    style={{
                      marginBottom: "20px",
                      padding: "0px 15px",
                    }}
                  >
                    <span className="button_text">-</span>
                  </button>
                  <span
                    className="quantity button_text"
                    style={{ padding: "20px" }}
                  >
                    {quantity}
                  </span>
                  <button
                    className="hero_button w-inline-block"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity == maxallowed}
                    style={{
                      marginBottom: "15px !important",
                      padding: "0px 15px",
                    }}
                  >
                    <span className="button_text">+</span>
                  </button>
                </div>
              </div>
              <div className="col-sm-7 pt-3 pt-sm-0">
                <button
                  type="button"
                  className="hero_button w-inline-block"
                  onClick={() => loadWeb3()}
                  style={{ marginBottom: "0px" }}
                >
                  <span className="button_text">Mint A Car</span>
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        <h5 className="mt-2 hero_description">
          <b>{errormsg}</b>
        </h5>
      )}
      <div className="hero_description">{totalSupply}/14,165</div>
    </div>
  );
}

export default Mintbtn;
