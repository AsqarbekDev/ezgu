import {
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import React from "react";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import WestIcon from "@mui/icons-material/West";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Message from "../components/chatsScreen/Message";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ImageMessage from "../components/chatsScreen/ImageMessage";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { selectChatRooms, selectChats } from "../features/chatsSlice";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { StyledBadge } from "../components/StyledBadge";

function ChatRoom() {
  const imageRef = useRef(null);
  const bottomRef = useRef(null);
  const newMessageRef = useRef(null);
  const messageRef = useRef(null);
  const user = useSelector(selectUser);
  const chats = useSelector(selectChats);
  const chatRooms = useSelector(selectChatRooms);
  const { uid } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [isChatRoomExists, setIsChatRoomExists] = useState(false);
  const [chatRoomID, setChatRoomID] = useState(null);
  const [newMessageID, setNewMessageID] = useState(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
  };

  useEffect(() => {
    for (let i = 0; i < chats[chatRoomID]?.messages.length; i++) {
      if (
        newMessageID === null &&
        chats[chatRoomID]?.messages[i].uid !== user.uid &&
        !chats[chatRoomID]?.messages[i].seen
      ) {
        setNewMessageID(chats[chatRoomID]?.messages[i].id);
        break;
      }
    }
  }, [chatRoomID, chats, user.uid, newMessageID]);

  const addImage = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImage(readerEvent.target.result);
    };
  };

  const deleteImage = () => {
    setImage(null);
  };

  const sendMessage = () => {
    if (messageRef.current.value.replace(/\s/g, "").length > 0 || image) {
      const sendingMessage = messageRef.current.value;
      messageRef.current.value = "";
      setImage(null);
      if (isChatRoomExists) {
        bottomRef.current.scrollIntoView();
        addDoc(collection(db, "chats", chatRoomID, "messages"), {
          message: sendingMessage,
          timestamp: dayjs().unix(),
          uid: user.uid,
          image: "",
          seen: false,
        })
          .then(async (snapDoc) => {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
            if (image) {
              const storageRef = ref(
                storage,
                `chats/${chatRoomID}/${snapDoc.id}`
              );
              const uploadTask = uploadBytesResumable(
                storageRef,
                imageRef.current.files[0]
              );
              uploadTask.on(
                "state_changed",
                (snapshot) => {},
                (error) => {
                  console.log(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(
                    async (downloadURL) => {
                      await updateDoc(
                        doc(db, "chats", chatRoomID, "messages", snapDoc.id),
                        {
                          image: downloadURL,
                        }
                      );
                    }
                  );
                }
              );
            }
          })
          .catch((error) => {});
      } else {
        createChatRoom(sendingMessage);
      }
    }
  };

  const createChatRoom = (sendingMessage) => {
    addDoc(collection(db, "chats"), {
      users: [user.uid, uid],
    })
      .then((snapDoc) => {
        addDoc(collection(db, "chats", snapDoc.id, "messages"), {
          message: sendingMessage,
          timestamp: dayjs().unix(),
          uid: user.uid,
          image: "",
          seen: false,
        })
          .then(async (snapDoc) => {
            if (image) {
              const storageRef = ref(
                storage,
                `chats/${chatRoomID}/${snapDoc.id}`
              );
              const uploadTask = uploadBytesResumable(
                storageRef,
                imageRef.current.files[0]
              );
              uploadTask.on(
                "state_changed",
                (snapshot) => {},
                (error) => {
                  console.log(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(
                    async (downloadURL) => {
                      await updateDoc(
                        doc(db, "chats", chatRoomID, "messages", snapDoc.id),
                        {
                          image: downloadURL,
                        }
                      );
                    }
                  );
                }
              );
            }
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  };

  useEffect(() => {
    chatRooms.map((item) => {
      if (item.messagingUser === uid) {
        setIsChatRoomExists(true);
        setChatRoomID(item.id);
      }
      return null;
    });
  }, [chatRooms, uid]);

  useEffect(() => {
    if (newMessageID) {
      setTimeout(() => {
        newMessageRef.current.scrollIntoView();
      }, 10);
    } else {
      setTimeout(() => {
        bottomRef.current.scrollIntoView();
      }, 10);
    }
  }, [newMessageID]);

  const scrollToBottom = () => {
    if (bottomRef?.current) {
      setTimeout(() => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  };

  return (
    <div className="pb-14">
      <div className="fixed top-0 z-50 flex items-center justify-between w-full bg-white border-b shadow-sm">
        <div
          onClick={() => navigate(-1)}
          className="w-14 h-14 flex items-center justify-center"
        >
          <IconButton size="medium">
            <WestIcon style={{ color: "black" }} />
          </IconButton>
        </div>
        <div>
          {chats[chatRoomID]?.messagingUser.lastSeen > dayjs().unix() - 70 ? (
            <StyledBadge
              className="mr-2"
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt={chats[chatRoomID]?.messagingUser.username}
                src={chats[chatRoomID]?.messagingUser.image}
              />
            </StyledBadge>
          ) : (
            <Avatar
              src={chats[chatRoomID]?.messagingUser.image}
              className="mr-2"
              alt={chats[chatRoomID]?.messagingUser.username}
            />
          )}
        </div>
        <div className="flex-1 truncate">
          <p className="font-[600] text-lg -mt-[2px] truncate">
            {chats[chatRoomID]?.messagingUser.username}
          </p>
          <p className="text-xs text-gray-600 -mt-[2px]">
            {chats[chatRoomID]?.messagingUser.lastSeen < dayjs().unix() - 86400
              ? dayjs
                  .unix(chats[chatRoomID]?.messagingUser.lastSeen)
                  .format("MM/DD/YYYY")
              : chats[chatRoomID]?.messagingUser.lastSeen > dayjs().unix() - 70
              ? "online"
              : dayjs
                  .unix(chats[chatRoomID]?.messagingUser.lastSeen)
                  .format("HH:mm")}
          </p>
        </div>
        <div className="w-14 h-14 flex items-center justify-center">
          <Tooltip title="Sozlamalar">
            <IconButton
              onClick={handleClick}
              size="medium"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVertIcon style={{ color: "black" }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={() => console.log("clicked")}>
              <ListItemIcon>
                <DeleteForeverIcon fontSize="small" />
              </ListItemIcon>
              hammasini o'chirish
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div>
        {chats[chatRoomID]?.messages.map((item, index) =>
          item.image ? (
            <div key={index}>
              {item.id === newMessageID && (
                <div
                  ref={newMessageRef}
                  className="border-b-8 border-violet-700 flex justify-center mt-4 mb-7"
                >
                  <p className="bg-violet-700 w-max -mb-[20px] text-white rounded-2xl px-6 pt-1 pb-1">
                    Yangi xabarlar
                  </p>
                </div>
              )}
              <ImageMessage
                messageID={item.id}
                image={item.image}
                message={item.message}
                mine={item.uid === user.uid ? true : false}
                timestamp={item.timestamp}
                userImage={chats[chatRoomID]?.messagingUser.image}
                chatRoomID={chatRoomID}
                seen={item.seen}
              />
            </div>
          ) : (
            <div key={index}>
              {item.id === newMessageID && (
                <div
                  ref={newMessageRef}
                  className="border-b-8 border-violet-700 flex justify-center mt-4 mb-7"
                >
                  <p className="bg-violet-700 w-max -mb-[20px] text-white rounded-2xl px-6 pt-1 pb-1">
                    Yangi xabarlar
                  </p>
                </div>
              )}
              <Message
                messageID={item.id}
                message={item.message}
                mine={item.uid === user.uid ? true : false}
                timestamp={item.timestamp}
                userImage={chats[chatRoomID]?.messagingUser.image}
                chatRoomID={chatRoomID}
                seen={item.seen}
              />
            </div>
          )
        )}
      </div>
      <div className="fixed overflow-hidden bottom-2 right-2 left-2 bg-gray-300 flex items-center rounded-2xl">
        {image ? (
          <button onClick={deleteImage} className="relative h-12 w-[70px] pr-1">
            <img className="object-cover h-12 w-[70px]" src={image} alt="" />
            <CloseIcon
              style={{ fontSize: 16, color: "white" }}
              className="absolute z-10 right-1 top-0"
            />
          </button>
        ) : (
          <button
            onClick={() => imageRef.current.click()}
            className="px-3 h-12 outline-none"
          >
            <InsertPhotoIcon style={{ fontSize: 28 }} />
          </button>
        )}
        <TextField
          inputRef={messageRef}
          multiline
          maxRows={4}
          variant="standard"
          className="w-full"
          autoFocus
          onFocus={scrollToBottom}
        />
        <button onClick={sendMessage} className="px-3 h-12 outline-none">
          <SendIcon style={{ fontSize: 26 }} />
        </button>
        <input
          type="file"
          ref={imageRef}
          hidden
          onChange={addImage}
          accept="image/*"
        />
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatRoom;
