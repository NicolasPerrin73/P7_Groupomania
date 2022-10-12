import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCreatedDate } from "../../utils/hook";
import DeleteConfirm from "../Delete_Confirm/DeleteConfirm";

/**
 *Component Post display one post
 *
 * @param {*} { deletedPost, setDeletedPost, post_id, content, img_url, created_date, user_id, nom, prenom, picture_url, current_user_id, current_user_is_admin }
 * @return {*}
 */
const Post = ({ deletedPost, setDeletedPost, post_id, content, img_url, created_date, user_id, nom, prenom, picture_url, current_user_id, current_user_is_admin }) => {
  const [delecteClick, setdeleteClick] = useState(false);
  const [postComment, setpostComment] = useState([]);
  const [IsConfirmed, setIsConfirmed] = useState(false);
  const [likeValue, setLikeValue] = useState();
  const [likeCount, setLikeCount] = useState();
  const [likeClick, setLikeClick] = useState(false);

  /**
   * Get comments for this post in state postComment
   */
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

  /**
   *Catch OnClick in state for post deleting confirmation
   */
  const deletePost = () => {
    setdeleteClick(true);
  };

  /**
   * Delete the current post
   * Watch Isconfirm state
   */
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

  //Custom Hook
  const { formatDate } = useCreatedDate(created_date);

  /**
   *Capture OnClick in state and change LikeValue state
   *1 for liked, 0 for unlike
   * @param {*} e
   */
  const like = (e) => {
    if (likeValue === 1) {
      setLikeValue(0);
      setLikeClick(true);
    } else if (likeValue === 0) {
      setLikeValue(1);
      setLikeClick(true);
    }
  };

  /**
   * Like post only when OnClik is capture on state
   * Send the LikeValue to backend
   * Watch likeValue and likeClick state
   */
  useEffect(() => {
    if (likeClick === true) {
      const token = localStorage.getItem("token");
      axios
        .post(
          `http://localhost:3001/api/post/${post_id}/like`,
          { like: likeValue },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      setLikeClick(false);
    } else {
      // Do nothing
    }
  }, [likeValue, post_id, likeClick]);

  /**
   * Get the like count for this post
   * Watch likeValue and likeClick state
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3001/api/post/${post_id}/like`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setLikeCount(res.data.liked))
      .catch((err) => console.log(err));
  }, [likeValue, post_id, likeClick]);

  /**
   * Get if current user already liked this post or not
   * Set likeValue to 0 if not
   * Set likeValue to 1 if yes
   * Watch likeValue state
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3001/api/post/${post_id}/like/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.length === 0) {
          setLikeValue(0);
        } else if (res.data.length !== 0) {
          setLikeValue(1);
        }
      })
      .catch((err) => console.log(err));
  }, [likeValue, post_id]);

  return (
    <article>
      <header className="post__header">
        <div>
          <div className="post__header__picture">{picture_url === null ? <i className="fa-solid fa-circle-user"></i> : <img src={picture_url} alt="post"></img>}</div>

          <span>
            {nom} <br /> {prenom}
          </span>
        </div>

        <time>{formatDate}</time>
      </header>

      <div className="post__content">
        {delecteClick === true ? <DeleteConfirm IsConfirmed={IsConfirmed} setIsConfirmed={setIsConfirmed} setdeleteClick={setdeleteClick} deleteText={"ce post"} /> : ""}

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
            {likeCount} J'aime<i className="fa-solid fa-heart"></i>
          </span>
        </div>

        <div className={user_id === current_user_id || current_user_is_admin === 1 ? "post__footer__bottom " : "post__footer__bottom post__footer__bottom--simple"}>
          {user_id === current_user_id || current_user_is_admin === 1 ? (
            <div>
              <i className="fa-solid fa-trash" onClick={deletePost}></i>
              <Link to={`/editPost/${post_id}`}>
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            </div>
          ) : (
            ""
          )}

          <span onClick={(e) => like(e)} className={likeValue === 1 ? "post__footer__bottom--liked" : ""}>
            <i className="fa-solid fa-thumbs-up"></i>
          </span>
        </div>
      </footer>
    </article>
  );
};

export default Post;
