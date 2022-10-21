import React from "react";
import { useState } from "react";
import logo from "../assets/icon-left-font-monochrome-black.png";
import Email from "../components/Email";
import Password from "../components/Password";
import axios from "axios";
import { Link } from "react-router-dom";
import Name from "../components/Name";
import PasswordConfirm from "../components/PasswordConfirm";
import { useEffect } from "react";

/**
 *Component to account register
 * @return {*}
 */
const SignUp = () => {
  //Component State
  const [mail, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [formEmailIsValid, setFormEmailIsValid] = useState(false);
  const [formPasswordIsValid, setFormPasswordIsValid] = useState(false);
  const [formPasswordConfirmIsValid, setFormPasswordConfirmIsValid] = useState(false);
  const [formNameIsValid, setFormNameIsValid] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [samePassword, setSamePassword] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState(false);

  useEffect(() => {
    if (password === passwordConfirm) {
      setPasswordConfirmError(false);
      setSamePassword(true);
    } else if (password === undefined || passwordConfirm === undefined) {
      setSamePassword(false);
      setPasswordConfirmError(false);
    } else if (password !== passwordConfirm) {
      setPasswordConfirmError(true);
      setSamePassword(false);
    }
  }, [password, passwordConfirm]);

  useEffect(() => {
    if (formEmailIsValid === true && formPasswordIsValid === true && formPasswordConfirmIsValid === true && formNameIsValid === true && samePassword === true) {
      setFormIsValid(true);
      setPasswordConfirmError(false);
    } else {
      setFormIsValid(false);
    }
  }, [formEmailIsValid, formNameIsValid, formPasswordIsValid, formPasswordConfirmIsValid, samePassword]);

  /**
   *Capture onClick and register Account
   *send mail, password,firstName,lastName state to backend
   *add token to local storage
   *home redirection
   * @param {*} e
   */
  const register = (e) => {
    e.preventDefault();
    if (formIsValid === false) {
      setFormErrorMessage(true);
    } else if (formIsValid === true) {
      setFormErrorMessage(false);
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
            <Email email={mail} setEmail={setEmail} formEmailIsValid={formEmailIsValid} setFormEmailIsValid={setFormEmailIsValid} />
            <Name firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} formNameIsValid={formNameIsValid} setFormNameIsValid={setFormNameIsValid} />
            <Password password={password} setPassword={setPassword} formPasswordIsValid={formPasswordIsValid} setFormPasswordIsValid={setFormPasswordIsValid} />
            <PasswordConfirm
              passwordConfirm={passwordConfirm}
              setPasswordConfirm={setPasswordConfirm}
              formPasswordConfirmIsValid={formPasswordConfirmIsValid}
              setFormPasswordConfirmIsValid={setFormPasswordConfirmIsValid}
            />

            <div className={passwordConfirmError === false ? "hidden" : "form__errorMessage"}>
              <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
              <span>Les mots de passes ne correspondent pas</span>
            </div>

            <button onClick={(e) => register(e)}>Inscription</button>
            <span className={formErrorMessage === false ? "hidden" : "form__errorMessage"}>
              <i className="fa-sharp fa-solid fa-circle-exclamation"></i>Formulaire invalide
            </span>
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
