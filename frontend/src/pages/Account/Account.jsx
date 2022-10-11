import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AccountUserProfile from "../../components/AccountUserProfile/AccountUserProfile";
import DeleteConfirm from "../../components/Delete_Confirm/DeleteConfirm";
import Header from "../../components/Header/Header";
import { useUserdata } from "../../utils/hook";

const Account = () => {
  const { userData } = useUserdata();
  const [delecteClick, setdeleteClick] = useState(false);
  const [IsConfirmed, setIsConfirmed] = useState(false);

  const deleteConfirm = () => {
    setdeleteClick(true);
  };

  useEffect(() => {
    if (IsConfirmed === true) {
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
  }, [userData.id, IsConfirmed]);

  return (
    <>
      <Header userData={userData} />
      <main className="account">
        <AccountUserProfile userData={userData} />
        <section className="account__settings">
          {delecteClick === true ? <DeleteConfirm IsConfirmed={IsConfirmed} setIsConfirmed={setIsConfirmed} setdeleteClick={setdeleteClick} deleteText={"votre compte"} /> : ""}

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
              </button>{" "}
            </>
          ) : (
            ""
          )}
        </section>
      </main>
    </>
  );
};

export default Account;
