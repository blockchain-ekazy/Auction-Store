function Header() {
  return (
    <div className="container-fluid bg-dark userHeader">
      <div className="container">
        <a href="/">
          <img src="./logo.png" className="logo" />
        </a>
        <a href="/">Home</a> &nbsp;
        <a href="/viewauctions">View Auctions</a> &nbsp;
        <a href="/past-auctions">Past Auctions</a> &nbsp;
      </div>
    </div>
  );
}

export default Header;
