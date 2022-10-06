import React from "react";
import Header from "../components/header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/post/Post";
import { useUserdata } from "../utils/hook";

const Home = () => {
  const [postsData, setPostsData] = useState([]);

  const { userData } = useUserdata();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setPostsData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Header userData={userData} />
      <ul>
        {postsData.map(({ post_id, content, img_url, liked, created_date, nom, prenom, picture_url }) => (
          <div key={post_id}>
            <Post post_id={post_id} content={content} img_url={img_url} liked={liked} created_date={created_date} nom={nom} prenom={prenom} picture_url={picture_url} />
          </div>
        ))}
      </ul>
    </>
  );
};

export default Home;
