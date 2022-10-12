import { useState, useEffect } from "react";
import axios from "axios";

/**
 *Custom hook to get user data from API
 * @export
 *@return {*} { userData, profilHaveImage, setProfilHaveImage }
 */
export function useUserdata() {
  //States
  const [userData, setUserData] = useState([]);
  const [profilHaveImage, setProfilHaveImage] = useState(false);

  /**
   *Get user data
   *add data to userData state
   *change profileHaveImage state if image found

   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3001/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserData(res.data[0]);
        if (res.data[0].picture_url !== null) {
          setProfilHaveImage(true);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return { userData, profilHaveImage, setProfilHaveImage };
}

/**
 *Format current date for FR
 * @export
 * @return {*} { date }
 */
export function useDate() {
  let today = new Date();
  let date = "le " + today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
  return { date };
}

/**
 *Format current date for database
 * @export
 * @return {*} { sqlDate }
 */
export function useSqlDate() {
  let today = new Date();
  let sqlDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
  return { sqlDate };
}

/**
 *Format created_date returned by database in date with time for FR
 * @export
 * @param {*} created_date
 * @return {*} { formatDate }
 */
export function useCreatedDate(created_date) {
  const date = new Date(created_date);
  let hours;
  let minutes;

  /**
   *Format time with 2 digit
   */
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
