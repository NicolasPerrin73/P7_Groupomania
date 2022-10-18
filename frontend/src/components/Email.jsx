import React from "react";
import { useState } from "react";

/**
 *Component for email form
 * @param {*} { email, setEmail }
 * @return {*}
 */
const Email = ({ email, setEmail }) => {
  //RegExp for email format: word@word.word
  const emailRegExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

  //Component state
  const [emailErrorMsg, setemailErrorMsg] = useState("");

  /**
   *On focus, test email input with RegExp
   *change email state if passed
   *change emailErrorMsg if failed
   * @param {*} event
   */
  const emailValidation = (event) => {
    const testEmail = emailRegExp.test(event);
    if (testEmail === true) {
      setEmail(event);
      setemailErrorMsg("");
    } else if (event === "") {
      setemailErrorMsg("");
      setEmail();
    } else if (testEmail === false) {
      setemailErrorMsg("Format d'email incorrecte");
    }
  };

  return (
    <>
      <label htmlFor="email">Identifiant</label>

      <input id="email" type="email" placeholder="email" onBlur={(event) => emailValidation(event.target.value)} className={emailErrorMsg === "" ? "" : "form__invalid"} />

      <span className="form__errorMessage">{emailErrorMsg}</span>
    </>
  );
};

export default Email;
