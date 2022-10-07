import { useState, useEffect } from "react";
import axios from "axios";

export function useUserdata() {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3001/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUserData(res.data[0]))
      .catch((err) => console.log(err));
  }, []);
  return { userData };
}

export function useDate() {
  let today = new Date();
  let date = "le " + today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
  return { date };
}

export function useSqlDate() {
  let today = new Date();
  let sqlDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
  return { sqlDate };
}

export function useCreatedDate(created_date) {
  const date = new Date(created_date);
  let hours;
  let minutes;
  const formatTime = () => {
    if (date.getHours() < 10) {
      hours = "0" + date.getHours();
    } else {
      hours = date.getHours();
    }
    if (date.getMinutes() < 10) {
      minutes = "0" + date.getMinutes();
    } else {
      minutes = date.getMinutes();
    }
  };
  formatTime();
  const formatDate = "le " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " à " + hours + ":" + minutes;
  return { formatDate };
}

/*export function publishPost(content, sqlDate, selectedImage) {
  const token = localStorage.getItem("token");
  let formData = new FormData();

  formData.append("content", content);
  formData.append("created_date", sqlDate);
  formData.append("image", selectedImage);
  axios
    .post("http://localhost:3001/api/post", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "mutipart/form-data",
      },
    })
    .then((res) => console.log(res.data))
    .then((window.location.href = "/"))
    .catch((err) => console.log(err));
}*/
