import { Avatar, IconButton, ListItemButton } from "@mui/material";
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
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { selectTheme } from "../../features/themeSlice";
import { selectLanguage } from "../../features/languageSlice";
import LoadingModul from "../LoadingModul";
import { setDisableScroll } from "../../features/disableScrollSlice";

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
  const language = useSelector(selectLanguage);
  const dispatch = useDispatch();

  const removeWorker = async () => {
    setShowRemoveUserModul(false);
    dispatch(setDisableScroll(false));
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
    dispatch(setDisableScroll(false));
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
      {loading && <LoadingModul inner />}
      {showRemoveUserModul && (
        <div>
          <div
            style={{ borderColor: theme.border }}
            className={`${
              theme.type === "dark" && "border-2"
            } fixed z-[100] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-xl bg-black text-white text-lg p-6 flex flex-col items-center`}
          >
            <div
              onClick={removeWorker}
              className="border border-white rounded-lg w-[200px] overflow-hidden"
            >
              <ListItemButton>
                <p className="w-full text-center">
                  {language.jobs.modulRemoveBtn}
                </p>
              </ListItemButton>
            </div>
            <div
              onClick={banWorker}
              className="border border-white rounded-lg w-[200px] mt-3 overflow-hidden"
            >
              <ListItemButton>
                <p className="w-full text-center">
                  {language.jobs.modulBanBtn}
                </p>
              </ListItemButton>
            </div>
            <div
              onClick={() => {
                setShowRemoveUserModul(false);
                dispatch(setDisableScroll(false));
              }}
              className="bg-white text-black font-bold text-base rounded-lg w-[140px] mt-6 overflow-hidden"
            >
              <ListItemButton>
                <p className="w-full text-center -my-1">
                  {language.jobs.modulCancelBtn}
                </p>
              </ListItemButton>
            </div>
          </div>
          <div
            onClick={() => {
              setShowRemoveUserModul(false);
              dispatch(setDisableScroll(false));
            }}
            className="fixed z-[98] max-w-2xl -mt-[41px] top-0 bottom-0 -ml-4 w-full"
          ></div>
        </div>
      )}
      <div
        style={{ color: theme.textColor }}
        className="flex items-center justify-between"
      >
        <Avatar src={image} alt="Avatar" style={{ height: 36, width: 36 }} />
        <div className="ml-2 flex-1 overflow-hidden">
          <p className="text-sm font-[700] truncate">{username}</p>
          {jobEndingTime > dayjs().unix() && (
            <p className="text-xs">{phoneNumber}</p>
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
          <div
            style={{ borderColor: theme.border }}
            onClick={() => {
              setShowRemoveUserModul(true);
              dispatch(setDisableScroll(true));
            }}
            className={`${
              theme.type === "dark" && "border"
            } bg-black text-white text-xs rounded-lg overflow-hidden`}
          >
            <ListItemButton>
              <p className="w-full text-center -my-1">
                {language.jobs.removeUser}
              </p>
            </ListItemButton>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminUserCard;
