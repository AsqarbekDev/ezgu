import { Avatar, IconButton } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

function UserCard({ image, username, uid }) {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  return (
    <div className="flex items-center justify-between">
      <Avatar src={image} alt="Avatar" style={{ height: 36, width: 36 }} />
      <p className="ml-2 -mt-1 flex-1 font-bold truncate">{username}</p>
      {user?.uid !== uid && (
        <IconButton
          onClick={() => navigate(user ? `/chats/${uid}` : "/signUp")}
          size="small"
        >
          <SendIcon
            style={{ fontSize: 22, color: "black" }}
            className="-rotate-45"
          />
        </IconButton>
      )}
    </div>
  );
}

export default UserCard;
