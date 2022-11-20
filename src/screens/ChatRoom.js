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
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ImageMessage from "../components/chatsScreen/ImageMessage";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  checkChat,
  deleteChat,
  selectChatRooms,
  selectChats,
  selectEditingChat,
  setEditingChat,
} from "../features/chatsSlice";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { StyledBadge } from "../components/StyledBadge";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";
import ActionModul from "../components/ActionModul";
import { selectShare, setShare } from "../features/shareSlice";

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
  const language = useSelector(selectLanguage);
  const share = useSelector(selectShare);
  const editingChat = useSelector(selectEditingChat);
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [isChatRoomExists, setIsChatRoomExists] = useState(false);
  const [chatRoomID, setChatRoomID] = useState(null);
  const [newMessageID, setNewMessageID] = useState(null);
  const [waitingUser, setWaitingUser] = useState(true);
  const [showModul, setShowModul] = useState("");
  const [currentShowingDate, setCurrentShowingDate] = useState(null);
  const [showAgain, setShowAgain] = useState(null);
  const [showDate, setShowDate] = useState(null);
  const [timestampDate, setTimestampDate] = useState(null);
  const [dateShowingMessages, setDateShowingMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [checkable, setCheckable] = useState(false);
  const [messagesLength, setMessagesLength] = useState(0);
  const [checkedMessages, setCheckedMessages] = useState({});
  const [imageHeight, setImageHeight] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [editingMessageID, setEditingMessageID] = useState(null);
  const [editingIsImage, setEditingIsImage] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deletingMessageID, setDeletingMessageID] = useState(null);

  const disabledSecond =
    chats[chatRoomID] &&
    chats[chatRoomID]?.messagingUser?.blockedUsers?.includes(user.uid)
      ? true
      : chats[chatRoomID] &&
        user.blockedUsers?.includes(chats[chatRoomID]?.messagingUser?.uid)
      ? true
      : checkable
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

  const updateEditedMessage = async () => {
    if (messageRef.current.value.length > 0 || editingIsImage) {
      const sendingMessage = messageRef.current.value;
      const editedmessageID = editingMessageID;
      messageRef.current.value = "";
      messageRef.current.focus();
      setEditingMessageID(null);
      setEditing(false);
      await updateDoc(
        doc(db, "chats", chatRoomID, "messages", editedmessageID),
        {
          message: sendingMessage,
          edited: true,
        }
      );
    } else {
      messageRef.current.focus();
    }
  };

  const cancelEdit = () => {
    messageRef.current.value = "";
    setEditingMessageID(null);
    setEditing(false);
    messageRef.current.focus();
  };

  const deleteOneMessage = async () => {
    setShowModul("");
    await deleteDoc(
      doc(db, "chats", chatRoomID, "messages", deletingMessageID)
    );
  };

  useEffect(() => {
    if (share) {
      messageRef.current.value = share.message;
      if (share.image) {
        setImage(share.image.image);
      }
      dispatch(setShare(null));
      messageRef.current.focus();
    }
    if (editingChat) {
      setEditing(true);
      messageRef.current.value = editingChat.message;
      setEditingMessageID(editingChat.messageID);
      setEditingIsImage(editingChat.isImage);
      dispatch(setEditingChat(null));
      setTimeout(() => {
        messageRef.current.focus();
      }, [100]);
    }
  }, [share, dispatch, editingChat]);

  useEffect(() => {
    if (image?.startsWith("http")) {
      const newImage = new Image();
      newImage.src = image;
      newImage.onload = () => {
        const height = newImage.height;
        const width = newImage.width;
        setImageHeight(height);
        setImageWidth(width);
      };
    }
  }, [image]);

  const addCheckedMessage = (message) => {
    if (message.type === "add") {
      checkedMessages[message.id] = message.id;
      setMessagesLength((prevValue) => prevValue + 1);
    } else if (message.type === "remove") {
      delete checkedMessages[message.id];
      setMessagesLength((prevValue) => prevValue - 1);
    }
  };

  const closeCheck = () => {
    setCheckedMessages({});
    setMessagesLength(0);
    setCheckable(false);
  };

  const deleteCheckedMessages = () => {
    if (messagesLength === messages.length) {
      deleteMessages();
    } else {
      setShowModul("");
      Object.keys(checkedMessages).map(async (item) => {
        await deleteDoc(doc(db, "chats", chatRoomID, "messages", item));
      });
      closeCheck();
    }
  };

  const blockUser = async () => {
    setShowModul("");
    const blockingUser = chats[chatRoomID]?.messagingUser.uid;

    await updateDoc(doc(db, "users", user.uid), {
      blockedUsers: arrayUnion(blockingUser),
    });
  };

  const unBlockUser = async () => {
    setShowModul("");
    const unBlockingUser = chats[chatRoomID]?.messagingUser.uid;

    await updateDoc(doc(db, "users", user.uid), {
      blockedUsers: arrayRemove(unBlockingUser),
    });
  };

  const deleteMessages = async () => {
    setShowModul("");

    dispatch(deleteChat(chatRoomID));

    await updateDoc(doc(db, "chats", chatRoomID), {
      deleted: true,
    });
  };

  useEffect(() => {
    if (chats[chatRoomID]?.messages.length > 0) {
      setMessages(chats[chatRoomID]?.messages);
    }
  }, [chatRoomID, chats]);

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
      const newImage = new Image();
      newImage.src = readerEvent.target.result;
      newImage.onload = () => {
        const height = newImage.height;
        const width = newImage.width;
        setImageHeight(height);
        setImageWidth(width);
      };

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
      const height = imageHeight;
      const width = imageWidth;
      setImageHeight(null);
      setImageWidth(null);
      messageRef.current.value = "";
      setImage(null);
      if (isChatRoomExists) {
        addDoc(collection(db, "chats", chatRoomID, "messages"), {
          message: sendingMessage,
          timestamp: dayjs().unix(),
          uploadedTime: serverTimestamp(),
          uid: user.uid,
          users: [auth.currentUser.uid, uid],
          image: image?.startsWith("http") ? image : "",
          seen: false,
          edited: false,
          imageHeight: height || 0,
          imageWidth: width || 0,
        })
          .then(async (snapDoc) => {
            if (image && !image.startsWith("http")) {
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
      }
    }
  };

  useEffect(() => {
    let chatRoomExists = false;
    if (chatRooms) {
      chatRooms.map((item) => {
        if (item.messagingUser === uid) {
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
    const createChatRoom = async () => {
      await addDoc(collection(db, "chats"), {
        users: [auth.currentUser.uid, uid],
        deleted: false,
      });
    };

    if (!isChatRoomExists && !waitingUser) {
      createChatRoom();
    }
  }, [isChatRoomExists, uid, waitingUser]);

  useEffect(() => {
    return () => {
      if (isChatRoomExists) {
        dispatch(checkChat(chatRoomID));
      }
    };
  }, [dispatch, chatRoomID, isChatRoomExists]);

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
          messageRef.current.focus();
        }
      }, 10);
    }
  }, [newMessageID]);

  const scrollToBottom = () => {
    if (!editing) {
      setTimeout(() => {
        if (bottomRef?.current) {
          bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    }
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
    <div className="pb-14 pt-[120px] sm:pt-16">
      {showModul && (
        <ActionModul
          text={
            showModul === "deleteOne"
              ? language.chats.modulTextDeleteOne
              : showModul === "deleteChecked"
              ? language.chats.modulTextSelected
              : showModul === "deleteAll"
              ? language.chats.modulTextDelete
              : showModul === "block"
              ? language.chats.modulTextBlock
              : showModul === "unBlock"
              ? language.chats.modulTextUnblock
              : null
          }
          cancelFunction={() => setShowModul("")}
          confirmFunction={
            showModul === "deleteOne"
              ? deleteOneMessage
              : showModul === "deleteChecked"
              ? deleteCheckedMessages
              : showModul === "deleteAll"
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
        {checkable ? (
          <div className="flex">
            <div className="w-14 h-14 flex items-center justify-center">
              <IconButton onClick={closeCheck} size="medium">
                <CloseIcon style={{ color: theme.textColor }} />
              </IconButton>
            </div>
            <div className="h-14 flex items-center justify-center">
              <p className="text-lg font-[600] -mb-[1px]">{messagesLength}</p>
            </div>
          </div>
        ) : (
          <div className="w-14 h-14 flex items-center justify-center">
            <IconButton onClick={() => navigate(-1)} size="medium">
              <WestIcon style={{ color: theme.textColor }} />
            </IconButton>
          </div>
        )}
        {!checkable && (
          <div>
            {chats[chatRoomID]?.messagingUser.lastSeen > dayjs().unix() - 70 &&
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
        )}
        {!checkable && (
          <div className="flex-1 truncate">
            <p className="font-[600] text-lg -mt-[2px] truncate">
              {chats[chatRoomID]?.messagingUser.username}
            </p>
            {chats[chatRoomID]?.messagingUser.lastSeen && (
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
        )}
        {checkable ? (
          <div className="w-14 h-14 flex items-center justify-center">
            {messagesLength > 0 && (
              <IconButton
                onClick={() => setShowModul("deleteChecked")}
                size="medium"
              >
                <DeleteForeverIcon style={{ color: theme.textColor }} />
              </IconButton>
            )}
          </div>
        ) : (
          <div className="w-14 h-14 flex items-center justify-center">
            <Tooltip title={language.chats.iconInfo}>
              <IconButton
                onClick={!editing ? handleClick : undefined}
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
                <MenuItem onClick={() => setCheckable(true)}>
                  <ListItemIcon>
                    <CheckBoxIcon fontSize="small" />
                  </ListItemIcon>
                  {language.chats.chooseText}
                </MenuItem>
              )}
              {chats[chatRoomID]?.messages?.length > 0 && (
                <MenuItem onClick={() => setShowModul("deleteAll")}>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                  </ListItemIcon>
                  {language.chats.deleteAllText}
                </MenuItem>
              )}
              {user.blockedUsers.includes(
                chats[chatRoomID]?.messagingUser.uid
              ) ? (
                <MenuItem onClick={() => setShowModul("unBlock")}>
                  <ListItemIcon>
                    <RemoveCircleOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  {language.chats.unblockText}
                </MenuItem>
              ) : (
                <MenuItem onClick={() => setShowModul("block")}>
                  <ListItemIcon>
                    <BlockIcon fontSize="small" />
                  </ListItemIcon>
                  {language.chats.blockText}
                </MenuItem>
              )}
            </Menu>
          </div>
        )}
      </div>
      <div>
        {messages.map((item, index) =>
          item.imageHeight > 0 ? (
            <div key={index}>
              {item.id === newMessageID && (
                <div
                  ref={newMessageRef}
                  className="border-b-8 border-violet-700 flex justify-center mt-4 mb-7"
                >
                  <p className="bg-violet-700 w-max -mb-[20px] text-white rounded-2xl px-6 pt-1 pb-1">
                    {language.chats.newMessagesText}
                  </p>
                </div>
              )}
              {dateShowingMessages.includes(item.id) && (
                <div className="flex justify-center">
                  <p
                    className={`${
                      theme.type === "dark" && "border"
                    } px-2 py-1 bg-black opacity-80 text-white rounded-lg`}
                  >
                    {dayjs.unix(item.timestamp).format("DD/MM/YYYY")}
                  </p>
                </div>
              )}
              <ImageMessage
                messageID={item.id}
                image={item.image}
                imageHeight={item.imageHeight}
                imageWidth={item.imageWidth}
                message={item.message}
                mine={item.uid === user.uid ? true : false}
                timestamp={item.timestamp}
                userImage={chats[chatRoomID]?.messagingUser.image}
                chatRoomID={chatRoomID}
                seen={item.seen}
                edited={item.edited}
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
                addCheckedMessage={addCheckedMessage}
                checkable={checkable}
                editing={editing}
                setShowModul={(value) => setShowModul(value)}
                setDeletingMessageID={(value) => setDeletingMessageID(value)}
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
                    {language.chats.newMessagesText}
                  </p>
                </div>
              )}
              {dateShowingMessages.includes(item.id) && (
                <div className="flex justify-center">
                  <p
                    className={`${
                      theme.type === "dark" && "border"
                    } px-2 py-1 bg-black opacity-80 text-white rounded-lg`}
                  >
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
                edited={item.edited}
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
                addCheckedMessage={addCheckedMessage}
                checkable={checkable}
                editing={editing}
                setShowModul={(value) => setShowModul(value)}
                setDeletingMessageID={(value) => setDeletingMessageID(value)}
              />
            </div>
          )
        )}
      </div>
      <div className="fixed max-w-2xl overflow-hidden bottom-2 right-2 xl:right-auto left-2 xl:left-auto xl:w-full sm:mx-auto bg-gray-300 flex items-center rounded-2xl">
        {image && !editing ? (
          <button
            disabled={disabledSecond}
            onClick={deleteImage}
            className="relative h-12 w-[70px] pr-1"
          >
            <img className="object-cover h-12 w-[70px]" src={image} alt="" />
            <CloseIcon
              style={{ fontSize: 16, color: "white" }}
              className="absolute z-10 right-1 top-0"
            />
          </button>
        ) : editing ? (
          <button onClick={cancelEdit} className="px-3 h-12 outline-none">
            <CloseIcon style={{ fontSize: 28 }} />
          </button>
        ) : (
          <button
            disabled={disabledSecond}
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
          onFocus={scrollToBottom}
          disabled={disabledSecond}
        />
        <button
          disabled={disabledSecond}
          onClick={editingMessageID ? updateEditedMessage : sendMessage}
          className="px-3 h-12 outline-none"
        >
          <SendIcon style={{ fontSize: 26 }} />
        </button>
        <input
          type="file"
          ref={imageRef}
          hidden
          onChange={addImage}
          accept="image/*"
          disabled={disabledSecond}
        />
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatRoom;
