import React from "react";
import { useState } from "react";

/**
 *Component for password confirmation form
 * @param {*} { passwordConfirm, setPasswordConfirm }
 * @return {*}
 */
const PasswordConfirm = ({ passwordConfirm, setPasswordConfirm, formPasswordConfirmIsValid, setFormPasswordConfirmIsValid }) => {
  //RegExp for password: 6 charatere minimun,1 uppercase,1 lowercase,1 digit,1 special
  const passwordRegExp = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})");

  //Component state
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isVisible, setIsVisible] = useState("password");

  /**
   *On focus, test password input with RegExp
   *change passwordConfirm state if passed
   *change passwordErrorMsg if failed
   * @param {*} event
   */
  const passwordValidation = (event) => {
    const testPassword = passwordRegExp.test(event);
    setIsVisible("password");

    if (testPassword === true) {
      setPasswordConfirm(event);
      setPasswordErrorMsg("");
      setFormPasswordConfirmIsValid(true);
    } else if (event === "") {
      setPasswordErrorMsg("");
      setPasswordConfirm();
      setFormPasswordConfirmIsValid(false);
    } else {
      setPasswordErrorMsg("6 caractères dont une Majuscule, une miniscule, une chiffre et un caractère spécial");
      setFormPasswordConfirmIsValid(false);
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
      <label htmlFor="confirmPassword">Confirmer le mot de passe</label>

      <div className="form__password">
        <input id="confirmPassword" type={isVisible} placeholder="P@ssw0rd" onBlur={(event) => passwordValidation(event.target.value)} className={passwordErrorMsg === "" ? "" : "form__invalid"} />

        <i className="fa-solid fa-eye" onClick={showpassword}></i>
      </div>
    </>
  );
};

export default PasswordConfirm;
