import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectTheme } from "../../features/themeSlice";

function AddNewWidget({ logo, text, path }) {
  const theme = useSelector(selectTheme);

  return (
    <Link
      to={path}
      style={{ backgroundColor: theme.background, color: theme.textColor }}
      className="flex items-center m-1 p-2 rounded-lg shadow-md"
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
