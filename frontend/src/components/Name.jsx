import React from "react";
import { useState } from "react";

const Name = ({ firstName, setFirstName, lastName, setLastName }) => {
  const nameRegExp = new RegExp("^[\\w'\\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\\]]{2,}$");

  const [fistNameIsValid, setFirstNameIsValid] = useState(false);
  const [lasttNameIsValid, setLastNameIsValid] = useState(false);
  const [nameErrorMsg, setnameErrorMsg] = useState(false);

  const firstNameValidation = (event) => {
    const testName = nameRegExp.test(event);
    if (testName === true) {
      setFirstName(event);
      setFirstNameIsValid(true);
      if (lasttNameIsValid === true) {
        setnameErrorMsg(false);
      } else {
        setnameErrorMsg(true);
      }
    } else if (event === "") {
      setFirstNameIsValid(false);
      setFirstName();
      if (lasttNameIsValid === true) {
        setnameErrorMsg(false);
      } else {
        setnameErrorMsg(true);
      }
    } else if (testName === false) {
      setFirstNameIsValid(false);
      setnameErrorMsg(true);
    }
  };

  const lastNameValidation = (event) => {
    const testName = nameRegExp.test(event);
    if (testName === true) {
      setLastName(event);
      setLastNameIsValid(true);
      if (fistNameIsValid === true) {
        setnameErrorMsg(false);
      } else {
        setnameErrorMsg(true);
      }
    } else if (event === "") {
      setLastNameIsValid(false);
      setLastName();
      if (fistNameIsValid === true) {
        setnameErrorMsg(false);
      } else {
        setnameErrorMsg(true);
      }
    } else if (testName === false) {
      setLastNameIsValid(false);
      setnameErrorMsg(true);
    }
  };
  return (
    <>
      <label htmlFor="firstName">Nom</label>
      <input name="firstName" type="text" placeholder="Nom de famille" onChange={(event) => firstNameValidation(event.target.value)} className={fistNameIsValid === true ? "" : "form__invalid"} />

      <label htmlFor="lastName">Prénom</label>
      <input name="lastName" type="text" placeholder="Prénom" onChange={(event) => lastNameValidation(event.target.value)} className={lasttNameIsValid === true ? "" : "form__invalid"} />
      <span className={nameErrorMsg === true ? "form__errorMessage" : "form__errorMessage--none"}>Le nom et prenom ne doivent pas contenir de caractère spéciaux</span>
    </>
  );
};

export default Name;
