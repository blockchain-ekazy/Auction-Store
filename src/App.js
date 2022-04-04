import "./App.css";
import Item from "./Components/admin/item";
import CreateAuction from "./Components/admin/createauction";
import Auction from "./Components/admin/auctions";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import ViewAuctions from "./Components/user/viewauctions";

function App() {
  return (
    <>
      <div className="container">
        <a href="/">Home</a> &nbsp;
        <a href="/items">Items</a> &nbsp;
        <a href="/auctions">Auctions</a> &nbsp;
        <a href="/createauctions">Create Auctions</a> &nbsp;
        <a href="/viewauctions">View Auctions</a> &nbsp;
      </div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/items" element={<Item />} />
          <Route exact path="/auctions" element={<Auction />} />
          <Route exact path="/createauctions" element={<CreateAuction />} />
          <Route exact path="/viewauctions" element={<ViewAuctions />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
