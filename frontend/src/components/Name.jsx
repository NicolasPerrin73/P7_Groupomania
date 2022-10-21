import React from "react";
import { useEffect } from "react";
import { useState } from "react";

/**
 *Component for name form
 * @param {*} { firstName, setFirstName, lastName, setLastName }
 * @return {*}
 */
const Name = ({ firstName, setFirstName, lastName, setLastName, formNameIsValid, setFormNameIsValid }) => {
  //RegExp for name: no special caractere and digit, 2 caractere minimum
  const nameRegExp = new RegExp("^[\\w'\\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\\]]{2,}$");

  //Component state
  const [fistNameIsValid, setFirstNameIsValid] = useState(false);
  const [lasttNameIsValid, setLastNameIsValid] = useState(false);
  const [firstNameErrorMsg, setFirstNameErrorMsg] = useState(false);
  const [lastNameErrorMsg, setLastNameErrorMsg] = useState(false);

  /**
   *OnChange, test firstName input with RegExp
   *change firstName, firstNameIsValide state if passed
   *change nameErrorMsg if failed
   * @param {*} event
   */
  const firstNameValidation = (event) => {
    const testName = nameRegExp.test(event);
    if (testName === true) {
      setFirstName(event);
      setFirstNameIsValid(true);
      setFirstNameErrorMsg(false);
    } else if (event === "") {
      setFirstNameIsValid(false);
      setFirstName();
      setFirstNameErrorMsg(false);
    } else if (testName === false) {
      setFirstNameIsValid(false);
      setFirstNameErrorMsg(true);
    }
  };

  /**
   *OnChange, test lastName input with RegExp
   *change lastName, lastNameIsValide state if passed
   *change nameErrorMsg if failed
   * @param {*} event
   */
  const lastNameValidation = (event) => {
    const testName = nameRegExp.test(event);
    if (testName === true) {
      setLastName(event);
      setLastNameIsValid(true);
      setLastNameErrorMsg(false);
    } else if (event === "") {
      setLastNameIsValid(false);
      setLastName();
      setLastNameErrorMsg(false);
    } else if (testName === false) {
      setLastNameIsValid(false);
      setLastNameErrorMsg(true);
    }
  };

  /**
   * Change state if form is valid
   */
  useEffect(() => {
    if (fistNameIsValid === true && lasttNameIsValid === true) {
      setFormNameIsValid(true);
    } else {
      setFormNameIsValid(false);
    }
  }, [fistNameIsValid, lasttNameIsValid, setFormNameIsValid]);

  return (
    <>
      <label htmlFor="firstName">Nom</label>

      <input id="firstName" type="text" placeholder="Nom de famille" onChange={(event) => firstNameValidation(event.target.value)} className={firstNameErrorMsg === true ? "form__invalid" : ""} />

      <label htmlFor="lastName">Prénom</label>

      <input id="lastName" type="text" placeholder="Prénom" onChange={(event) => lastNameValidation(event.target.value)} className={lastNameErrorMsg === true ? "form__invalid" : ""} />

      <span className={firstNameErrorMsg === true || lastNameErrorMsg === true ? "form__errorMessage" : "hidden"}>2 caractères minimum, sans caractères speciaux</span>
    </>
  );
};

export default Name;
