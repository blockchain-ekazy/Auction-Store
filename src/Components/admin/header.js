function Header() {
  return (
    <div className="container-fluid bg-dark userHeader">
      <div className="container">
        <a href="/">Website Home</a> &nbsp;
        <a href="/admin">Admin Home</a> &nbsp;
        <a href="/admin/items">Items</a> &nbsp;
        <a href="/admin/auctions">Auctions</a> &nbsp;
        <a href="/admin/createauctions">Create Auctions</a> &nbsp;
        <a href="/admin/settings">Settings</a> &nbsp;
      </div>
    </div>
  );
}

export default Header;
