import "./viewauctions.css";
import React, { useState, useEffect } from "react";
import abi from "../abi/auctionabi.json";
import nftAbi from "../abi/itemabi.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import axios from "axios";

import { itemAddress } from "../contracts";
import { auctionAddress } from "../contracts";
import Countdown, { zeroPad } from "react-countdown";

const SELECTEDNETWORK = "4";
const SELECTEDNETWORKNAME = "Rinkeby Testnet";

let web3, metaMaskAccount, ct, nftCt;
let a = [];

const renderer = ({ days, hours, minutes, seconds }) => (
  <span>
    {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
  </span>
);

export default function Auctions() {
  const [errormsg, setErrorMsg] = useState(false);
  const [auctionRows, setAuctionRows] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      web3 = window.web3;

      metaMaskAccount = await web3.eth.getAccounts();
      metaMaskAccount = metaMaskAccount[0];

      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        ct = await new web3.eth.Contract(abi, auctionAddress);
        nftCt = await new web3.eth.Contract(nftAbi, itemAddress);
        await loadAuctions();
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

  async function loadAuctions() {
    setLoading(true);
    let indexforQuery = await ct.methods.getc().call();
    indexforQuery = new Set(indexforQuery);
    indexforQuery = Array.from(indexforQuery);

    let b = [];
    for (let i = 0; i < indexforQuery.length; i++) {
      a[i] = await ct.methods.Auctions(indexforQuery[i]).call();

      if (a[i].expiresAt * 1000 < Date.now()) continue;

      let p = await nftCt.methods.tokenURI(indexforQuery[i]).call();
      let { data } = await axios.get(p);
      // a[i].highestBid /= 10 ** 18;

      b[i] = (
        <div className="col-xl-3 col-md-4 col-sm-6">
          <div className="box">
            <img className="thumb" src={data.image} />
            <small className="date">
              <i className="fa fa-clock" />
              &nbsp;
              <Countdown
                date={new Date(a[i].expiresAt * 1000)}
                renderer={renderer}
              />
            </small>
            <div className="row align-items-start">
              <div className="col-8 pr-0 titlebox">
                <h6>{data.name}</h6>
              </div>
              <div className="col-4 pricebox">
                <small className="label desc d-block">Current Bid</small>
                <img src="/upload/bnb.png" className="bnbcoin" />
                <h6 className="price">{a[i].highestBid / 10 ** 18}</h6>
              </div>
            </div>
            <hr />
            <small className="desc">{data.description.substr(0, 100)}</small>
            <a
              className="btn btn-theme w-100 mt-3 mx-auto d-block"
              href={"/auction?id=" + indexforQuery[i]}
            >
              Details
            </a>
          </div>
        </div>
      );
    }
    setAuctionRows(b);
    setLoading(false);
  }

  return !errormsg ? (
    <div className="container-fluid main pt-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3 className="py-3">
              Live Auctions{" "}
              <button
                className="btn btn-primary"
                onClick={() => {
                  loadAuctions();
                }}
              >
                Reload
              </button>
            </h3>
          </div>
        </div>
        <div className="row">{auctionRows}</div>

        {loading ? (
          <div className="loading">
            <img src="/loading.gif" />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  ) : (
    { errormsg }
  );
}
