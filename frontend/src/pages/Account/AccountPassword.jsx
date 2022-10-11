import axios from "axios";
import React from "react";
import { useState } from "react";
import AccountUserProfile from "../../components/AccountUserProfile/AccountUserProfile";
import Header from "../../components/Header/Header";
import Password from "../../components/Password";
import PasswordConfirm from "../../components/PasswordConfirm";
import { useUserdata } from "../../utils/hook";

const AccountPassword = () => {
  const { userData } = useUserdata();
  const [currentPassword, setCurrentPassword] = useState([]);
  const [password, setPassword] = useState([]);
  const [passwordConfirm, setPasswordConfirm] = useState([]);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [resStatus, setResStatus] = useState();

  const submit = () => {
    if (password !== passwordConfirm) {
      setPasswordConfirmError(true);
    } else if (password === passwordConfirm) {
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

      <main className="account">
        <AccountUserProfile userData={userData} />
        <form className="form">
          <Password password={currentPassword} setPassword={setCurrentPassword} current={"actuel"} />
          <Password password={password} setPassword={setPassword} />
          <PasswordConfirm passwordConfirm={passwordConfirm} setPasswordConfirm={setPasswordConfirm} />

          <div className={passwordConfirmError === false ? "form__errorMessage--none" : "form__errorMessage"}>
            <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
            <span>Les mots de passes ne correspondent pas</span>
          </div>

          <div className={resStatus === 401 ? "form__errorMessage" : "form__errorMessage--none"}>
            <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
            <span>Mot de passe actuel invalide</span>
          </div>
        </form>

        <button onClick={submit}>Enregistrer</button>
      </main>
    </>
  );
};

export default AccountPassword;
