import React from "react";
import { useState } from "react";

const Email = () => {
  const emailRegExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [emailErrorMsg, setemailErrorMsg] = useState("");

  const emailValidation = (event) => {
    const testEmail = emailRegExp.test(event);

    if (testEmail === true) {
      setEmail(event);
      setemailErrorMsg("");
      setIsValid(true);
    } else {
      setemailErrorMsg("Format d'email incorrecte");
      setIsValid(false);
    }
  };

  return (
    <>
      <label htmlFor="email">Identifiant</label>
      <input name="email" type="email" placeholder="email" onBlur={(event) => emailValidation(event.target.value)} className={emailErrorMsg === "" ? "" : "form__invalid"} />
      <span>{emailErrorMsg}</span>
    </>
  );
};

export default Email;
