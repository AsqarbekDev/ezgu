import React from "react";
import { Link } from "react-router-dom";

function AddNewWidget({ logo, text, path }) {
  return (
    <Link
      to={path}
      className="flex items-center m-1 p-2 rounded-lg bg-white shadow-md"
    >
      <img
        className="h-20 w-20 object-cover rounded-xl"
        src={logo}
        alt="Icon"
      />
      <div className="ml-2">
        <h2 className="font-bold text-lg tracking-tighter">{text}</h2>
        <p className="text-sm font-[600]">e'lon berish mutlaqo bepul</p>
      </div>
    </Link>
  );
}

export default AddNewWidget;
