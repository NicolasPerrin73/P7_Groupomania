import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/icon-left-font-monochrome-black.png";

const Error404 = () => {
  return (
    <>
      <main className="login_container login_container--error">
        <section className="login">
          <Link to="/" className="account__back" title="retour">
            <i className="fa-solid fa-left-long"></i>
          </Link>
          <img src={logo} alt="logo de goupomania" className="logo" />

          <h1>404</h1>
          <h2>Oups! cette page n'existe pas</h2>
        </section>
      </main>
    </>
  );
};

export default Error404;
