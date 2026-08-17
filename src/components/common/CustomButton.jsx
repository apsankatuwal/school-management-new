import React from "react";
import { useNavigate } from "react-router-dom";

const CustomButton = ({ text, link, className }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(link)}
      className={`text-white hover:text-gray-200 bg-emerald-950 py-1 px-3 text-sm rounded-md font-semibold
      cursor-pointer`}
    >
      {text}
    </button>
  );
};

export default CustomButton;