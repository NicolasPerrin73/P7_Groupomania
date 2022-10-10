import React from "react";
import { Link } from "react-router-dom";
import AccountUserProfile from "../../components/AccountUserProfile/AccountUserProfile";
import Header from "../../components/Header/Header";
import { useUserdata } from "../../utils/hook";

const Account = () => {
  const { userData } = useUserdata();
  return (
    <>
      <Header userData={userData} />
      <main className="account">
        <AccountUserProfile userData={userData} />
        <section className="account__settings">
          <Link to="/account/picture">
            <button>Photo de profil</button>
          </Link>

          <Link to="/account/name">
            <button>Nom de profil</button>
          </Link>

          <Link to="/account/password">
            <button>Mot de passe</button>
          </Link>

          <button className="button--red">Se désincrire</button>
        </section>
      </main>
    </>
  );
};

export default Account;
