import React, { useState, useEffect } from "react";
import abi from "../abi/auction_user.json";
import Web3 from "web3";

import detectEthereumProvider from "@metamask/detect-provider";

import { auction_user } from "../contracts";
import axios from "axios";

import { db } from "../../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

import Countdown, { zeroPad } from "react-countdown";
import { toast } from "react-toastify";

const SELECTEDNETWORK = "4";
const SELECTEDNETWORKNAME = "Rinkeby Testnet";

const IPFS = require("ipfs-core");
const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "03c57681b0e77b962da8",
  "f6fd39d19c1c69ffb8488bc8ab007c62865555b5a7c7d6fa8626527871767d3d"
);

let web3, ct, total;

const renderer = ({ days, hours, minutes, seconds }) => (
  <span>
    {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
  </span>
);

export default function Create() {
  const [preview, setpreview] = useState({
    img: "./imgs/placeholder.png",
    name: "Name",
    bid: "0.5",
    desc: "Description",
    time: (Date.now() / 1000) * 1.0012502,
    id: "#",
  });

  const create = async (event) => {
    event.preventDefault();

    window.web3 = new Web3(window.ethereum);
    web3 = window.web3;

    let metamaskAddress = await web3.eth.getAccounts();
    metamaskAddress = metamaskAddress[0];

    ct = new web3.eth.Contract(abi, auction_user);

    if ((await web3.eth.net.getId()) != SELECTEDNETWORK) {
      toast.error('Enable "' + SELECTEDNETWORKNAME + '" network!');
      return false;
    }

    let imgObj = event.target[0].files[0];
    let meta, data;

    await toast.promise(
      async () => {
        const ipfs = await IPFS.create();
        let cid = await ipfs.add(imgObj);

        const { ipfsHash } = await pinata.pinByHash(cid.path, {
          pinataMetadata: { name: "image " + imgObj.name },
        });

        meta = {
          name: document.getElementById("itemName").value,
          description: document.getElementById("itemDescription").value,
          image: "https://pixies.mypinata.cloud/ipfs/" + ipfsHash,
        };

        cid = await ipfs.add(JSON.stringify(meta));

        data = await pinata.pinByHash(cid.path, {
          pinataMetadata: { name: String(Number(total) + Number(1)) },
        });
        ipfs.stop();
      },
      {
        pending: "Processing Metadata",
        success: "Success!!",
        error: "Failed!!",
      }
    );

    await toast
      .promise(
        async () => {
          await setDoc(doc(db, "items", String(Number(total) + 1)), meta).then(
            async (res) => {
              let auctionEndDate =
                document.getElementById("auctionEndDate").value;
              auctionEndDate = Math.floor(
                new Date(auctionEndDate).getTime() / 1000
              );

              await ct.methods
                .createAuction(
                  String(
                    document.getElementById("minBidPrice").value * 10 ** 18
                  ),
                  String(auctionEndDate),
                  String("https://pixies.mypinata.cloud/ipfs/" + data.ipfsHash)
                )
                .send({ from: metamaskAddress });
            }
          );
        },
        {
          pending: "Waiting Confirmation on blockchain!!",
          success: "Success!!",
          error: "Failed!!",
        }
      )
      .then(async () => {
        let p = preview;
        p.id = await ct.methods.totalSupply().call();
      });
  };

  const update = (event) => {
    event.preventDefault();

    let p = {
      img: preview.img,
      name: preview.name,
      bid: preview.bid,
      desc: preview.desc,
      time: preview.time,
      id: preview.id,
    };

    if (event.target.name == "image")
      p.img = URL.createObjectURL(event.target.files[0]);
    else if (event.target.name == "time") {
      p.time = Math.floor(new Date(event.target.value).getTime() / 1000);
    } else p[event.target.name] = event.target.value;

    setpreview(p);
  };

  return (
    <div className="main">
      <div className="container">
        <div className="row py-5 justify-content-center">
          <div className="col-md-4">
            <form
              onSubmit={create}
              encType="multipart/form-data"
              onChange={update}
            >
              <h1 className="form-label">Create Auction</h1> <br />
              <input
                class="form-control"
                type="file"
                id="itemImage"
                name="image"
              />
              <input
                placeholder="Name"
                className="form-control"
                required
                id="itemName"
                name="name"
              />
              <input
                placeholder="Description"
                className="form-control"
                required
                id="itemDescription"
                name="desc"
              />
              <input
                placeholder="Minimum Bid Price"
                className="form-control"
                required
                id="minBidPrice"
                name="bid"
              />
              <input
                placeholder="Auction End Date"
                className="form-control"
                required
                id="auctionEndDate"
                type="datetime-local"
                name="time"
              />
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
          <div className="col-md-4">
            <div className="box">
              <img className="thumb" src={preview.img} />
              <small className="date">
                <i className="fa fa-clock" />
                &nbsp;
                <Countdown
                  date={new Date(preview.time * 1000)}
                  renderer={renderer}
                />
              </small>
              <div className="row align-items-start">
                <div className="col-8 pr-0 titlebox">
                  <h6>{preview.name}</h6>
                </div>
                <div className="col-4 pricebox">
                  <small className="label desc d-block">Current Bid</small>
                  <img src="/upload/bnb.png" className="bnbcoin" />
                  <h6 className="price">{preview.bid}</h6>
                </div>
              </div>
              <hr />
              <small className="desc">{preview.desc}</small>
              <a
                className="btn btn-theme w-100 mt-3 mx-auto d-block"
                href={preview.id}
              >
                Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
