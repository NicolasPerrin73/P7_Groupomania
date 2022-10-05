import React from "react";
import { useState } from "react";

const PasswordConfirm = ({ passwordConfirm, setPasswordConfirm }) => {
  const passwordRegExp = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isVisible, setIsVisible] = useState("password");

  const passwordValidation = (event) => {
    const testPassword = passwordRegExp.test(event);
    setIsVisible("password");

    if (testPassword === true) {
      setPasswordConfirm(event);
      setPasswordErrorMsg("");
    } else if (event === "") {
      setPasswordErrorMsg("");

      setPasswordConfirm();
    } else {
      setPasswordErrorMsg("6 caractères dont une Majuscule, une miniscule, une chiffre et un caractère spécial");
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
      <label htmlFor="password">Confirmer le mot de passe</label>
      <div className="form__password">
        <input name="password" type={isVisible} placeholder="P@ssw0rd" onBlur={(event) => passwordValidation(event.target.value)} className={passwordErrorMsg === "" ? "" : "form__invalid"} />
        <i className="fa-solid fa-eye" onClick={showpassword}></i>
      </div>
    </>
  );
};

export default PasswordConfirm;
