import React from "react";
import logo from "../assets/groupomania-logo.png";
import Email from "../components/Email";

const Login = () => {
  return (
    <div className="login_container">
      <img src={logo} alt="logo" className="logo" />
      <section className="login">
        <h1>S'identifier</h1>
        <form className="form">
          <Email />
          <label htmlFor="password">Mot de passe</label>
          <input name="password" type="text" />

          <button>Connexion</button>
        </form>
      </section>
    </div>
  );
};

export default Login;
