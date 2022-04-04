import React, { useState, useEffect } from "react";
import abi from "../abi/auctionabi.json";
import nftAbi from "../abi/itemabi.json";
import coinAbi from "../abi/coinabi.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

const REACT_APP_CONTRACT_ADDRESS = "0xDEDfb6398DB752cB991905be918412d7C5F25f1c";
const nftContractAddress = "0x95085af0eae3f64786b695c172afed8819bdc22c";
const coinContractAddress = "0x2a1f1d742e60c20dcc4e6e02d52c41243b4076cc";
const SELECTEDNETWORK = "80001";
const SELECTEDNETWORKNAME = "Polygon Testnet";

let web3, metaMaskAccount, ct, nftCt, coinCt;

export default function CreateAuction() {
  const [errormsg, setErrorMsg] = useState(false);
  const [dropdown, setDropdown] = useState(0);

  useEffect(async () => {
    if (await detectEthereumProvider()) {
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      web3 = window.web3;

      metaMaskAccount = await web3.eth.getAccounts();
      metaMaskAccount = metaMaskAccount[0];

      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        ct = await new web3.eth.Contract(abi, REACT_APP_CONTRACT_ADDRESS);
        nftCt = await new web3.eth.Contract(nftAbi, nftContractAddress);
        coinCt = await new web3.eth.Contract(coinAbi, coinContractAddress);

        let total = await nftCt.methods.totalSupply().call();
        let ItemOption = [];

        ItemOption.push(
          <option disabled selected value="">
            Select NFT Id
          </option>
        );

        for (let k = 1; k <= total; k++) {
          ItemOption.push(
            <option key={k} value={k}>
              {k}
            </option>
          );
        }
        setDropdown(ItemOption);
        if ((await nftCt.methods.owner().call()) != metaMaskAccount)
          setErrorMsg("Connect with owner wallet to continue");
      } else {
        setErrorMsg('Select "' + SELECTEDNETWORKNAME + '" network to continue');
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

  const createAuction = async (event) => {
    event.preventDefault();
    let itemId = document.getElementById("itemId").value;
    let minBidPrice = document.getElementById("minBidPrice").value;
    let auctionEndDate = document.getElementById("auctionEndDate").value;
    auctionEndDate = Math.floor(new Date(auctionEndDate).valueOf() / 1000);
    console.log(auctionEndDate);
    await ct.methods
      .createAuction(
        String(itemId),
        String(minBidPrice),
        String(auctionEndDate)
      )
      .send({ from: metaMaskAccount });
  };

  // const updateItem = async (event) => {
  //   event.preventDefault();
  //   let metadata = document.getElementById("updateMetadata").value;
  //   let id = document.getElementById("itemId").value;

  //   await ct.methods
  //     .updateITEM(id, metadata)
  //     .send({ from: metaMaskAccount, value: 0 });
  // };

  return (
    <>
      {!errormsg ? (
        <div className="container">
          <div className="row py-5">
            <div className="col-6">
              <form onSubmit={createAuction}>
                <div className="mb-3">
                  <label className="form-label">Create an Auction</label>
                  <select
                    placeholder="Item id"
                    className="form-control"
                    required
                    id="itemId"
                  >
                    {dropdown}
                  </select>
                  <input
                    placeholder="Minimum Bid Price"
                    className="form-control"
                    required
                    id="minBidPrice"
                    type="number"
                  />
                  <input
                    placeholder="Auction End Date"
                    className="form-control"
                    required
                    id="auctionEndDate"
                    type="date"
                  />
                </div>
                <button className="btn btn-primary">Submit</button>
              </form>
            </div>
            <div className="col-6">
              {/* <form onSubmit={updateItem}>
                <div className="mb-3">
                  <label className="form-label">Update Item</label>
                  <select
                    placeholder="Item id"
                    className="form-control"
                    required
                    id="itemId"
                  >
                    {dropdown}
                  </select>
                  <input
                    placeholder="Item Metadata ipfs://"
                    className="form-control"
                    required
                    id="updateMetadata"
                  />
                </div>
                <button
                  // type="button"
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </form> */}
            </div>
          </div>
        </div>
      ) : (
        alert(errormsg)
      )}
    </>
  );
}
