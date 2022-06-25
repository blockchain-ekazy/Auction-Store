import Header from "./header";
import { db } from "../../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Settings() {
  const setSliderItems = async (event) => {
    event.preventDefault();
    // let d = await getDoc(doc(db, "settings", "featured"));
    // console.log(d.docs.map((d)=> ({d.data()})));
    // console.log(d.data());

    const featuredIds = document.getElementById("featuredIds").value;
    await setDoc(doc(db, "settings", "slides"), {
      auctions: featuredIds,
    }).then((res) => alert("Featured Auction updated"));
  };
  const update = () => {};

  return (
    <>
      <Header />
      <div className="main">
        <div className="container">
          <div className="row py-5">
            <div className="col-md-5">
              <form onSubmit={setSliderItems} encType="multipart/form-data">
                <label className="form-label">Set Slider Items</label> <br />
                <input
                  placeholder="Item Ids"
                  className="form-control"
                  required
                  type="text"
                  id="featuredIds"
                  name="featuredIds"
                />
                <button className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
