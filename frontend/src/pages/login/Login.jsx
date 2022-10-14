import React from "react";
import { useState } from "react";
import logo from "../../assets/icon-left-font-monochrome-black.png";
import Email from "../../components/Email";
import Password from "../../components/Password";
import axios from "axios";
import { Link } from "react-router-dom";

/**
 *Component to log in
 * @return {*}
 */
function Login() {
  //Component state
  const [mail, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [loginError, setLoginError] = useState(false);

  /**
   *Capture OnClick and try to connect user
   *Send mail and password state to backend
   *add token to localStorage, redirection to home
   *or display error message
   * @param {*} e
   */
  const connexion = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/auth/login", {
        email: mail,
        password: password,
      })
      .then(function (res) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        setLoginError(false);
        window.location.href = "/";
      })
      .catch(function (error) {
        setLoginError(true);
      });
  };

  return (
    <>
      <div className="login_container">
        <img src={logo} alt="logo" className="logo" />

        <section className="login">
          <h1>S'identifier</h1>

          <form className="form">
            <Email email={mail} setEmail={setEmail} />
            <Password password={password} setPassword={setPassword} />

            <div className={loginError === false ? "form__errorMessage--none" : "form__errorMessage"}>
              <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
              <span>Identifiant et/ou mot de passe erroné</span>
            </div>

            <button onClick={(e) => connexion(e)}>Connexion</button>
          </form>
        </section>

        <section className="login">
          <p>Adhérez au réseau social de Groupomania dès maintenant</p>

          <Link to="/signup" className="button">
            Inscription
          </Link>
        </section>
      </div>
    </>
  );
}

export default Login;
