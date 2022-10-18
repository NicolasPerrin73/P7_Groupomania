import React from "react";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Post/Post";
import { useUserdata } from "../utils/hook";
import Loader from "../components/Loader/Loader";

/**
 * Component to display all posts
 * @return {*}
 */
const Home = () => {
  // Redirection if no token in localStorage
  if (localStorage.length === 0) {
    window.location.href = "/login";
  }

  //Component states
  const [postsData, setPostsData] = useState([]);
  const [deletedPost, setDeletedPost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postAppear, setPostAppear] = useState(false);

  // Custom hook
  const { userData } = useUserdata();

  /**
   * Get all posts to postsData state
   * Watch deletedPost state
   */
  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3001/api/post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPostsData(res.data);
        setDeletedPost(false);
        setTimeout(() => setIsLoading(false), 750);
      })
      .catch((err) => console.log(err));
  }, [deletedPost]);

  /**
   *Animation for posts
   */
  useEffect(() => {
    setTimeout(() => {
      setPostAppear(true);
    }, 800);
  }, []);

  return (
    <>
      <Header userData={userData} postAppear={postAppear} setPostAppear={setPostAppear} />

      <main>
        <h1>Fil d'actualité</h1>
        <ul>
          {isLoading ? (
            <Loader />
          ) : (
            postsData.map(({ post_id, content, img_url, created_date, user_id, nom, prenom, picture_url }) => (
              <li key={post_id} className={postAppear ? "post post--appear" : "post"}>
                <Post
                  post_id={post_id}
                  content={content}
                  img_url={img_url}
                  created_date={created_date}
                  user_id={user_id}
                  nom={nom}
                  prenom={prenom}
                  picture_url={picture_url}
                  current_user_id={userData.id}
                  current_user_is_admin={userData.is_admin}
                  deletedPost={deletedPost}
                  setDeletedPost={setDeletedPost}
                />
              </li>
            ))
          )}
        </ul>
      </main>

      <div className="left-decoration"></div>
    </>
  );
};

export default Home;
