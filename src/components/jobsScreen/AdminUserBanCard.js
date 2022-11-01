import { Avatar } from "@mui/material";
import dayjs from "dayjs";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../../features/themeSlice";
import { selectUser } from "../../features/userSlice";
import { db } from "../../firebase";
import ActionModul from "../ActionModul";
import LoadingModul from "../LoadingModul";

function AdminUserBanCard({
  image,
  username,
  uid,
  jobId,
  jobEndingTime,
  jobName,
}) {
  const [showUnbanUserModul, setShowUnbanUserModul] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);

  const unbanWorker = async () => {
    setShowUnbanUserModul(false);
    setLoading(true);
    await deleteDoc(doc(db, "jobs", jobId, "bannedWorkers", uid));
    await addDoc(collection(db, "notifications"), {
      userID: user.uid,
      userImage: user.image,
      userName: user.username,
      notifyName: jobName,
      notifyID: jobId,
      message: "Ish beruvchi tomonidan joriy ish uchun bandan chiqarildingiz!",
      to: uid,
      from: "jobs",
      messageType: "unbanned",
      seen: false,
      timestamp: dayjs().unix(),
    });
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingModul />}
      {showUnbanUserModul && (
        <ActionModul
          text="Foydalanuvchini bandan chiqarishni xoxlaysizmi?"
          cancelFunction={(value) => setShowUnbanUserModul(value)}
          confirmFunction={unbanWorker}
        />
      )}
      <div
        style={{ color: theme.textColor }}
        className="flex items-center justify-between"
      >
        <Avatar src={image} alt="Avatar" style={{ height: 36, width: 36 }} />
        <p className="ml-2 -mt-1 flex-1 font-bold truncate">{username}</p>
        {jobEndingTime > dayjs().unix() && (
          <button
            style={{ borderColor: theme.border }}
            onClick={() => setShowUnbanUserModul(true)}
            className={`${
              theme.type === "dark" && "border"
            } bg-black px-2 py-1 text-white text-xs rounded-lg overflow-hidden`}
          >
            Bandan olish
          </button>
        )}
      </div>
    </>
  );
}

export default AdminUserBanCard;
