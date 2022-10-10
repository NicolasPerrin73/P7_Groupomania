import React from "react";

const DeleteConfirm = ({ IsConfirmed, setIsConfirmed, setdeleteClick }) => {
  return (
    <>
      <div className="deleteConfirm_container">
        <p>Voulez vous vraiment supprimer ce post?</p>
        <div className="deleteConfirm_container__button">
          <button onClick={(e) => setIsConfirmed(true)}>OUI</button>
          <button onClick={(e) => setdeleteClick(false)}>NON</button>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirm;
