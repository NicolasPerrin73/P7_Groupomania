import React from "react";
import { useState } from "react";

/**
 *Component for password form
 * @param {*} { password, setPassword, current }
 * @return {*}
 */
const Password = ({ password, setPassword, current }) => {
  //RegExp for password: 6 charatere minimun,1 uppercase,1 lowercase,1 digit,1 special
  const passwordRegExp = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})");

  //Component states
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isVisible, setIsVisible] = useState("password");

  /**
   *On focus, test password input with RegExp
   *change password state if passed
   *change passwordErrorMsg if failed
   * @param {*} event
   */
  const passwordValidation = (event) => {
    const testPassword = passwordRegExp.test(event);
    setIsVisible("password");

    if (testPassword === true) {
      setPassword(event);
      setPasswordErrorMsg("");
    } else if (event === "") {
      setPasswordErrorMsg("");
      setPassword();
    } else {
      setPasswordErrorMsg("6 caractères dont une Majuscule, une miniscule, une chiffre et un caractère spécial");
    }
  };

  /**
   *On click, change input type to set password visible
   */
  const showpassword = () => {
    if (isVisible === "password") {
      setIsVisible("text");
    } else if (isVisible === "text") {
      setIsVisible("password");
    }
  };

  return (
    <>
      <label htmlFor={current === "actuel" ? "currentPassword" : "password"}>Mot de passe {current === undefined ? "" : current}</label>

      <div className="form__password">
        <input
          id={current === "actuel" ? "currentPassword" : "password"}
          type={isVisible}
          placeholder="P@ssw0rd"
          onBlur={(event) => passwordValidation(event.target.value)}
          className={passwordErrorMsg === "" ? "" : "form__invalid"}
        />

        <i className="fa-solid fa-eye" onClick={showpassword}></i>
      </div>

      <span className="form__errorMessage">{passwordErrorMsg}</span>
    </>
  );
};

export default Password;
