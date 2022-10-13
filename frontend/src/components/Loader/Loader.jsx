import React from "react";
import logo from "../../assets/icon.png";

const Loader = () => {
  return (
    <section className="loader_container">
      <div className="loader loader__1"></div>
      <div className="loader loader__2"></div>
      <div className="loader loader__3"></div>
      <img src={logo} alt="icone logo" />
    </section>
  );
};

export default Loader;
