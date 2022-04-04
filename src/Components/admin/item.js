import React, { useState, useEffect } from "react";
import abi from "../abi/itemabi.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import MaterialStory from "react-data-table-component";
import axios from "axios";

import firebase from "../../firebase.js";
// import { collection, addDoc } from "firebase/firestore";
const db = firebase.firestore();

const REACT_APP_CONTRACT_ADDRESS = "0xaE62E801988b3698c91FC39F95a68B9fb0AD4651";
const SELECTEDNETWORK = "80001";
const SELECTEDNETWORKNAME = "Polygon Testnet";

const columns = [
  {
    name: "Id",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Matadata",
    selector: (row) => row.metadata,
  },
];

let web3, metaMaskAccount, ct, total;

export default function Item() {
  const [errormsg, setErrorMsg] = useState(false);
  const [dropdown, setDropdown] = useState(0);
  const [itemRows, setItemRows] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (await detectEthereumProvider()) {
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      web3 = window.web3;

      metaMaskAccount = await web3.eth.getAccounts();
      metaMaskAccount = metaMaskAccount[0];

      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        ct = new web3.eth.Contract(abi, REACT_APP_CONTRACT_ADDRESS);
        total = await ct.methods.totalSupply().call();
        let ItemOption = [];
        ItemOption.push(
          <option disabled selected value="">
            Select
          </option>
        );
        let items = [];
        for (let k = 1; k <= total; k++) {
          ItemOption.push(
            <option key={k} value={k}>
              {k}
            </option>
          );
          items.push({
            id: k,
            metadata: (
              <a href={await ct.methods.tokenURI(k).call()} target="_blank">
                {await ct.methods.tokenURI(k).call()}
              </a>
            ),
          });
        }
        setItemRows(items);
        setDropdown(ItemOption);
        // console.log(ct);

        if ((await ct.methods.owner().call()) != metaMaskAccount)
          setErrorMsg("Connect with owner wallet to continue");
      } else {
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

  const createItem = async (metadata) => {
    return await ct.methods
      .mint(metadata)
      .send({ from: metaMaskAccount, value: 0 });
  };

  const updateItem = async (event) => {
    event.preventDefault();
    let metadata = document.getElementById("updateMetadata").value;
    let id = document.getElementById("itemId").value;

    await ct.methods
      .updateITEM(id, metadata)
      .send({ from: metaMaskAccount, value: 0 });
  };

  const create = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", event.target[0].files[0]);

    setLoading(true);

    axios.post("/upload", formData, {}).then((res) => {
      console.log("Image upload success");

      let path = res.data.filename;

      let itemData = {
        path: path,
        name: document.getElementById("itemName").value,
        description: document.getElementById("itemDescription").value,
      };

      db.collection("items")
        .doc((Number(total) + 1).toString())
        .set(itemData)
        .then(() => {
          console.log("Databse update success");
          createItem(
            window.location.origin + "/api/metadata/" + (Number(total) + 1)
          );
          setLoading(false);
        });
    });
  };

  return (
    <>
      {!errormsg ? (
        <div className="container">
          <div className="row py-5">
            <div className="col-md-5">
              <form onSubmit={createItem}>
                <div className="mb-3">
                  <label className="form-label">Create Item</label>
                  <input
                    placeholder="Item Metadata ipfs://"
                    className="form-control"
                    required
                    id="itemMetadata"
                  />
                </div>
                <button className="btn btn-primary">Submit</button>
              </form>
              <br />
              <form onSubmit={updateItem}>
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
              </form>
              <hr></hr>
              <form onSubmit={create} encType="multipart/form-data">
                <label className="form-label">Create Item</label> <br />
                <input type="file" id="itemImage" name="image" />
                <input
                  placeholder="Name"
                  className="form-control"
                  required
                  id="itemName"
                />
                <input
                  placeholder="Description"
                  className="form-control"
                  required
                  id="itemDescription"
                />
                <button className="btn btn-primary">Submit</button>
              </form>
            </div>
            <div className="col-md-7">
              <label>Items</label>
              <MaterialStory
                columns={columns}
                data={itemRows}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="300px"
                highlightOnHover
              />
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
