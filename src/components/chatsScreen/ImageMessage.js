import { Avatar } from "@mui/material";
import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../../firebase";
import DefaultLoadingModul from "../DefaultLoadingModul";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

function ImageMessage({
  image,
  message,
  mine,
  timestamp,
  userImage,
  chatRoomID,
  messageID,
  seen,
}) {
  const [loaded, setLoaded] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const textRef = useRef(null);

  const filterMessage = (messageString) => {
    const filteredString = [];
    let string = messageString;
    const limitNumber = Math.round(window.innerWidth / 19);

    while (string !== "") {
      if (string.indexOf(" ") > limitNumber) {
        filteredString.push(string.slice(0, limitNumber));
        string = string.slice(limitNumber, string.length);
      } else if (string.length > limitNumber && string.indexOf(" ") === -1) {
        filteredString.push(string.slice(0, limitNumber));
        string = string.slice(limitNumber, string.length);
      } else if (string.indexOf(" ") === -1) {
        filteredString.push(string.slice(0, string.length));
        string = "";
      } else {
        filteredString.push(string.slice(0, string.indexOf(" ")));
        string = string.slice(string.indexOf(" ") + 1, string.length);
      }
    }
    const newString = filteredString.join(" ");

    return newString;
  };

  useEffect(() => {
    const updateSeen = () => {
      setTimeout(async () => {
        await updateDoc(doc(db, "chats", chatRoomID, "messages", messageID), {
          seen: true,
        });
      }, 1000);
    };
    if (!seen && !mine) {
      updateSeen();
    }
  }, [chatRoomID, messageID, seen, mine]);

  return (
    <>
      {showImage && (
        <div className="fixed z-[100] top-0 w-full h-screen bg-black">
          <div className="relative flex items-center justify-center h-full w-full">
            <CloseIcon
              onClick={() => setShowImage(false)}
              style={{ fontSize: 40, color: "white" }}
              className="absolute z-10 right-2 top-2 cursor-pointer"
            />
            <img src={image} alt="" className="object-contain w-full h-full" />
          </div>
        </div>
      )}
      <div className={`flex items-end mx-1 my-2 ${mine && "justify-end"}`}>
        {!mine && <Avatar src={userImage} style={{ width: 34, height: 34 }} />}
        <div
          onClick={() => setShowImage(true)}
          className={`${
            mine ? "bg-gray-300 text-black mr-1" : "bg-blue-500 text-white"
          } w-max ml-1 mb-[2px] flex flex-col max-w-[70%] pb-[4px] rounded-2xl cursor-pointer`}
        >
          <img
            onLoad={() => setLoaded(true)}
            className="rounded-t-xl object-cover max-h-72"
            src={image}
            alt=""
          />
          <div>
            {!loaded && (
              <div
                className={`rounded-t-xl h-72 ${
                  !message && "w-72"
                } pt-16 bg-gray-300 flex items-center justify-center`}
              >
                <DefaultLoadingModul />
              </div>
            )}
            <p ref={textRef} className="px-2 overflow-hidden text-lg">
              {filterMessage(message)}
            </p>
          </div>
          <span
            className={`${
              mine ? "text-gray-600" : "text-gray-300"
            } text-xs text-right mr-3 font-[600]`}
          >
            {dayjs.unix(timestamp).format("HH:mm")}
            {seen && mine ? (
              <DoneAllIcon
                style={{ fontSize: 14, marginTop: -3, marginLeft: 4 }}
              />
            ) : mine ? (
              <DoneIcon
                style={{ fontSize: 14, marginTop: -3, marginLeft: 4 }}
              />
            ) : null}
          </span>
        </div>
      </div>
    </>
  );
}

export default ImageMessage;
