import React from "react";
import Navbar from "../components/common/Navbar";
import Hero from "../components/landingComponents/Hero";
import Features from "../components/landingComponents/Features";

const Landing = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
};

export default Landing;
