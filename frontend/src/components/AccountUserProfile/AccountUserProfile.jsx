import React from "react";

/**
 *Component to display user info
 * @param {*} { userData }
 * @return {*}
 */
const AccountUserProfile = ({ userData }) => {
  return (
    <section className="account__user">
      <div>{userData.picture_url === null ? <i className="fa-solid fa-circle-user"></i> : <img src={userData.picture_url} alt="de profil"></img>}</div>

      <h1>
        {userData.nom} <br /> {userData.prenom}
      </h1>
    </section>
  );
};

export default AccountUserProfile;
