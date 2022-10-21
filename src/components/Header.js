import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

function Header() {
  const location = useLocation();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [currentScreen, setCurrentScreen] = useState("/");

  useEffect(() => {
    setCurrentScreen(location.pathname);
  }, [location]);

  return (
    <div
      className={`${
        currentScreen === "/" ||
        currentScreen === "/homes" ||
        currentScreen === "/add" ||
        currentScreen === "/loading/add" ||
        currentScreen === "/chats" ||
        currentScreen === "/loading/chats" ||
        currentScreen === "/profile" ||
        currentScreen === "/loading/profile"
          ? ""
          : "hidden"
      } sticky top-0 z-50 w-full flex items-center justify-center bg-white border-b shadow-sm h-14`}
    >
      <div className="relative w-full flex items-center justify-center">
        <h1 className="font-bold text-3xl">EZGU</h1>
        <div
          onClick={() => navigate("/notifications")}
          className={`${
            !user && "hidden"
          } absolute right-4 top-0 p-1 cursor-pointer rounded-md overflow-hidden`}
        >
          <div className="relative">
            <CircleNotificationsIcon style={{ fontSize: 30 }} />
            <div className="absolute -right-1 -top-1 bg-red-500 rounded-full px-[5px]">
              <p className="text-white text-xs">2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
