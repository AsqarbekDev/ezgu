import React from "react";
import WestIcon from "@mui/icons-material/West";
import { useNavigate } from "react-router-dom";

function ExitHeader({ screenName, path }) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="relative h-14 flex items-center justify-center">
        <h1 className="font-bold text-xl">{screenName}</h1>
        <div
          onClick={() => (path ? navigate(path) : navigate(-1))}
          className="absolute left-0 z-10 cursor-pointer w-12 h-14 flex items-center justify-center"
        >
          <WestIcon />
        </div>
      </div>
    </div>
  );
}

export default ExitHeader;
