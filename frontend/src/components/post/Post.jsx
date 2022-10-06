import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Post = ({ post_id, content, img_url, liked, created_date, nom, prenom, picture_url }) => {
  const [postComment, setpostComment] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3000/api/post/${post_id}/comment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setpostComment(res.data))
      .catch((err) => console.log(err));
  }, [post_id]);

  return (
    <article className="post">
      <header className="post__header">
        <div>
          {picture_url === null ? "" : <img src={picture_url} alt="post"></img>}
          <span>
            {nom} {prenom}
          </span>
        </div>
        <time>{created_date.split("T")[0]}</time>
      </header>
      <div className="post__content">
        {img_url === null ? "" : <img src={img_url} alt="post"></img>}
        <p>{content}</p>
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
        <div className="post__footer__bottom">
          <span>
            <i className="fa-solid fa-thumbs-up"></i>
          </span>
        </div>
      </footer>
    </article>
  );
};

export default Post;
