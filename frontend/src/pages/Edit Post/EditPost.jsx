import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useUserdata } from "../../utils/hook";
import { useDate, useSqlDate } from "../../utils/hook";

const EditPost = () => {
  const { userData } = useUserdata();
  const { postId } = useParams();
  const [postData, setPostData] = useState([]);
  const [content, setContent] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [postHaveImage, setPostHaveImage] = useState(false);
  const { date } = useDate();
  const { sqlDate } = useSqlDate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3001/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPostData(res.data[0]);
        setContent(res.data[0].content);
        if (res.data[0].img_url !== null) {
          setPostHaveImage(true);
        }
      })
      .catch((error) => console.log(error));
  }, [postId]);

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    URL.revokeObjectURL(selectedImage);
    setSelectedImage();
  };

  const deletePostedImage = () => {
    setPostHaveImage(false);
  };

  const publish = () => {
    const token = localStorage.getItem("token");
    let formData = new FormData();

    formData.append("content", content);
    formData.append("created_date", sqlDate);
    formData.append("image", selectedImage);
    formData.append("postImage", postHaveImage);
    axios
      .put(`http://localhost:3001/api/post/${postId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
            <div className="post__header__picture">{postData.picture_url === null ? "" : <img src={postData.picture_url} alt="post"></img>}</div>
            <span>
              {postData.nom} <br /> {postData.prenom}
            </span>
          </div>
          <time>modifié {date}</time>
        </header>

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
          ) : postHaveImage ? (
            <div className="img_container">
              <img src={postData.img_url} alt="post"></img>
              <button onClick={(e) => deletePostedImage()}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ) : (
            ""
          )}

          <textarea rows="5" defaultValue={postData.content} onChange={(e) => setContent(e.target.value)} />
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

export default EditPost;
