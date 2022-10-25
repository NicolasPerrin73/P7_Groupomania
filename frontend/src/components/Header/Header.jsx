import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/groupomania-logo.png";

/**
 *Component header of page
 * @param {*} { userData }
 * @return {*}
 */
const Header = ({ userData }) => {
  //Component states
  const [isHidden, setIsHidden] = useState(true);

  /**
   *Capture onClick to remove token from localStorage
   *log out
   */
  const clearLocalStorage = () => {
    localStorage.clear();
  };

  const hideMenu = () => {
    if (isHidden === true) {
      setIsHidden(false);
    } else {
      setIsHidden(true);
    }
  };

  return (
    <>
      <header className="header">
        <nav className="header__nav">
          <div className="header__nav__top">
            <img src={logo} alt="logo de groupomania" className="header__logo" />

            <Link to="/" className="header__link header__link--picture" title="Acceuil">
              <div>{userData.picture_url === null ? <i className="fa-solid fa-circle-user"></i> : <img src={userData.picture_url} alt="de profil"></img>}</div>

              <span>
                {userData.nom} <br /> {userData.prenom}
              </span>
            </Link>

            <div className={"header__nav__burger"} onClick={hideMenu}>
              <span className={isHidden ? "header__nav__burger__line header__nav__burger__line--moveBar1_1" : "header__nav__burger__line header__nav__burger__line--moveBar1"}></span>
              <span className={isHidden ? "header__nav__burger__line header__nav__burger__line--moveBar2_1" : "header__nav__burger__line header__nav__burger__line--moveBar2"}></span>
              <span className={isHidden ? "header__nav__burger__line header__nav__burger__line--moveBar3_1" : "header__nav__burger__line header__nav__burger__line--moveBar3"}></span>
            </div>
          </div>

          <div className={isHidden ? "header__nav__link header__nav__link--up" : "header__nav__link header__nav__link--down"}>
            <Link to="/" className="header__link" title="accueil">
              <i className="fa-solid fa-house"></i>
              Accueil
            </Link>

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
    </>
  );
};
export default Header;
