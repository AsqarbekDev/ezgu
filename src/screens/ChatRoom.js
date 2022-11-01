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
import BlockIcon from "@mui/icons-material/Block";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ImageMessage from "../components/chatsScreen/ImageMessage";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  deleteChat,
  selectChatRooms,
  selectChats,
} from "../features/chatsSlice";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { StyledBadge } from "../components/StyledBadge";
import { selectTheme } from "../features/themeSlice";
import ActionModul from "../components/ActionModul";

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
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [isChatRoomExists, setIsChatRoomExists] = useState(false);
  const [chatRoomID, setChatRoomID] = useState(null);
  const [newMessageID, setNewMessageID] = useState(null);
  const [messagingUserChat, setMessagingUserChat] = useState(null);
  const [waitingUser, setWaitingUser] = useState(true);
  const [showModul, setShowModul] = useState("");
  const [currentShowingDate, setCurrentShowingDate] = useState(null);
  const [showAgain, setShowAgain] = useState(null);
  const [showDate, setShowDate] = useState(null);
  const [timestampDate, setTimestampDate] = useState(null);
  const [dateShowingMessages, setDateShowingMessages] = useState([]);

  const disabledFirst =
    messagingUserChat && messagingUserChat?.blockedUsers?.includes(user.uid)
      ? true
      : messagingUserChat && user?.blockedUsers?.includes(messagingUserChat?.id)
      ? true
      : false;

  const disabledSecond =
    chats[chatRoomID] &&
    chats[chatRoomID]?.messagingUser?.blockedUsers?.includes(user.uid)
      ? true
      : chats[chatRoomID] &&
        user.blockedUsers?.includes(chats[chatRoomID]?.messagingUser?.uid)
      ? true
      : false;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
  };

  const blockUser = async () => {
    setShowModul("");
    const blockingUser = messagingUserChat
      ? messagingUserChat.id
      : chats[chatRoomID]?.messagingUser.uid;

    await updateDoc(doc(db, "users", user.uid), {
      blockedUsers: arrayUnion(blockingUser),
    });
  };

  const unBlockUser = async () => {
    setShowModul("");
    const unBlockingUser = messagingUserChat
      ? messagingUserChat.id
      : chats[chatRoomID]?.messagingUser.uid;

    await updateDoc(doc(db, "users", user.uid), {
      blockedUsers: arrayRemove(unBlockingUser),
    });
  };

  const deleteMessages = async () => {
    setShowModul("");

    await updateDoc(doc(db, "chats", chatRoomID), {
      deleted: true,
    });

    dispatch(deleteChat(chatRoomID));
  };

  useEffect(() => {
    if (chats[chatRoomID]?.deleted) {
      navigate("/chats");
    }
  }, [chatRoomID, chats, navigate]);

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

  useEffect(() => {
    const Dates = [];
    const MessageIDs = [];

    chats[chatRoomID]?.messages.map((item) => {
      if (!Dates.includes(dayjs.unix(item.timestamp).format("DD/MM/YYYY"))) {
        Dates.push(dayjs.unix(item.timestamp).format("DD/MM/YYYY"));
        MessageIDs.push(item.id);
      }
      return null;
    });

    setDateShowingMessages(MessageIDs);
  }, [chatRoomID, chats]);

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
    messageRef.current.focus();
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
      deleted: false,
    })
      .then((docSnap) => {
        addDoc(collection(db, "chats", docSnap.id, "messages"), {
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
                `chats/${docSnap.id}/${snapDoc.id}`
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
                        doc(db, "chats", docSnap.id, "messages", snapDoc.id),
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
    let chatRoomExists = false;
    if (chatRooms) {
      chatRooms.map((item) => {
        if (item.messagingUser === uid) {
          setMessagingUserChat(null);
          setIsChatRoomExists(true);
          chatRoomExists = true;
          setChatRoomID(item.id);
          setWaitingUser(false);
        }
        return null;
      });
    }
    if (!chatRoomExists) {
      setWaitingUser(false);
    }
  }, [chatRooms, uid]);

  useEffect(() => {
    const getUser = async () => {
      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        setMessagingUserChat({
          id: docSnap.id,
          ...docSnap.data(),
        });
      }
    };

    if (!isChatRoomExists && !waitingUser) {
      getUser();
    }
  }, [isChatRoomExists, uid, waitingUser]);

  useEffect(() => {
    if (newMessageID) {
      setTimeout(() => {
        if (newMessageRef?.current) {
          newMessageRef.current.scrollIntoView();
        }
      }, 400);
    } else {
      setTimeout(() => {
        if (bottomRef?.current) {
          bottomRef.current.scrollIntoView();
        }
      }, 10);
    }
  }, [newMessageID]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (bottomRef?.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timestampDate < dayjs().unix() - 1) {
        if (showDate) {
          setShowDate(null);
        }
        if (showAgain) {
          setShowAgain(null);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [showAgain, showDate, timestampDate]);

  return (
    <div className="pb-14 pt-16">
      {showModul && (
        <ActionModul
          text={
            showModul === "deleteAll"
              ? "Xabarlarni o'chirishni xoxlaysizmi?"
              : showModul === "block"
              ? "Foydalanuvchini bloklashni xoxlaysizmi?"
              : showModul === "unBlock"
              ? "Foydalanuvchini blokdan chiqarishni xoxlaysizmi?"
              : null
          }
          cancelFunction={() => setShowModul("")}
          confirmFunction={
            showModul === "deleteAll"
              ? deleteMessages
              : showModul === "block"
              ? blockUser
              : showModul === "unBlock"
              ? unBlockUser
              : null
          }
        />
      )}
      <div
        style={{
          backgroundColor: theme.background,
          color: theme.textColor,
          borderColor: theme.borderBlack,
        }}
        className="fixed max-w-2xl top-0 z-50 flex items-center justify-between w-full border-b shadow-sm"
      >
        <div
          onClick={() => navigate(-1)}
          className="w-14 h-14 flex items-center justify-center"
        >
          <IconButton size="medium">
            <WestIcon style={{ color: theme.textColor }} />
          </IconButton>
        </div>
        <div>
          {messagingUserChat ? (
            messagingUserChat.lastSeen > dayjs().unix() - 70 &&
            !messagingUserChat.blockedUsers.includes(user.uid) &&
            !user.blockedUsers.includes(messagingUserChat.id) ? (
              <StyledBadge
                className="mr-2"
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt={messagingUserChat.username}
                  src={messagingUserChat.image}
                />
              </StyledBadge>
            ) : (
              <Avatar
                src={
                  !messagingUserChat.blockedUsers.includes(user.uid) &&
                  !user.blockedUsers.includes(messagingUserChat.id)
                    ? messagingUserChat.image
                    : null
                }
                className="mr-2"
                alt={messagingUserChat.username}
              />
            )
          ) : chats[chatRoomID]?.messagingUser.lastSeen > dayjs().unix() - 70 &&
            !chats[chatRoomID]?.messagingUser.blockedUsers.includes(user.uid) &&
            !user.blockedUsers.includes(
              chats[chatRoomID]?.messagingUser.uid
            ) ? (
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
              src={
                !chats[chatRoomID]?.messagingUser?.blockedUsers?.includes(
                  user.uid
                ) &&
                !user.blockedUsers?.includes(
                  chats[chatRoomID]?.messagingUser.uid
                )
                  ? chats[chatRoomID]?.messagingUser.image
                  : null
              }
              className="mr-2"
              alt={chats[chatRoomID]?.messagingUser.username}
            />
          )}
        </div>
        <div className="flex-1 truncate">
          {messagingUserChat ? (
            <p className="font-[600] text-lg -mt-[2px] truncate">
              {messagingUserChat.username}
            </p>
          ) : (
            <p className="font-[600] text-lg -mt-[2px] truncate">
              {chats[chatRoomID]?.messagingUser.username}
            </p>
          )}
          {messagingUserChat ? (
            <p
              style={{ color: theme.chatTimeColor }}
              className="text-xs -mt-[2px]"
            >
              {user?.blockedUsers?.includes(messagingUserChat.id)
                ? "bloklangan!"
                : messagingUserChat?.blockedUsers?.includes(user.uid)
                ? "Foydalanuvchi sizni bloklagan!"
                : dayjs
                    .unix(messagingUserChat?.lastSeen)
                    .format("DD/MM/YYYY") !==
                  dayjs.unix(dayjs().unix()).format("DD/MM/YYYY")
                ? dayjs.unix(messagingUserChat?.lastSeen).format("DD/MM/YYYY")
                : messagingUserChat?.lastSeen > dayjs().unix() - 70
                ? "online"
                : dayjs.unix(messagingUserChat?.lastSeen).format("HH:mm")}
              {dayjs.unix(messagingUserChat?.lastSeen).format("DD/MM/YYYY") !==
                dayjs.unix(dayjs().unix()).format("DD/MM/YYYY") &&
                !user.blockedUsers.includes(messagingUserChat?.id) &&
                !messagingUserChat?.blockedUsers?.includes(user.uid)(
                  <span className="ml-2">
                    {dayjs.unix(messagingUserChat?.lastSeen).format("HH:mm")}
                  </span>
                )}
            </p>
          ) : (
            <p
              style={{
                color: theme.chatTimeColor,
              }}
              className="text-xs -mt-[2px]"
            >
              {user.blockedUsers?.includes(
                chats[chatRoomID]?.messagingUser?.uid
              )
                ? "bloklangan!"
                : chats[chatRoomID]?.messagingUser?.blockedUsers?.includes(
                    user.uid
                  )
                ? "Foydalanuvchi sizni bloklagan!"
                : dayjs
                    .unix(chats[chatRoomID]?.messagingUser.lastSeen)
                    .format("DD/MM/YYYY") !==
                  dayjs.unix(dayjs().unix()).format("DD/MM/YYYY")
                ? dayjs
                    .unix(chats[chatRoomID]?.messagingUser.lastSeen)
                    .format("DD/MM/YYYY")
                : chats[chatRoomID]?.messagingUser.lastSeen >
                  dayjs().unix() - 70
                ? "online"
                : dayjs
                    .unix(chats[chatRoomID]?.messagingUser.lastSeen)
                    .format("HH:mm")}
              {dayjs
                .unix(chats[chatRoomID]?.messagingUser.lastSeen)
                .format("DD/MM/YYYY") !==
                dayjs.unix(dayjs().unix()).format("DD/MM/YYYY") &&
                !user.blockedUsers?.includes(
                  chats[chatRoomID]?.messagingUser?.uid
                ) &&
                !chats[chatRoomID]?.messagingUser?.blockedUsers?.includes(
                  user.uid
                ) && (
                  <span className="ml-2">
                    {dayjs
                      .unix(chats[chatRoomID]?.messagingUser?.lastSeen)
                      .format("HH:mm")}
                  </span>
                )}
            </p>
          )}
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
              <MoreVertIcon style={{ color: theme.textColor }} />
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
            {chats[chatRoomID]?.messages?.length > 0 && (
              <MenuItem onClick={() => setShowModul("deleteAll")}>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize="small" />
                </ListItemIcon>
                hammasini o'chirish
              </MenuItem>
            )}
            {user.blockedUsers.includes(
              messagingUserChat
                ? messagingUserChat.id
                : chats[chatRoomID]?.messagingUser.uid
            ) ? (
              <MenuItem onClick={() => setShowModul("unBlock")}>
                <ListItemIcon>
                  <RemoveCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                blokdan chiqarish
              </MenuItem>
            ) : (
              <MenuItem onClick={() => setShowModul("block")}>
                <ListItemIcon>
                  <BlockIcon fontSize="small" />
                </ListItemIcon>
                bloklash
              </MenuItem>
            )}
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
              {dateShowingMessages.includes(item.id) && (
                <div className="flex justify-center">
                  <p className="px-2 py-1 bg-black opacity-80 text-white rounded-lg">
                    {dayjs.unix(item.timestamp).format("DD/MM/YYYY")}
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
                setCurrentShowingDate={(date) => setCurrentShowingDate(date)}
                currentShowingDate={currentShowingDate}
                setShowAgain={(value) => setShowAgain(value)}
                showAgain={showAgain}
                setShowDate={(value) => setShowDate(value)}
                showDate={showDate}
                setTimestampDate={(value) => setTimestampDate(value)}
                showAvatar={
                  !chats[chatRoomID]?.messagingUser?.blockedUsers?.includes(
                    user.uid
                  ) &&
                  !user?.blockedUsers?.includes(
                    chats[chatRoomID]?.messagingUser.uid
                  )
                    ? true
                    : false
                }
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
              {dateShowingMessages.includes(item.id) && (
                <div className="flex justify-center">
                  <p className="px-2 py-1 bg-black opacity-80 text-white rounded-lg">
                    {dayjs.unix(item.timestamp).format("DD/MM/YYYY")}
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
                setCurrentShowingDate={(date) => setCurrentShowingDate(date)}
                currentShowingDate={currentShowingDate}
                setShowAgain={(value) => setShowAgain(value)}
                showAgain={showAgain}
                setShowDate={(value) => setShowDate(value)}
                showDate={showDate}
                setTimestampDate={(value) => setTimestampDate(value)}
                showAvatar={
                  !chats[chatRoomID]?.messagingUser?.blockedUsers?.includes(
                    user.uid
                  ) &&
                  !user?.blockedUsers?.includes(
                    chats[chatRoomID]?.messagingUser.uid
                  )
                    ? true
                    : false
                }
              />
            </div>
          )
        )}
      </div>
      <div className="fixed max-w-2xl overflow-hidden bottom-2 right-2 xl:right-auto left-2 xl:left-auto xl:w-full sm:mx-auto bg-gray-300 flex items-center rounded-2xl">
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
          disabled={messagingUserChat ? disabledFirst : disabledSecond}
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
          disabled={messagingUserChat ? disabledFirst : disabledSecond}
        />
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatRoom;
