import { useEffect, useState } from "react";

import { db } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Latest() {
  const [auction, setAuction] = useState([
    {
      title: "",
      image: "",
      id: "",
    },
    {
      title: "",
      image: "",
      id: "",
    },
    {
      title: "",
      image: "",
      id: "",
    },
  ]);

  const loadAuction = async () => {
    let d = await getDoc(doc(db, "settings", "latest"));
    let arr = String(d.data().auctions).split(",");

    let s = [];

    for await (const x of arr) {
      let i = await getDoc(doc(db, "items", x));
      s.push({
        name: i.data().name,
        image: i.data().image,
        id: x,
      });
    }

    setAuction(s);
  };

  useEffect(() => loadAuction(), []);
  return (
    <>
      <div className="row pt-5 sec3">
        <div className="col-1"></div>
        <div className="col-md-3 text-center hovermain my-3">
          <img className="w-100 coll" src={auction[0].image} />
          <h5 className="text-white pt-5">{auction[0].name}</h5>
          <a
            href={"/auction?id=" + auction[0].id}
            className="btn btn-theme px-3 py-2"
          >
            View Details
          </a>
        </div>
        <div className="col-md-4 text-center hovermain my-3">
          <img className="w-100 coll" src={auction[1].image} />
          <h5 className="text-white pt-5">{auction[1].name}</h5>
          <a
            href={"/auction?id=" + auction[1].id}
            className="btn btn-theme px-3 py-2"
          >
            View Details
          </a>
        </div>
        <div className="col-md-3 text-center hovermain my-3">
          <img className="w-100 coll" src={auction[2].image} />
          <h5 className="text-white pt-5">{auction[2].name}</h5>
          <a
            href={"/auction?id=" + auction[2].id}
            className="btn btn-theme px-3 py-2"
          >
            View Details
          </a>
        </div>
        <div className="col-1"></div>
      </div>
    </>
  );
}
