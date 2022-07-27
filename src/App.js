import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Item from "./Components/admin/item";
import CreateAuction from "./Components/admin/createauction";
import Auction from "./Components/admin/auctions";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PastAuctions from "./Components/user/pastauctions";
import ViewAuctions from "./Components/user/viewauctions";
import AdminHome from "./Components/admin/adminHome";
import Header from "./Components/user/header";
import Home from "./Components/Home";
import Settings from "./Components/admin/settings";
import SingleAuction from "./Components/user/singleAuction";
import Create from "./Components/user/create";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/admin" element={<AdminHome />} />
          <Route exact path="/admin/items" element={<Item />} />
          <Route exact path="/admin/auctions" element={<Auction />} />
          <Route exact path="/admin/settings" element={<Settings />} />
          <Route
            exact
            path="/admin/createauctions"
            element={<CreateAuction />}
          />
          <Route
            exact
            path="/past-auctions"
            element={
              <>
                <Header />
                <PastAuctions />
              </>
            }
          />
          <Route
            exact
            path="/viewauctions"
            element={
              <>
                <Header />
                <ViewAuctions />
              </>
            }
          />
          <Route
            exact
            path="/auction"
            element={
              <>
                <Header />
                <SingleAuction />
              </>
            }
          />
          <Route
            exact
            path="/create"
            element={
              <>
                <Header />
                <Create />
              </>
            }
          />
          <Route
            exact
            path="/"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={4000} hideProgressBar theme="colored" />
    </>
  );
}

export default App;
