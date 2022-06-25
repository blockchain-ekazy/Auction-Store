import { useEffect, useState } from "react";

import { db } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
export default function Featured() {
  const [auction, setAuction] = useState({
    title: "",
    description: "",
    image: "",
    id: "",
  });

  const loadAuction = async () => {
    let d = await getDoc(doc(db, "settings", "featured"));
    let id = String(d.data().auction);

    let res = await getDoc(doc(db, "items", id));

    setAuction({
      title: res.data().name,
      description: res.data().description,
      image: res.data().image,
      id: id,
    });
  };

  useEffect(() => loadAuction(), []);
  return (
    <>
      <img src={auction.image} className="w-100 featuredImage" />
      <h2 className="heading pt-2">{auction.title}</h2>
      <hr className="line m-0" />
      <p className="text1 pt-2">{auction.description}</p>
      <a href={"/auction?id=" + auction.id} className="btn1">
        Read More
      </a>
    </>
  );
}
