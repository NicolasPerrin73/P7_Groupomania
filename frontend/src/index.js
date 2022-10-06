import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import AddPost from "./pages/AddPost/AddPost";
import Account from "./pages/Account";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/addpost" element={<AddPost />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
