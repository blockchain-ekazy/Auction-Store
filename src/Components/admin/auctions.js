import "./Auctions.css";
import React, { useState, useEffect } from "react";
import abi from "../abi/auctionabi.json";
import nftAbi from "../abi/itemabi.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import DataTable from "react-data-table-component";

import { itemAddress } from "../contracts";
import { auctionAddress } from "../contracts";
import Header from "./header";

const SELECTEDNETWORK = "4";
const SELECTEDNETWORKNAME = "Rinkeby Testnet";

let web3, metaMaskAccount, ct, nftCt;

const columns = [
  {
    name: "Id",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
  },
  {
    name: "End Date",
    selector: (row) => row.auctionBidPeriod,
  },
  {
    name: "Current Bid",
    selector: (row) => row.highestBid,
  },
  {
    name: "Bidder Address",
    selector: (row) => row.highestBidder,
  },
  {
    name: "Claimed",
    selector: (row) => row.claimed,
  },
];

export default function Auctions() {
  const [errormsg, setErrorMsg] = useState(false);
  const [dropdown, setDropdown] = useState(0);
  const [auctionRows, setAuctionRows] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    setLoading(true);
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      web3 = window.web3;

      metaMaskAccount = await web3.eth.getAccounts();
      metaMaskAccount = metaMaskAccount[0];

      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        ct = await new web3.eth.Contract(abi, auctionAddress);
        nftCt = await new web3.eth.Contract(nftAbi, itemAddress);

        if ((await nftCt.methods.owner().call()) != metaMaskAccount)
          setErrorMsg("Connect with owner wallet to continue");

        let indexforQuery = await ct.methods.getc().call();
        indexforQuery = new Set(indexforQuery);
        indexforQuery = Array.from(indexforQuery);

        let a;
        let b = [];

        for (let i = 0; i < indexforQuery.length; i++) {
          a = await ct.methods.Auctions(indexforQuery[i]).call();
          b.push({
            id: a.nftId,
            status:
              Math.floor(new Date().getTime() / 1000) < a.expiresAt
                ? "Active"
                : "Ended",
            auctionBidPeriod: new Date(a.expiresAt * 1000).toUTCString(),
            highestBid: a.highestBid / 10 ** 18,
            highestBidder: (
              <a
                target="_blank"
                href={
                  "https://mumbai.polygonscan.com/address/" + a.highestBidder
                }
              >
                {a.highestBidder}
              </a>
            ),
            claimed: String(a.claimed),
          });
        }
        setAuctionRows(b);

        setLoading(false);
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

  // async function loadAuctions() {
  //   alert("Loading");

  //   let indexforQuery = await ct.methods.getc().call();
  //   indexforQuery = new Set(indexforQuery);

  //   console.log(indexforQuery);

  //   let a = [];
  //   let b = [];

  //   for (let i = 0; i < indexforQuery.length; i++) {
  //     a.push(await ct.methods.Auctions(indexforQuery[i]).call());
  //     b.push({
  //       id: indexforQuery[i],
  //       status:
  //         Math.floor(new Date().getTime() / 1000) < a[i].expiresAt
  //           ? "Active"
  //           : "Ended",
  //       auctionBidPeriod: new Date(a[i].expiresAt * 1000).toUTCString(),
  //       minBid: a[i].minBid,
  //       highestBid: a[i].highestBid,
  //       highestBidder: a[i].highestBidder,
  //     });
  //   }
  //   setAuctionRows(b);

  //   alert("Complete");
  // }

  return (
    <>
      <Header />
      <div className="main">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 className="py-3">Overview</h3>
              <div className="tableDiv">
                <DataTable
                  columns={columns}
                  data={auctionRows}
                  pagination
                  fixedHeader
                  fixedHeaderScrollHeight="300px"
                  highlightOnHover
                />
              </div>
            </div>
          </div>
          {loading ? (
            <div className="loading">
              <img src="/loading.gif" />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
