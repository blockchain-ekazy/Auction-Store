import Header from "./header";
import { db } from "../../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Settings() {
  const setSliderItems = async (event) => {
    event.preventDefault();
    const sliderIds = document.getElementById("sliderIds").value;
    await setDoc(doc(db, "settings", "slides"), {
      auctions: sliderIds,
    }).then((res) => alert("Slides updated"));
  };

  const setFeaturedItem = async (event) => {
    event.preventDefault();
    const featuredIds = document.getElementById("featuredId").value;
    await setDoc(doc(db, "settings", "featured"), {
      auction: featuredIds,
    }).then((res) => alert("Featured Auction updated"));
  };

  const setLatestItems = async (event) => {
    event.preventDefault();
    const featuredIds = document.getElementById("latestIds").value;
    await setDoc(doc(db, "settings", "latest"), {
      auctions: featuredIds,
    }).then((res) => alert("Latest Auctions updated"));
  };

  return (
    <>
      <Header />
      <div className="main">
        <div className="container">
          <div className="row py-5">
            <div className="col-md-6">
              <form onSubmit={setSliderItems} encType="multipart/form-data">
                <label className="form-label">Set Slider Items</label> <br />
                <input
                  placeholder="Item Ids"
                  className="form-control"
                  required
                  type="text"
                  id="sliderIds"
                  name="sliderIds"
                />
                <button className="btn btn-primary">Submit</button>
              </form>
              <br />
              <br />
              <form onSubmit={setFeaturedItem} encType="multipart/form-data">
                <label className="form-label">Set Featured Item</label> <br />
                <input
                  placeholder="Item Id"
                  className="form-control"
                  required
                  type="text"
                  id="featuredId"
                  name="featuredId"
                />
                <button className="btn btn-primary">Submit</button>
              </form>
              <br />
              <br />
              <form onSubmit={setLatestItems} encType="multipart/form-data">
                <label className="form-label">Set Latest Items</label> <br />
                <input
                  placeholder="Item Id"
                  className="form-control"
                  required
                  type="text"
                  id="latestIds"
                  name="latestIds"
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
