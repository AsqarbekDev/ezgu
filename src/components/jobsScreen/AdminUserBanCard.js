import { Avatar, ListItemButton } from "@mui/material";
import dayjs from "dayjs";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../features/languageSlice";
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
  const language = useSelector(selectLanguage);

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
      {loading && <LoadingModul inner />}
      {showUnbanUserModul && (
        <ActionModul
          text={language.jobs.unbanModul}
          cancelFunction={(value) => setShowUnbanUserModul(value)}
          confirmFunction={unbanWorker}
          inner
        />
      )}
      <div
        style={{ color: theme.textColor }}
        className="flex items-center justify-between"
      >
        <Avatar src={image} alt="Avatar" style={{ height: 36, width: 36 }} />
        <p className="ml-2 -mt-1 flex-1 font-bold truncate">{username}</p>
        {jobEndingTime > dayjs().unix() && (
          <div
            style={{ borderColor: theme.border }}
            className={`${
              theme.type === "dark" && "border"
            } bg-black text-white text-xs rounded-lg overflow-hidden`}
          >
            <ListItemButton onClick={() => setShowUnbanUserModul(true)}>
              <p className="w-full text-center -my-1">
                {language.jobs.unbanUser}
              </p>
            </ListItemButton>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminUserBanCard;
