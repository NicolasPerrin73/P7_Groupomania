import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AccountUserProfile from "../../components/AccountUserProfile/AccountUserProfile";
import Header from "../../components/Header/Header";
import Name from "../../components/Name";
import { useUserdata } from "../../utils/hook";

/**
 *Component to change account name
 * @return {*}
 */
const AccountName = () => {
  //Custom Hook
  const { userData } = useUserdata();
  //Component states
  const [firstName, setFirstName] = useState([]);
  const [lastName, setLastName] = useState([]);

  /**
   *Capture OnClick to name changes
   *Send firstName, lastName state to backend
   *account redirection
   */
  const submit = () => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:3001/api/auth/${userData.id}/name`,
        { firstName: firstName, lastName: lastName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => console.log(res.data))
      .then((window.location.href = "/account"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header userData={userData} />

      <main>
        <h1>Modifiez votre nom de profil</h1>

        <section className="account">
          <Link to="/account" className="account__back" title="retour">
            <i className="fa-solid fa-left-long"></i>
          </Link>

          <AccountUserProfile userData={userData} />

          <form className="form">
            <Name firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} />
          </form>

          <button onClick={submit}>Enregistrer</button>
        </section>
      </main>
      <div className="left-decoration"></div>
    </>
  );
};

export default AccountName;
