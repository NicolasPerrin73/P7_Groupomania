import React from "react";
import { useState } from "react";

/**
 *Component for email form
 * @param {*} { email, setEmail }
 * @return {*}
 */
const Email = ({ email, setEmail, formEmailIsValid, setFormEmailIsValid }) => {
  //RegExp for email format: word@word.word
  const emailRegExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

  //Component state
  const [emailErrorMsg, setemailErrorMsg] = useState(false);

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
      setemailErrorMsg(false);
      setFormEmailIsValid(true);
    } else if (event === "") {
      setemailErrorMsg(false);
      setEmail();
      setFormEmailIsValid(false);
    } else if (testEmail === false) {
      setemailErrorMsg(true);
      setFormEmailIsValid(false);
    }
  };

  return (
    <>
      <label htmlFor="email">Identifiant</label>

      <input id="email" type="email" placeholder="email" onBlur={(event) => emailValidation(event.target.value)} className={emailErrorMsg === false ? "" : "form__invalid"} />

      <span className={emailErrorMsg === true ? "form__errorMessage" : "hidden"}>Format d'email incorrect</span>
    </>
  );
};

export default Email;
