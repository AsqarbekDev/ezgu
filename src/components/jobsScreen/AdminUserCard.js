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
      {loading && (
        <>
          <div
            role="status"
            className="fixed z-[100] flex items-center -mt-[41px] justify-center -top-2 bottom-0 left-0 right-0"
          >
            <div className="w-40 h-40 rounded-3xl pl-2 bg-black flex flex-col items-center justify-center">
              <svg
                aria-hidden="true"
                className="mr-2 w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-black"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <p className="text-white text-sm -ml-1 mt-3">Yuklanyabdi...</p>
            </div>
          </div>
          <div className="fixed z-[99] flex items-center -mt-[41px] justify-center -top-2 bottom-0 left-0 right-0 bg-black opacity-20"></div>
        </>
      )}
      {showRemoveUserModul && (
        <div className="fixed z-[98] flex items-center -mt-[41px] justify-center top-0 bottom-0 left-0 right-0">
          <div className="rounded-xl bg-black text-white text-lg p-6 flex flex-col items-center">
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
      <div className="flex items-center justify-between">
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
              style={{ fontSize: 22, color: "black" }}
              className="-rotate-45"
            />
          </IconButton>
        </div>
        {jobEndingTime > dayjs().unix() && (
          <button
            onClick={() => setShowRemoveUserModul(true)}
            className="bg-black px-2 py-1 text-white text-xs rounded-lg overflow-hidden"
          >
            Chiqarish
          </button>
        )}
      </div>
    </>
  );
}

export default AdminUserCard;
