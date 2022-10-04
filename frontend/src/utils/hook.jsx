import { useState } from "react";

export function ValidEmail(event) {
  const emailRegExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [emailErrorMsg, setemailErrorMsg] = useState("");
  const testEmail = emailRegExp.test(event);

  if (testEmail === true) {
    setEmail(event);
    setemailErrorMsg("");
    setIsValid(true);
  } else {
    setemailErrorMsg("Format d'email incorrecte");
    setIsValid(false);
  }
}
