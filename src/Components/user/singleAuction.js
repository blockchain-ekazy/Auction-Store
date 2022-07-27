import { useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import Web3 from "web3";
import abi from "../abi/auctionabi.json";
import abinft from "../abi/itemabi.json";
import { auctionAddress, itemAddress } from "../contracts";
import axios from "axios";

import "./singleAuction.css";

const renderer = ({ days, hours, minutes, seconds }) => (
  <span>
    {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
  </span>
);

export default function SingleAuction() {
  const [auctionId, setAuctionId] = useState();
  const [auction, setAuction] = useState({
    title: "",
    description: "",
    image: "",
    time: Number(1876974238000),
    highestBid: "",
    highestBidder: "",
    owner: "",
  });

  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("id");
    setAuctionId(id);
    loadAuction(id);
  }, []);

  const loadAuction = async (id) => {
    window.web3 = new Web3(window.ethereum);
    const web3 = window.web3;

    let ct = await new web3.eth.Contract(abi, auctionAddress);
    let ctnft = await new web3.eth.Contract(abinft, itemAddress);

    let a = await ct.methods.Auctions(id).call();
    let m = await ctnft.methods.tokenURI(id).call();
    let o = await ctnft.methods.ownerOf(id).call();
    o = o.substr(0, 8) + "..." + o.substr(o.length - 5, o.length);

    let res = await axios.get(m);

    setAuction({
      title: res.data.name,
      description: res.data.description,
      image: res.data.image,
      time: a.expiresAt,
      highestBid: a.highestBid,
      highestBidder: a.highestBidder,
      owner: o,
      claimed: a.claimed,
    });
  };

  const placeBid = async (event) => {
    event.preventDefault();
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    let web3 = window.web3;
    let metaMaskAccount = await web3.eth.getAccounts();
    metaMaskAccount = metaMaskAccount[0];

    let offer = document.getElementById("bidPrice").value;
    if (offer <= auction.highestBid / 10 ** 18) {
      alert("Offer must be greater than existing bid");
      return;
    }

    let ct = await new web3.eth.Contract(abi, auctionAddress);

    alert("Processing transaction");
    let o = String(offer * 10 ** 18);
    await ct.methods
      .makeBid(auctionId)
      .send({ from: metaMaskAccount, value: o })
      .then(() => window.location.reload());
  };

  return (
    <>
      <div className="container">
        <div className="row my-5">
          <div className="col-md-6">
            <img src={auction.image} className="w-100 rounded" />
          </div>
          <div className="col-md-6">
            <div className="card p-3">
              <div className="card-header bg-transparent">
                <h1>{auction.title}</h1>
                <p>
                  Owned by <b>{auction.owner}</b>
                </p>
              </div>
              <div className="card-body">{auction.description}</div>
              <div className="singledate card-footer bg-transparent position-relative">
                {auction.claimed ? (
                  <h5 className="mt-2">Auction Ended</h5>
                ) : (
                  <>
                    <h6 className="m-0">
                      Sale ends{" "}
                      {new Date(Number(auction.time) * 1000).toGMTString()}
                    </h6>
                    <h5>
                      <Countdown
                        date={new Date(Number(auction.time) * 1000)}
                        renderer={renderer}
                      />
                    </h5>
                  </>
                )}
              </div>
              {!auction.claimed ? (
                <div className="card-footer bg-transparent">
                  <h1>
                    <h6 className="m-0 d-inline">Current Bid:</h6>
                    <span>
                      <img src="./upload/bnb.png" className="bnbicon" />
                      {auction.highestBid / 10 ** 18}
                    </span>
                  </h1>
                  <button
                    className="btn btn-theme px-3 py-2"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Place Bid
                  </button>
                </div>
              ) : (
                <div className="card-footer bg-transparent">
                  <h1>
                    <h6 className="m-0 d-inline">Final Bid:</h6>
                    <span>
                      <img src="./upload/bnb.png" className="bnbicon" />
                      {auction.highestBid / 10 ** 18}
                    </span>
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="exampleModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <button
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div class="modal-body text-white text-center">
              <h2>Place a Bid</h2>
              <h6>
                You must bid greater than &nbsp;
                <span className="price">
                  <img src="/upload/bnb.png" className="bnbcoin" />
                  {auction.highestBid / 10 ** 18}
                </span>
              </h6>
              <form onSubmit={placeBid} className="mt-3 w-75 mx-auto">
                <input
                  placeholder="0.00 BNB"
                  className="form-control"
                  required
                  id="bidPrice"
                  min={auction.highestBid}
                />
                <button className="btn btn-theme w-100 mt-3 mx-auto d-block">
                  Place Bid
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
