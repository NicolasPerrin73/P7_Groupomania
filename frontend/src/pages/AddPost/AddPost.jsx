import axios from "axios";
import React from "react";
import { useState } from "react";
import Header from "../../components/header/Header";
import { useDate, useSqlDate, useUserdata } from "../../utils/hook";

const AddPost = () => {
  const { userData } = useUserdata();

  const [selectedImage, setSelectedImage] = useState();
  const [content, setContent] = useState("");

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    URL.revokeObjectURL(selectedImage);
    setSelectedImage();
  };

  const { date } = useDate();
  const { sqlDate } = useSqlDate();

  const publish = () => {
    const token = localStorage.getItem("token");
    let formData = new FormData();

    formData.append("content", content);
    formData.append("created_date", sqlDate);
    formData.append("image", selectedImage);
    axios
      .post("http://localhost:3000/api/post", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mutipart/form-data",
        },
      })
      .then((res) => console.log(res.data))
      .then((window.location.href = "/"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header userData={userData} />
      <article className="post">
        <header className="post__header">
          <div>
            {userData.picture_url === null ? "" : <img src={userData.picture_url} alt="post"></img>}
            <span>
              {userData.nom} {userData.prenom}
            </span>
          </div>
          <time>{date}</time>
        </header>
        <form className="post__content post__content--publish">
          <label htmlFor="file" className="button">
            Choisir une image
          </label>
          <input type="file" accept="image/*" name="picture" id="file" onChange={imageChange}></input>
          {selectedImage && (
            <div className="img_container">
              <img src={URL.createObjectURL(selectedImage)} alt="Thumb" />
              <button onClick={removeSelectedImage}>Supprimer</button>
            </div>
          )}
          <textarea rows="5" placeholder="Ecrivez ici..." onChange={(e) => setContent(e.target.value)} />
        </form>
        <footer className="post__footer" onClick={publish}>
          <div className="post__footer__bottom post__footer__bottom--publish">
            <span>Publier</span>
          </div>
        </footer>
      </article>
    </>
  );
};

export default AddPost;
