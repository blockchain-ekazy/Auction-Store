import React, { useState, useEffect } from "react";
import abi from "../abi/auctionabi.json";
import nftAbi from "../abi/itemabi.json";
import coinAbi from "../abi/coinabi.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

import { itemAddress } from "../contracts";
import { auctionAddress } from "../contracts";
import { coinAddress } from "../contracts";

import "./Auctions.css";
import Header from "./header";

const SELECTEDNETWORK = "80001";
const SELECTEDNETWORKNAME = "Polygon Testnet";

let web3, metaMaskAccount, ct, nftCt;

export default function CreateAuction() {
  const [errormsg, setErrorMsg] = useState(false);
  const [loading, setLoading] = useState(false);
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
        ct = await new web3.eth.Contract(abi, auctionAddress);
        nftCt = await new web3.eth.Contract(nftAbi, itemAddress);
        if ((await nftCt.methods.owner().call()) != metaMaskAccount) {
          setErrorMsg("Connect with owner wallet to continue");
          return;
        }

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
      } else {
        setErrorMsg('Select "' + SELECTEDNETWORKNAME + '" network to continue');
      }
    } else {
      setErrorMsg("Install MetaMask!");
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
    auctionEndDate = Math.floor(new Date(auctionEndDate).getTime() / 1000);

    setLoading(true);
    alert("Creating Transaction with metamask");
    await ct.methods
      .createAuction(
        String(itemId),
        String(minBidPrice * 10 ** 18),
        String(auctionEndDate)
      )
      .send({ from: metaMaskAccount });
    alert("Auction is now live");
    setLoading(false);
  };
  return (
    <>
      <Header />
      {!errormsg ? (
        <div className="main">
          <div className="container">
            <div className="row py-5">
              <div className="col-6">
                <form onSubmit={createAuction}>
                  <div className="mb-3">
                    <h4 className="form-label">Create/Update Auction</h4>
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
                    />
                    <input
                      placeholder="Auction End Date"
                      className="form-control"
                      required
                      id="auctionEndDate"
                      type="datetime-local"
                    />
                  </div>
                  <button className="btn btn-primary">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        alert(errormsg)
      )}
      {loading ? (
        <div className="loading">
          <img src="/loading.gif" />
        </div>
      ) : (
        ""
      )}
    </>
  );
}
