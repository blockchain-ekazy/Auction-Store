import Header from "./header";
import "./adminHome.css";
import auctionAbi from "../abi/auctionabi.json";
import { auctionAddress } from "../contracts";
import { useEffect, useState } from "react";
import Web3 from "web3";

function AdminHome() {
  const [metamaskAddress, setMetamaskAddress] = useState(
    <>
      LOGIN WITH METAMASK
      <br />
      <br />
    </>
  );

  useEffect(() => {
    start();
  }, []);

  async function start() {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts[0] != undefined) {
      if (!(await checkAdmin(accounts[0]))) {
        alert("Connected wallet is not admin");
        return;
      }
      setMetamaskAddress(
        <>
          {accounts[0]}
          <div className="mt-2 container-fluid bg-dark userHeader">
            <a href="/admin/items">Items</a> &nbsp;
            <a href="/admin/auctions">Auctions</a> &nbsp;
            <a href="/admin/createauctions">Create Auctions</a> &nbsp;
          </div>
        </>
      );
    }
  }

  const connect = async () => {
    await window.ethereum.enable();
    await start();
  };

  const checkAdmin = async (a) => {
    const web3 = new Web3(window.ethereum);
    const ct = await new web3.eth.Contract(auctionAbi, auctionAddress);
    return (
      String(await ct.methods.owner().call()).toLowerCase() ==
      String(a).toLowerCase()
    );
  };

  return (
    <>
      <Header />
      <div className="adminhome">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="card connectMain">
                <div className="card-body p-0 text-center" onClick={connect}>
                  <img
                    id="logo-container"
                    className="p-3"
                    src="./imgs/mmlogo.png"
                  />
                  <br />
                  {metamaskAddress}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
