import { Link } from "react-router-dom";
import logo from "../../assets/groupomania-logo.png";

/**
 *Component header of page
 * @param {*} { userData }
 * @return {*}
 */
const Header = ({ userData }) => {
  /**
   *Capture onClick to remove token from localStorage
   *log out
   */
  const clearLocalStorage = () => {
    localStorage.clear();
  };

  return (
    <>
      <header className="header">
        <nav className="header__nav">
          <img src={logo} alt="logo" className="header__logo" />

          <Link to="/" className="header__link header__link--picture">
            <div>{userData.picture_url === null ? <i className="fa-solid fa-circle-user"></i> : <img src={userData.picture_url} alt="de profil"></img>}</div>

            <span>
              {userData.nom} <br /> {userData.prenom}
            </span>
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
