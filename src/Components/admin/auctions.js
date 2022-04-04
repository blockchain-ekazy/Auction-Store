import "./Auctions.css";
import React, { useState, useEffect } from "react";
import abi from "../abi/auctionabi.json";
import nftAbi from "../abi/itemabi.json";
import coinAbi from "../abi/coinabi.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import DataTable from "react-data-table-component";

const REACT_APP_CONTRACT_ADDRESS = "0xDEDfb6398DB752cB991905be918412d7C5F25f1c";
const nftContractAddress = "0x1ecbBfa6F656FA4D1744fBF9353c53b1B09Ae8Eb";
const coinContractAddress = "0x8415Ea4719b7e0CAc256Cf66B076930E2cEA970B";
const SELECTEDNETWORK = "80001";
const SELECTEDNETWORKNAME = "Polygon Testnet";

let web3, metaMaskAccount, ct, nftCt, coinCt;

const columns = [
  {
    name: "Id",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
  },
  {
    name: "Bid Period",
    selector: (row) => row.auctionBidPeriod,
  },
  {
    name: "Highest Bid",
    selector: (row) => row.highestBid,
  },
  {
    name: "Highest Bidder",
    selector: (row) => row.highestBidder,
  },
];

export default function Auctions() {
  const [errormsg, setErrorMsg] = useState(false);
  const [dropdown, setDropdown] = useState(0);
  const [auctionRows, setAuctionRows] = useState();

  useEffect(async () => {
    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      web3 = window.web3;

      metaMaskAccount = await web3.eth.getAccounts();
      metaMaskAccount = metaMaskAccount[0];

      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        ct = await new web3.eth.Contract(abi, REACT_APP_CONTRACT_ADDRESS);
        nftCt = await new web3.eth.Contract(nftAbi, nftContractAddress);
        coinCt = await new web3.eth.Contract(coinAbi, coinContractAddress);

        if ((await nftCt.methods.owner().call()) != metaMaskAccount)
          setErrorMsg("Connect with owner wallet to continue");

        let indexforQuery = await ct.methods.getc().call();
        let a = [];
        let b = [];

        for (let i = 0; i < indexforQuery.length; i++) {
          a.push(await ct.methods.Auctions(indexforQuery[i]).call());
          let c = new Date(a[i].expiresAt * 1000);
          b.push({
            id: indexforQuery[i],
            status: a[i].auctionEnd ? "Active" : "Ended",
            auctionBidPeriod: c.toUTCString(),
            highestBid: a[i].highestBid,
            highestBidder: a[i].highestBidder,
          });
          setAuctionRows(b);
        }
        setAuctionRows(b);
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h3 className="py-3">Overview</h3>
          <div className="tableDiv">
            {/* <table id="myTable" class="display ">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Highest Bid</th>
                  <th>End Date</th>
                  <th>Highest Bid Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>{auctionRows}</tbody>
            </table> */}
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
    </div>
  );
}
