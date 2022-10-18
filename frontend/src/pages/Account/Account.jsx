import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AccountUserProfile from "../../components/AccountUserProfile/AccountUserProfile";
import DeleteConfirm from "../../components/Delete_Confirm/DeleteConfirm";
import Header from "../../components/Header/Header";
import { useUserdata } from "../../utils/hook";

/**
 *Component to account settings
 * @return {*}
 */
const Account = () => {
  //Custom Hook
  const { userData } = useUserdata();
  //Component state
  const [delecteClick, setdeleteClick] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  /**
   *Catch OnClick in state for account deleting confirmation
   */
  const deleteConfirm = () => {
    setdeleteClick(true);
  };

  /**
   *Delete account when confirmed
   *remove token from localStorage
   *sign up redirection
   *watch isConfirm state
   */
  useEffect(() => {
    if (isConfirmed === true) {
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:3001/api/auth/${userData.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          localStorage.clear();
          window.location.href = "/signup";
        })
        .catch((err) => console.log(err));
    }
  }, [userData.id, isConfirmed]);

  return (
    <>
      <Header userData={userData} />

      <main>
        <h1>Votre profil</h1>

        <section className="account">
          <AccountUserProfile userData={userData} />

          <nav className="account__settings">
            {delecteClick === true ? <DeleteConfirm IsConfirmed={isConfirmed} setIsConfirmed={setIsConfirmed} setdeleteClick={setdeleteClick} deleteText={"votre compte"} /> : ""}

            {delecteClick === false ? (
              <>
                <Link to="/account/picture">
                  <button>Photo de profil</button>
                </Link>

                <Link to="/account/name">
                  <button>Nom de profil</button>
                </Link>

                <Link to="/account/password">
                  <button>Mot de passe</button>
                </Link>

                <button className="button--red" onClick={deleteConfirm}>
                  Se désincrire
                </button>
              </>
            ) : (
              ""
            )}
          </nav>
        </section>
      </main>
      <div className="left-decoration"></div>
    </>
  );
};

export default Account;
