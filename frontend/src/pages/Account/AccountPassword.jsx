import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AccountUserProfile from "../../components/AccountUserProfile/AccountUserProfile";
import Header from "../../components/Header/Header";
import Password from "../../components/Password";
import PasswordConfirm from "../../components/PasswordConfirm";
import { useUserdata } from "../../utils/hook";

/**
 *Component to change password
 * @return {*}
 */
const AccountPassword = () => {
  //Custom Hook
  const { userData } = useUserdata();
  //Component states
  const [currentPassword, setCurrentPassword] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [formPasswordIsValid, setFormPasswordIsValid] = useState(false);
  const [formCurrentPasswordIsValid, setFormCurrentPasswordIsValid] = useState(false);
  const [formPasswordConfirmIsValid, setFormPasswordConfirmIsValid] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [samePassword, setSamePassword] = useState(false);
  const [resStatus, setResStatus] = useState();
  const [formErrorMessage, setFormErrorMessage] = useState(false);

  useEffect(() => {
    if (password === passwordConfirm) {
      setPasswordConfirmError(false);
      setSamePassword(true);
    } else if (password === undefined || passwordConfirm === undefined) {
      setSamePassword(false);
      setPasswordConfirmError(false);
    } else if (password !== passwordConfirm) {
      setPasswordConfirmError(true);
      setSamePassword(false);
    }
  }, [password, passwordConfirm]);

  useEffect(() => {
    if (formPasswordConfirmIsValid === true && formPasswordIsValid === true && samePassword === true) {
      setFormIsValid(true);
      setPasswordConfirmError(false);
    } else {
      setFormIsValid(false);
    }
  }, [formPasswordIsValid, formPasswordConfirmIsValid, samePassword]);

  /**
   *Capture OnClick to password changes
   *Send currentPassword, password states to backend
   *account redirection
   *or resStatus state set to 401 if incorrect current password
   */
  const submit = () => {
    if (formIsValid === false) {
      setFormErrorMessage(true);
    } else if (formIsValid === true) {
      setFormErrorMessage(false);
      const token = localStorage.getItem("token");
      axios
        .put(
          `http://localhost:3001/api/auth/${userData.id}/password`,
          { oldPassword: currentPassword, newPassword: password },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          window.location.href = "/account";
        })
        .catch((err) => {
          console.log(err);
          setResStatus(err.response.status);
        });
    }
  };

  return (
    <>
      <Header userData={userData} />

      <main>
        <h1>Modifiez votre mot de passe</h1>

        <section className="account">
          <Link to="/account" className="account__back" title="retour">
            <i className="fa-solid fa-left-long"></i>
          </Link>

          <AccountUserProfile userData={userData} />

          <form className="form">
            <Password
              password={currentPassword}
              setPassword={setCurrentPassword}
              current={"actuel"}
              formPasswordIsValid={formCurrentPasswordIsValid}
              setFormPasswordIsValid={setFormCurrentPasswordIsValid}
            />
            <Password password={password} setPassword={setPassword} formPasswordIsValid={formPasswordIsValid} setFormPasswordIsValid={setFormPasswordIsValid} />
            <PasswordConfirm
              passwordConfirm={passwordConfirm}
              setPasswordConfirm={setPasswordConfirm}
              formPasswordConfirmIsValid={formPasswordConfirmIsValid}
              setFormPasswordConfirmIsValid={setFormPasswordConfirmIsValid}
            />

            <div className={passwordConfirmError === false ? "hidden" : "form__errorMessage"}>
              <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
              <span>Les mots de passes ne correspondent pas</span>
            </div>

            <div className={resStatus === 401 ? "form__errorMessage" : "hidden"}>
              <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
              <span>Mot de passe actuel invalide</span>
            </div>
          </form>

          <button onClick={submit}>Enregistrer</button>

          <span className={formErrorMessage === false ? "hidden" : "form__errorMessage"}>
            <i className="fa-sharp fa-solid fa-circle-exclamation"></i>Formulaire invalide
          </span>
        </section>
      </main>

      <div className="left-decoration"></div>
    </>
  );
};

export default AccountPassword;
