import React from "react";
import { useState } from "react";
import logo from "../assets/icon-left-font-monochrome-black.png";
import Email from "../components/Email";
import Password from "../components/Password";
import axios from "axios";
import { Link } from "react-router-dom";
import Name from "../components/Name";
import PasswordConfirm from "../components/PasswordConfirm";

/**
 *Component to account register
 * @return {*}
 */
const SignUp = () => {
  //Component State
  const [mail, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [passwordConfirm, setPasswordConfirm] = useState([]);
  const [firstName, setFirstName] = useState([]);
  const [lastName, setLastName] = useState([]);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);

  /**
   *Capture onClick and register Account
   *send mail, password,firstName,lastName state to backend
   *add token to local storage
   *home redirection
   * @param {*} e
   */
  const register = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setPasswordConfirmError(true);
    } else if (password === passwordConfirm) {
      axios
        .post("http://localhost:3001/api/auth/signup", {
          email: mail,
          password: password,
          firstName: firstName,
          lastName: lastName,
        })
        .then(function (res) {
          const token = res.data.token;
          localStorage.setItem("token", token);
          window.location.href = "/";
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <>
      <div className="login_container">
        <img src={logo} alt="logo" className="logo" />

        <section className="login">
          <h1>S'inscrire</h1>

          <form className="form">
            <Email email={mail} setEmail={setEmail} />
            <Name firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} />
            <Password password={password} setPassword={setPassword} />
            <PasswordConfirm passwordConfirm={passwordConfirm} setPasswordConfirm={setPasswordConfirm} />

            <div className={passwordConfirmError === false ? "form__errorMessage--none" : "form__errorMessage"}>
              <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
              <span>Les mots de passes ne correspondent pas</span>
            </div>

            <button onClick={(e) => register(e)}>Inscription</button>
          </form>
        </section>

        <section className="login">
          <p>Vous avez déjà un compte?</p>

          <Link to="/login">
            <button>Connexion</button>
          </Link>
        </section>
      </div>
    </>
  );
};

export default SignUp;
