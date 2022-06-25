import React, { useState, useEffect } from "react";
import abi from "../abi/itemabi.json";
import Web3 from "web3";

import detectEthereumProvider from "@metamask/detect-provider";
import MaterialStory from "react-data-table-component";

import { itemAddress } from "../contracts";
import axios from "axios";
import Header from "./header";

import { db } from "../../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SELECTEDNETWORK = "80001";
const SELECTEDNETWORKNAME = "Polygon Testnet";

const IPFS = require("ipfs-core");
const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "c7c71a2b1a2f9f9ec205",
  "1e19ebdd0a345cf90d8491437ddd2bba60ae9156110eb052f102086b09d799a9"
);

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
        ct = new web3.eth.Contract(abi, itemAddress);
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

  const create = async (event) => {
    event.preventDefault();
    let imgObj = event.target[0].files[0];

    console.log(imgObj);

    setLoading(true);
    alert("Uploading Image to IPFS");
    const ipfs = await IPFS.create();
    let cid = await ipfs.add(imgObj);
    const { ipfsHash } = await pinata.pinByHash(cid.path, {
      pinataMetadata: { name: "image " + imgObj.name },
    });
    // console.log("Img done");
    alert("Processing Metadata");
    let meta = {
      name: document.getElementById("itemName").value,
      description: document.getElementById("itemDescription").value,
      image: "https://pixies.mypinata.cloud/ipfs/" + ipfsHash,
    };

    cid = await ipfs.add(JSON.stringify(meta));
    console.log(cid);
    const data = await pinata.pinByHash(cid.path, {
      pinataMetadata: { name: String(Number(total) + Number(1)) },
    });

    await setDoc(doc(db, "items", String(Number(total) + 1)), meta).then(
      async (res) => {
        alert("Processing transaction with Metamask");
        await ct.methods
          .mint("https://pixies.mypinata.cloud/ipfs/" + data.ipfsHash)
          .send({ from: metaMaskAccount });
      }
    );
    setLoading(false);
  };

  const update = async (event) => {
    event.preventDefault();
    setLoading(true);

    alert("Uploading Image to IPFS");
    let imgObj = event.target[0].files[0];
    let cid;
    const data = new FormData();
    data.append("file", imgObj);

    await axios
      .post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
        headers: {
          // @ts-ignore
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: "c7c71a2b1a2f9f9ec205",
          pinata_secret_api_key:
            "1e19ebdd0a345cf90d8491437ddd2bba60ae9156110eb052f102086b09d799a9",
        },
      })
      .then((response) => {
        cid = response.data.IpfsHash;
      })
      .catch((error) => {
        console.log(error);
        return;
      });

    alert("Processing Metadata");
    let meta = {
      name: document.getElementById("uitemName").value,
      description: document.getElementById("uitemDescription").value,
      image: "https://pixies.mypinata.cloud/ipfs/" + cid,
    };

    await pinata
      .pinJSONToIPFS(meta, {
        pinataMetadata: {
          name: meta.name,
        },
      })
      .then((result) => {
        cid = result.IpfsHash;
      })
      .catch((err) => {
        console.log(err);
        return;
      });

    await setDoc(
      doc(db, "items", String(document.getElementById("uitemId").value)),
      meta
    ).then(async (res) => {
      alert("Processing transaction with Metamask");
      await ct.methods
        .updateITEM(
          document.getElementById("uitemId").value,
          "https://pixies.mypinata.cloud/ipfs/" + cid
        )
        .send({ from: metaMaskAccount });
    });

    alert("All done");
    setLoading(false);
  };

  return (
    <>
      {!errormsg ? (
        <>
          <Header />
          <div className="main">
            <div className="container">
              <div className="row py-5">
                <div className="col-md-5">
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
                  <hr></hr>
                  <form onSubmit={update} encType="multipart/form-data">
                    <label className="form-label">Update Item</label> <br />
                    <input type="file" id="itemImage" name="image" />
                    <input
                      placeholder="Item Id"
                      className="form-control"
                      required
                      id="uitemId"
                    />
                    <input
                      placeholder="Name"
                      className="form-control"
                      required
                      id="uitemName"
                    />
                    <textarea
                      placeholder="Description"
                      className="form-control"
                      required
                      id="uitemDescription"
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
          </div>
        </>
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
