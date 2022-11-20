import {
  Avatar,
  Checkbox,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { db } from "../../firebase";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../../features/themeSlice";
import { useState } from "react";
import { setEditingChat } from "../../features/chatsSlice";
import { selectLanguage } from "../../features/languageSlice";

function Message({
  message,
  mine,
  seen,
  edited,
  timestamp,
  userImage,
  chatRoomID,
  messageID,
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
  editing,
  setShowModul,
  setDeletingMessageID,
}) {
  const mRef = useRef(null);
  const modulRef = useRef(null);
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const filterMessage = (messageString) => {
  //   const filteredString = [];
  //   let string = messageString;
  //   const limitNumber = Math.round(window.innerWidth / 19);

  //   while (string !== "") {
  //     if (string.indexOf(" ") > limitNumber) {
  //       filteredString.push(string.slice(0, limitNumber));
  //       string = string.slice(limitNumber, string.length);
  //     } else if (string.length > limitNumber && string.indexOf(" ") === -1) {
  //       filteredString.push(string.slice(0, limitNumber));
  //       string = string.slice(limitNumber, string.length);
  //     } else if (string.indexOf(" ") === -1) {
  //       filteredString.push(string.slice(0, string.length));
  //       string = "";
  //     } else {
  //       filteredString.push(string.slice(0, string.indexOf(" ")));
  //       string = string.slice(string.indexOf(" ") + 1, string.length);
  //     }
  //   }
  //   const newString = filteredString.join(" ");

  //   return newString;
  // };

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
          onClick={() => modulRef.current.click()}
          className={`${
            mine ? "bg-gray-300 text-black mr-1" : "bg-blue-500 text-white"
          } w-max ml-1 mb-[2px] flex flex-col max-w-[70%] px-3 pt-1 pb-[4px] rounded-2xl`}
        >
          <p
            style={{
              whiteSpace: "pre-line",
              wordWrap: "break-word",
            }}
            className="text-lg"
          >
            {message}
          </p>
          <div className="flex items-center justify-end">
            <p
              className={`${
                mine ? "text-gray-600" : "text-gray-300"
              } text-xs text-right font-[600]`}
            >
              {edited && language.chats.editedText}{" "}
              {dayjs.unix(timestamp).format("HH:mm")}{" "}
              {seen && mine ? (
                <DoneAllIcon style={{ fontSize: 14, marginTop: -3 }} />
              ) : mine ? (
                <DoneIcon style={{ fontSize: 14, marginTop: -3 }} />
              ) : null}
            </p>
            <div className="-mt-2 -mb-[5px] -mr-2">
              <IconButton
                ref={modulRef}
                onClick={!editing ? handleClick : undefined}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <MoreVertIcon
                  style={{ fontSize: 12, color: mine ? "#4B5563" : "#d1d5db" }}
                />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {mine && (
                  <MenuItem
                    onClick={() =>
                      dispatch(
                        setEditingChat({
                          message,
                          messageID,
                          isImage: false,
                        })
                      )
                    }
                  >
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    {language.chats.editText}
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    setShowModul("deleteOne");
                    setDeletingMessageID(messageID);
                  }}
                >
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                  </ListItemIcon>
                  {language.chats.deleteText}
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
