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
  const [formEmailIsValid, setFormEmailIsValid] = useState(false);
  const [formPasswordIsValid, setFormPasswordIsValid] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState(false);

  /**
   *Capture OnClick and try to connect user
   *Send mail and password state to backend
   *add token to localStorage, redirection to home
   *or display error message
   * @param {*} e
   */
  const connexion = (e) => {
    if (formEmailIsValid === false || formPasswordIsValid === false) {
      setFormErrorMessage(true);
    } else if (formEmailIsValid === true && formPasswordIsValid === true) {
      setFormErrorMessage(false);
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
    }
  };

  return (
    <>
      <div className="login_container">
        <img src={logo} alt="logo de groupomania" className="logo" />

        <section className="login">
          <h1>S'identifier</h1>

          <form className="form">
            <Email email={mail} setEmail={setEmail} formEmailIsValid={formEmailIsValid} setFormEmailIsValid={setFormEmailIsValid} />
            <Password password={password} setPassword={setPassword} formPasswordIsValid={formPasswordIsValid} setFormPasswordIsValid={setFormPasswordIsValid} />

            <span className={formErrorMessage === true ? "form__errorMessage" : "hidden"}>Formulaire invalide</span>

            <button onClick={(e) => connexion(e)}>Connexion</button>

            <div className={loginError === false ? "hidden" : "form__errorMessage"}>
              <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
              <span>Identifiant et/ou mot de passe erroné</span>
            </div>
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
