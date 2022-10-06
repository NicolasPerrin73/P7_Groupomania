import React from "react";
import { useState } from "react";

const Email = ({ email, setEmail }) => {
  const emailRegExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

  const [emailErrorMsg, setemailErrorMsg] = useState("");

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
      <input name="email" type="email" placeholder="email" onBlur={(event) => emailValidation(event.target.value)} className={emailErrorMsg === "" ? "" : "form__invalid"} />
      <span className="form__errorMessage">{emailErrorMsg}</span>
    </>
  );
};

export default Email;
