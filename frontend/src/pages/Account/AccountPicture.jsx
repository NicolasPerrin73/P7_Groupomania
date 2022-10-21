import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AccountUserProfile from "../../components/AccountUserProfile/AccountUserProfile";
import Header from "../../components/Header/Header";
import { useUserdata } from "../../utils/hook";

/**
 *Component to change user picture
 * @return {*}
 */
const AccountPicture = () => {
  //Custom Hook
  const { userData, profilHaveImage, setProfilHaveImage } = useUserdata();

  //Component state
  const [selectedImage, setSelectedImage] = useState();

  /**
   *Captute Onclick and add file to SelectedImage state
   * @param {*} e
   */
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  /**
   *Capture OnClick and remove file of memory
   *and reinitializing selectImage state
   */
  const removeSelectedImage = () => {
    URL.revokeObjectURL(selectedImage);
    setSelectedImage();
  };

  /**
   *Capture OnClick and delete current image
   */
  const deleteProfilImage = () => {
    setProfilHaveImage(false);
  };

  /**
   *Capture onClick to publish post modification
   *Send selectImage,profilHaveImage to backend
   *account redirection
   */
  const publish = () => {
    const token = localStorage.getItem("token");
    let formData = new FormData();

    formData.append("image", selectedImage);
    formData.append("profilHaveImage", profilHaveImage);
    axios
      .put(`http://localhost:3001/api/auth/${userData.id}/picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        window.location.href = "/account";
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header userData={userData} />

      <main>
        <h1>Modifiez votre image de profil</h1>

        <section className="account">
          <Link to="/account" className="account__back" title="retour">
            <i className="fa-solid fa-left-long"></i>
          </Link>

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
              <div className="img_container img_container--profile">
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
        </section>
      </main>
      <div className="left-decoration"></div>
    </>
  );
};

export default AccountPicture;
