import axios from "axios";
import React from "react";
import { useState } from "react";
import AccountUserProfile from "../../components/AccountUserProfile/AccountUserProfile";
import Header from "../../components/Header/Header";
import { useUserdata } from "../../utils/hook";

const AccountPicture = () => {
  const { userData, profilHaveImage, setProfilHaveImage } = useUserdata();
  const [selectedImage, setSelectedImage] = useState();

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    URL.revokeObjectURL(selectedImage);
    setSelectedImage();
  };

  const deleteProfilImage = () => {
    setProfilHaveImage(false);
  };

  const publish = () => {
    const token = localStorage.getItem("token");
    let formData = new FormData();

    formData.append("image", selectedImage);
    formData.append("profilHaveImage", profilHaveImage);
    console.log(profilHaveImage);
    axios
      .put(`http://localhost:3001/api/auth/${userData.id}/picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => console.log(res.data))
      .then((window.location.href = "/account"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header userData={userData} />
      <main className="account">
        <AccountUserProfile userData={userData} />
        <form className="post__content post__content--publish">
          <label htmlFor="file" className="button">
            Choisir une image
          </label>
          <input type="file" accept="image/*" name="picture" id="file" onChange={imageChange}></input>

          {selectedImage !== undefined ? (
            <div className="img_container">
              <img src={URL.createObjectURL(selectedImage)} alt="Thumb" />
              <button onClick={removeSelectedImage}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ) : profilHaveImage ? (
            <div className="img_container">
              <img src={userData.picture_url} alt="profil"></img>
              <button onClick={(e) => deleteProfilImage()}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ) : (
            ""
          )}
        </form>

        <button onClick={publish}>Enregistrer</button>
      </main>
    </>
  );
};

export default AccountPicture;
