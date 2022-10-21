import { Avatar } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
// import DomainAddIcon from "@mui/icons-material/DomainAdd";

function NotifyCard() {
  return (
    <div className="bg-white m-1 p-3 rounded-lg shadow-lg">
      <div className="flex items-center">
        <Avatar
          alt="Avatar"
          src="https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iVbOXV6zJC3A/v0/1200x-1.jpg"
        />
        <h5 className="font-bold text-xl truncate flex-1 ml-2">
          Justin bieber
        </h5>
        <div className="relative">
          <button className="absolute z-20 -top-[3px] right-[10.2px] rounded-sm overflow-hidden w-8 h-8"></button>
          <SendIcon className="-rotate-45 -mt-2 mx-3" />
        </div>
        <button className="w-8 h-8 rounded-sm overflow-hidden -mb-[1px]">
          <WorkHistoryIcon style={{ fontSize: 28 }} />
        </button>
        {/* <button className="w-8 h-8 rounded-sm overflow-hidden -mb-[1px]">
          <DomainAddIcon style={{ fontSize: 28 }} />
        </button> */}
      </div>
      <div className="h-[0.1px] w-full bg-red-700 mt-2 mb-1"></div>
      <div>
        <h2 className="font-bold">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque,
          pariatur!
        </h2>
        <p className="text-sm text-red-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
          reiciendis ipsa nisi magnam consectetur ipsum blanditiis, recusandae
          temporibus magni ratione?
        </p>
      </div>
      <div className="h-[0.1px] w-full bg-red-700 mt-[6px]"></div>
    </div>
  );
}

export default NotifyCard;
