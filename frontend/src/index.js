import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import AddPost from "./pages/AddPost/AddPost";
import Account from "./pages/Account/Account";
import EditPost from "./pages/Edit Post/EditPost";
import AccountPicture from "./pages/Account/AccountPicture";
import AccountName from "./pages/Account/AccountName";
import AccountPassword from "./pages/Account/AccountPassword";
import Error404 from "./pages/Error 404/Error404";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route exact path="/" element={<Home />} />
        <Route path="/addpost" element={<AddPost />} />
        <Route path="/editPost/:postId" element={<EditPost />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/picture" element={<AccountPicture />} />
        <Route path="/account/name" element={<AccountName />} />
        <Route path="/account/password" element={<AccountPassword />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
