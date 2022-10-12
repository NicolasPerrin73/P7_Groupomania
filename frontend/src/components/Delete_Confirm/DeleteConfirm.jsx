import React from "react";

/**
 *Component for delete confirmation
 * @param {*} { IsConfirmed, setIsConfirmed, setdeleteClick, deleteText }
 * @return {*}
 */
const DeleteConfirm = ({ IsConfirmed, setIsConfirmed, setdeleteClick, deleteText }) => {
  return (
    <>
      <div className={deleteText === "ce post" ? "deleteConfirm_container" : "deleteConfirm_container deleteConfirm_container--relative"}>
        <p>Voulez vous vraiment supprimer {deleteText}?</p>

        <div className="deleteConfirm_container__button">
          <button onClick={(e) => setIsConfirmed(true)} className="button--red">
            OUI
          </button>

          <button onClick={(e) => setdeleteClick(false)}>NON</button>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirm;
