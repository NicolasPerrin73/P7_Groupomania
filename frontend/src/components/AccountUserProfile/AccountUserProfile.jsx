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

      <h2 className="account__user__name">
        {userData.nom} <br /> {userData.prenom}
      </h2>
    </section>
  );
};

export default AccountUserProfile;
