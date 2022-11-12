import { Avatar, IconButton, Checkbox } from "@mui/material";
import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../../firebase";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { selectTheme } from "../../features/themeSlice";

function ImageMessage({
  image,
  message,
  mine,
  timestamp,
  userImage,
  chatRoomID,
  messageID,
  seen,
  setCurrentShowingDate,
  currentShowingDate,
  setShowAgain,
  showAgain,
  setShowDate,
  showDate,
  setTimestampDate,
  showAvatar,
  addCheckedMessage,
  checkable,
}) {
  const [showImage, setShowImage] = useState(false);
  const textRef = useRef(null);
  const mRef = useRef(null);
  const theme = useSelector(selectTheme);
  const [checked, setChecked] = useState(false);

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

  useEffect(() => {
    const handleScroll = (e) => {
      setTimestampDate(dayjs().unix());
      if (
        mRef?.current?.getBoundingClientRect().bottom < 60 ||
        mRef?.current?.getBoundingClientRect().top > 102
      ) {
      } else {
        if (currentShowingDate !== dayjs.unix(timestamp).format("DD/MM/YYYY")) {
          setCurrentShowingDate(dayjs.unix(timestamp).format("DD/MM/YYYY"));
          setShowDate(messageID);
        } else if (
          !showAgain &&
          !showDate &&
          currentShowingDate === dayjs.unix(timestamp).format("DD/MM/YYYY")
        ) {
          setShowAgain(messageID);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    message,
    timestamp,
    setCurrentShowingDate,
    currentShowingDate,
    showAgain,
    setShowAgain,
    messageID,
    showDate,
    setShowDate,
    setTimestampDate,
  ]);

  const checkMessage = () => {
    if (checkable) {
      setChecked(!checked);
      if (checked) {
        addCheckedMessage({ id: messageID, type: "remove" });
      } else {
        addCheckedMessage({ id: messageID, type: "add" });
      }
    }
  };

  useEffect(() => {
    if (!checkable) {
      setChecked(false);
    }
  }, [checkable]);

  return (
    <div onClick={checkMessage} className="my-1 relative">
      {checkable && (
        <div className="absolute z-20 -bottom-1 -left-1">
          <Checkbox checked={checked} />
        </div>
      )}
      {checkable && (
        <div className="absolute z-10 bottom-[9px] left-[9px] rounded-sm bg-white w-4 h-4"></div>
      )}
      {showImage && (
        <div className="fixed max-w-2xl z-[100] top-0 w-full h-screen bg-black">
          <div className="relative flex items-center justify-center h-full w-full">
            <div className="absolute z-10 right-2 top-2">
              <IconButton onClick={() => setShowImage(false)} size="small">
                <CloseIcon style={{ fontSize: 40, color: "white" }} />
              </IconButton>
            </div>
            <img src={image} alt="" className="object-contain w-full h-full" />
          </div>
        </div>
      )}
      <div
        ref={mRef}
        className={`${checked && "bg-cyan-400 opacity-80"} ${
          checkable && "pl-10"
        } flex items-end px-1 py-1 ${mine && "justify-end"}`}
      >
        {currentShowingDate &&
          !showAgain &&
          showDate === messageID &&
          currentShowingDate === dayjs.unix(timestamp).format("DD/MM/YYYY") &&
          currentShowingDate !==
            dayjs.unix(dayjs().unix()).format("DD/MM/YYYY") && (
            <div className="fixed z-40 max-w-2xl top-16 w-full flex justify-center">
              <div
                className={`${
                  theme.type === "dark" && "border"
                } bg-black opacity-80 text-white rounded-lg ${
                  !mine && checkable && "mr-20"
                } ${mine ? "ml-2" : "mr-2"}`}
              >
                <p className="px-2 py-1">{currentShowingDate}</p>
              </div>
            </div>
          )}
        {showAgain === messageID &&
          currentShowingDate !==
            dayjs.unix(dayjs().unix()).format("DD/MM/YYYY") && (
            <div className="fixed z-40 max-w-2xl top-16 w-full flex justify-center">
              <div
                className={`${
                  theme.type === "dark" && "border"
                } bg-black opacity-80 text-white rounded-lg ${
                  !mine && checkable && "mr-20"
                } ${mine ? "ml-2" : "mr-2"}`}
              >
                <p className="px-2 py-1">{currentShowingDate}</p>
              </div>
            </div>
          )}
        {!mine && (
          <Avatar
            src={showAvatar ? userImage : null}
            style={{ width: 34, height: 34 }}
          />
        )}
        <div
          onClick={() => !checkable && setShowImage(true)}
          className={`${
            mine ? "bg-gray-300 text-black mr-1" : "bg-blue-500 text-white"
          } w-max ml-1 mb-[2px] flex flex-col max-w-[70%] pb-[4px] rounded-2xl`}
        >
          <img
            className="rounded-t-xl object-cover max-h-72"
            src={image}
            alt=""
          />
          <div>
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
    </div>
  );
}

export default ImageMessage;
