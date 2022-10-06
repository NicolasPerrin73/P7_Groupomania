import { Link } from "react-router-dom";
import logo from "../../assets/groupomania-logo.png";

const Header = ({ userData }) => {
  const clearLocalStorage = () => {
    localStorage.clear();
  };

  return (
    <>
      <header className="header">
        <nav className="header__nav">
          <img src={logo} alt="logo" className="header__logo" />
          <Link to="/" className="header__link header__link--picture">
            {userData.picture_url === null ? <i className="fa-solid fa-circle-user"></i> : <img src={userData.picture_url} alt="de profil"></img>}
          </Link>
          <div className="header__nav__link">
            <Link to="/addpost" className="header__link">
              <i className="fa-solid fa-circle-plus"></i>Publier
            </Link>
            <Link to="/account" className="header__link">
              <i className="fa-solid fa-circle-user"></i>Profil
            </Link>
            <Link to="/login" className="header__link" onClick={clearLocalStorage}>
              <i className="fa-solid fa-right-from-bracket"></i>Deconnexion
            </Link>
          </div>
        </nav>
      </header>

      <section></section>
    </>
  );
};

export default Header;
