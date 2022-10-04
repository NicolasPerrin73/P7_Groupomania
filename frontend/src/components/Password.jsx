import React from "react";
import { useState } from "react";

const Password = ({ password, setPassword }) => {
  const passwordRegExp = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})");
  const [isValid, setIsValid] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isVisible, setIsVisible] = useState("password");

  const passwordValidation = (event) => {
    const testPassword = passwordRegExp.test(event);
    setIsVisible("password");

    if (testPassword === true) {
      setPassword(event);
      setPasswordErrorMsg("");
      setIsValid(true);
    } else if (event === "") {
      setPasswordErrorMsg("");
      setIsValid(false);
      setPassword();
    } else {
      setPasswordErrorMsg("Doit contenir une Majuscule, une miniscule, une chiffre et un caractère spécial");
      setIsValid(false);
    }
  };

  const showpassword = () => {
    if (isVisible === "password") {
      setIsVisible("text");
    } else if (isVisible === "text") {
      setIsVisible("password");
    }
  };

  return (
    <>
      <label htmlFor="password">Mot de passe</label>
      <div className="form__password">
        <input name="password" type={isVisible} placeholder="P@ssw0rd" onBlur={(event) => passwordValidation(event.target.value)} className={passwordErrorMsg === "" ? "" : "form__invalid"} />
        <i className="fa-solid fa-eye" onClick={showpassword}></i>
      </div>
      <span className="form__errorMessage">{passwordErrorMsg}</span>
    </>
  );
};

export default Password;
