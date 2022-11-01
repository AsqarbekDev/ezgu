import { Avatar } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectTheme } from "../../features/themeSlice";

function BannedUserCard({ uid, username }) {
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.textColor,
        borderColor: theme.borderBlack,
      }}
      onClick={() => navigate(`/chats/${uid}`)}
      className="bg-white border-b m-1 flex justify-between p-2 rounded-lg cursor-pointer"
    >
      <div className="flex items-center truncate">
        <Avatar style={{ width: 50, height: 50 }} />
        <p className="font-bold text-xl ml-2 truncate flex-1">{username}</p>
      </div>
    </div>
  );
}

export default BannedUserCard;
