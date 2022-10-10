import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCreatedDate } from "../../utils/hook";
import DeleteConfirm from "../Delete_Confirm/DeleteConfirm";

const Post = ({ deletedPost, setDeletedPost, post_id, content, img_url, liked, created_date, user_id, nom, prenom, picture_url, current_user_id }) => {
  const [delecteClick, setdeleteClick] = useState(false);
  const [postComment, setpostComment] = useState([]);
  const [IsConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3001/api/post/${post_id}/comment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setpostComment(res.data))
      .catch((err) => console.log(err));
  }, [post_id]);

  const deletePost = () => {
    setdeleteClick(true);
  };

  useEffect(() => {
    if (IsConfirmed === true) {
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:3001/api/post/${post_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setDeletedPost(true);
          setIsConfirmed(false);
        })
        .catch((err) => console.log(err));
    }
  }, [IsConfirmed, post_id, setDeletedPost]);

  const { formatDate } = useCreatedDate(created_date);

  return (
    <article className="post">
      <header className="post__header">
        <div>
          {picture_url === null ? "" : <img src={picture_url} alt="post"></img>}
          <span>
            {nom} {prenom}
          </span>
        </div>
        <time>{formatDate}</time>
      </header>
      <div className="post__content">
        {delecteClick === true ? <DeleteConfirm IsConfirmed={IsConfirmed} setIsConfirmed={setIsConfirmed} setdeleteClick={setdeleteClick} /> : ""}
        {img_url === null ? "" : <img src={img_url} alt="post"></img>}
        {content === "" ? "" : <p>{content}</p>}
      </div>
      <footer className="post__footer">
        <div className="post__footer__top">
          <span>
            <i className="fa-solid fa-comment-dots"></i>
            {postComment.length} {postComment.length > 1 ? "commentaires" : "commentaire"}
          </span>
          <span>
            {liked} J'aime<i className="fa-solid fa-heart"></i>
          </span>
        </div>
        <div className={user_id === current_user_id ? "post__footer__bottom " : "post__footer__bottom post__footer__bottom--simple"}>
          {user_id === current_user_id ? (
            <div>
              <i className="fa-solid fa-trash" onClick={deletePost}></i>
              <Link to={`/editPost/${post_id}`}>
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            </div>
          ) : (
            ""
          )}
          <span>
            <i className="fa-solid fa-thumbs-up"></i>
          </span>
        </div>
      </footer>
    </article>
  );
};

export default Post;
