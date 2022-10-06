import { useState, useContext, useEffect } from "react";
import axios from "axios";

export function useUserdata() {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/auth/user", {
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
