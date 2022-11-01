import { Avatar, IconButton } from "@mui/material";
import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { selectTheme } from "../../features/themeSlice";
import LoadingModul from "../LoadingModul";

function AdminUserCard({
  image,
  username,
  uid,
  jobId,
  phoneNumber,
  jobEndingTime,
  jobName,
}) {
  const [showRemoveUserModul, setShowRemoveUserModul] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);

  const removeWorker = async () => {
    setShowRemoveUserModul(false);
    setLoading(true);
    await updateDoc(doc(db, "jobs", jobId), {
      currentWorkers: arrayRemove(uid),
    });
    await deleteDoc(doc(db, "jobs", jobId, "workers", uid));
    await addDoc(collection(db, "notifications"), {
      userID: user.uid,
      userImage: user.image,
      userName: user.username,
      notifyName: jobName,
      notifyID: jobId,
      message:
        "Foydalanuvchi! Siz ish beruvchi tomonidan ishdan chetlashtirildingiz!",
      to: uid,
      from: "jobs",
      messageType: "removed",
      seen: false,
      timestamp: dayjs().unix(),
    });
    setLoading(false);
  };

  const banWorker = async () => {
    setShowRemoveUserModul(false);
    setLoading(true);
    await setDoc(doc(db, "jobs", jobId, "bannedWorkers", uid), {
      image,
      username,
    });
    await updateDoc(doc(db, "jobs", jobId), {
      currentWorkers: arrayRemove(uid),
    });
    await deleteDoc(doc(db, "jobs", jobId, "workers", uid));
    await addDoc(collection(db, "notifications"), {
      userID: user.uid,
      userImage: user.image,
      userName: user.username,
      notifyName: jobName,
      notifyID: jobId,
      message:
        "Foydalanuvchi! Siz ish beruvchi tomonidan joriy ish uchun ban qilindingiz! Endi ushbu ishni qayta ololmaysiz!",
      to: uid,
      from: "jobs",
      messageType: "banned",
      seen: false,
      timestamp: dayjs().unix(),
    });
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingModul />}
      {showRemoveUserModul && (
        <div className="fixed z-[98] max-w-2xl flex items-center -mt-[41px] justify-center top-0 bottom-0 w-full">
          <div
            style={{ borderColor: theme.border }}
            className={`${
              theme.type === "dark" && "border-2"
            } rounded-xl bg-black text-white text-lg p-6 flex flex-col items-center`}
          >
            <button
              onClick={removeWorker}
              className="border border-white rounded-lg py-2 w-[200px]"
            >
              Ro'yxatdan chiqarish
            </button>
            <button
              onClick={banWorker}
              className="border border-white rounded-lg py-2 w-[200px] mt-3"
            >
              Ban qilish
            </button>
            <button
              onClick={() => setShowRemoveUserModul(false)}
              className="bg-white text-black font-bold text-base rounded-lg w-[140px] mt-6"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}
      <div
        style={{ color: theme.textColor }}
        className="flex items-center justify-between"
      >
        <Avatar src={image} alt="Avatar" style={{ height: 36, width: 36 }} />
        <div className="ml-2 flex-1 overflow-hidden">
          <p className="text-sm font-[700] -mt-1 truncate">{username}</p>
          {jobEndingTime > dayjs().unix() && (
            <p className="text-xs -mt-[1px]">{phoneNumber}</p>
          )}
        </div>
        <div className="-mt-[6px] mr-1">
          <IconButton onClick={() => navigate(`/chats/${uid}`)} size="small">
            <SendIcon
              style={{ fontSize: 22, color: theme.textColor }}
              className="-rotate-45"
            />
          </IconButton>
        </div>
        {jobEndingTime > dayjs().unix() && (
          <button
            style={{ borderColor: theme.border }}
            onClick={() => setShowRemoveUserModul(true)}
            className={`${
              theme.type === "dark" && "border"
            } bg-black px-2 py-1 text-white text-xs rounded-lg overflow-hidden`}
          >
            Chiqarish
          </button>
        )}
      </div>
    </>
  );
}

export default AdminUserCard;
