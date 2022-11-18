import React from "react";
import { Avatar, IconButton, ListItemButton } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import UserCard from "../components/jobsScreen/UserCard";
import LoadingModul from "../components/LoadingModul";
import AdminUserCard from "../components/jobsScreen/AdminUserCard";
import AdminUserBanCard from "../components/jobsScreen/AdminUserBanCard";
import EmailIcon from "@mui/icons-material/Email";
import BlockIcon from "@mui/icons-material/Block";
import DefaultLoadingModul from "../components/DefaultLoadingModul";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { selectUser, selectWaiting } from "../features/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useState } from "react";
import ExitHeader from "../components/ExitHeader";
import BottomNavigation from "../components/BottomNavigation";
import { selectTheme } from "../features/themeSlice";
import ActionModul from "../components/ActionModul";
import { selectLanguage } from "../features/languageSlice";

function JobInfo() {
  const [job, setJob] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [bannedWorkers, setBannedWorkers] = useState([]);
  const [bannedWorkersArray, setBannedWorkersArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModul, setShowModul] = useState(false);
  const [showBanErrorModul, setShowBanErrorModul] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showBan, setShowBan] = useState(false);
  const [getNavigate, setGetNavigate] = useState(false);
  const [jobDone, setJobDone] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { jobId } = useParams();
  const waiting = useSelector(selectWaiting);
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  useEffect(() => {
    if (getNavigate) {
      if (user?.currentJob) {
        if (jobDone) {
          const updateUserDone = async () => {
            await updateDoc(doc(db, "users", user?.uid), {
              currentJob: "",
            });
          };
          updateUserDone();
        } else {
          const updateUser = async () => {
            await updateDoc(doc(db, "users", user?.uid), {
              currentJob: "",
              workedJobs: user?.workedJobs - 1,
            });
          };
          updateUser();
        }
      }
      navigate("/");
    }
  }, [
    getNavigate,
    jobDone,
    navigate,
    user?.currentJob,
    user?.uid,
    user?.workedJobs,
  ]);

  useEffect(() => {
    if (!waiting) {
      const unsubscribe = onSnapshot(
        doc(db, "jobs", jobId),
        async (snapshot) => {
          if (snapshot.exists()) {
            if (user?.currentJob === jobId) {
              if (snapshot.data().deleted === false) {
                if (snapshot.data().currentWorkers.includes(user.uid)) {
                  if (
                    snapshot.data().disabled === false &&
                    snapshot.data().endingTime > dayjs().unix()
                  ) {
                    setJob({
                      id: snapshot.id,
                      ...snapshot.data(),
                    });
                  } else {
                    setJobDone(true);
                    await addDoc(collection(db, "notifications"), {
                      userID: snapshot.data().userID,
                      userImage: snapshot.data().userImage,
                      userName: snapshot.data().userName,
                      notifyName: snapshot.data().jobName,
                      notifyID: snapshot.id,
                      to: user.uid,
                      from: "jobs",
                      messageType: "success",
                      seen: false,
                      timestamp: dayjs().unix(),
                    });
                    setGetNavigate(true);
                  }
                } else {
                  setGetNavigate(true);
                }
              } else {
                setGetNavigate(true);
              }
            } else {
              setJob({
                id: snapshot.id,
                ...snapshot.data(),
              });
            }
          } else {
            setGetNavigate(true);
          }
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [jobId, user?.currentJob, user?.uid, waiting]);

  useEffect(() => {
    if (job) {
      const unsubscribe = onSnapshot(
        collection(db, "jobs", job.id, "workers"),
        (snapshot) => {
          const allWorkers = [];
          snapshot.forEach((doc) => {
            allWorkers.push({
              uid: doc.id,
              image: doc.data().image,
              phoneNumber: doc.data().phoneNumber,
              username: doc.data().username,
            });
          });
          setWorkers(allWorkers);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [job]);

  useEffect(() => {
    if (job && auth?.currentUser) {
      const unsubscribe = onSnapshot(
        collection(db, "jobs", job.id, "bannedWorkers"),
        (snapshot) => {
          const allWorkers = [];
          const allWorkersArray = [];
          snapshot.forEach((doc) => {
            allWorkers.push({
              uid: doc.id,
              image: doc.data().image,
              username: doc.data().username,
            });
            allWorkersArray.push(doc.id);
          });
          setBannedWorkers(allWorkers);
          setBannedWorkersArray(allWorkersArray);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [job]);

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = () => {
    if (job) {
      copyTextToClipboard(job.userPhoneNumber)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getJob = async () => {
    if (
      user &&
      job &&
      !user?.currentJob &&
      workers?.length < job?.workersCount &&
      !bannedWorkersArray.includes(user?.uid)
    ) {
      setShowModul(false);
      setLoading(true);
      await setDoc(doc(db, "jobs", job.id, "workers", user.uid), {
        image: user.image,
        phoneNumber: user.phoneNumber,
        username: user.username,
      });
      await updateDoc(doc(db, "jobs", job.id), {
        currentWorkers: arrayUnion(user.uid),
      });
      await updateDoc(doc(db, "users", user.uid), {
        currentJob: job.id,
        workedJobs: user.workedJobs + 1,
      });

      setLoading(false);
    } else if (!user) {
      navigate("/signUp");
    } else if (bannedWorkersArray.includes(user?.uid)) {
      setShowModul(false);
      setShowBanErrorModul(true);
    }
  };

  const deleteJob = async () => {
    setShowModul(false);
    setLoading(true);
    await updateDoc(doc(db, "jobs", job?.id), {
      disabled: true,
      deleted: true,
    });
    workers.map(async (worker) => {
      await addDoc(collection(db, "notifications"), {
        userID: user.uid,
        userImage: user.image,
        userName: user.username,
        notifyName: job.jobName,
        notifyID: job.id,
        to: worker.uid,
        from: "jobs",
        messageType: "deleted",
        seen: false,
        timestamp: dayjs().unix(),
      });
    });
    setLoading(false);
    navigate("/");
  };

  const exitJob = async () => {
    setShowModul(false);
    setLoading(true);
    await updateDoc(doc(db, "users", user?.uid), {
      currentJob: "",
      workedJobs: user?.workedJobs - 1,
    });
    await deleteDoc(doc(db, "jobs", job?.id, "workers", user?.uid));
    await updateDoc(doc(db, "jobs", job?.id), {
      currentWorkers: arrayRemove(user?.uid),
    });
    setLoading(false);
  };

  return (
    <div className="pb-12 xl:pb-1">
      <ExitHeader
        screenName={language.jobs.headerText}
        myjob={user?.currentJob ? true : false}
        jobScreen
        jobName={job?.jobName}
        salary={`${language.jobs.salary} ${job?.salary}`}
        workersCount={`${language.jobs.numOfWorkers} ${job?.workersCount}`}
        phoneNumber={`${language.jobs.phone} ${job?.userPhoneNumber}`}
        Time={`${language.jobs.time} ${dayjs
          .unix(job?.startingTime)
          .format("D/M/YYYY")} ${dayjs
          .unix(job?.startingTime)
          .format("HH:mm")} - ${dayjs.unix(job?.endingTime).format("HH:mm")}`}
        country={`${language.jobs.country} ${job?.country}`}
        region={`${language.jobs.region} ${job?.region}`}
        metro={`${language.jobs.metro} ${job?.line} ${job?.station}`}
        workingPlace={`${language.jobs.address} ${job?.workingPlace}`}
        comment={`${language.jobs.comment} ${job?.comment}`}
      />
      {loading && <LoadingModul />}
      {showModul && (
        <ActionModul
          text={
            job?.userID === user?.uid
              ? language.jobs.modulTextDelete
              : user?.currentJob === job?.id
              ? language.jobs.modulTextExit
              : language.jobs.modulTextGet
          }
          cancelFunction={() => setShowModul(false)}
          confirmFunction={
            job?.userID === user?.uid
              ? deleteJob
              : user?.currentJob === job?.id
              ? exitJob
              : getJob
          }
        />
      )}
      {showBanErrorModul && (
        <ActionModul
          text={language.jobs.banErrorModulText}
          exitFunction={() => navigate("/")}
          errorModulExit
          buttonName={language.jobs.banErrorModulBtn}
        />
      )}
      {!job ? (
        <DefaultLoadingModul />
      ) : (
        <div className="p-2">
          <div
            style={{
              backgroundColor: theme.background,
              color: theme.textColor,
            }}
            className="p-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center m-1">
              <Avatar
                src={job?.userImage}
                alt={job?.userName}
                style={{ height: 44, width: 44 }}
              />
              <div className="ml-2 flex-1 truncate">
                <h5 className="font-bold text-lg -mt-1 ml-[1px] truncate flex-1">
                  {job?.userName}
                </h5>
                <div className="flex items-center -mt-[4px]">
                  <PersonAddAlt1Icon style={{ fontSize: 14, color: "green" }} />
                  <p className="text-xs ml-[2px] ">
                    {job?.userWorkedWith} {language.jobs.workedWith}
                  </p>
                </div>
              </div>
              {job?.userID !== user?.uid && (
                <IconButton
                  onClick={() =>
                    user
                      ? job && navigate(`/chats/${job.userID}`)
                      : navigate("/signUp")
                  }
                  size="small"
                >
                  <EmailIcon style={{ fontSize: 38, color: theme.iconColor }} />
                </IconButton>
              )}
            </div>
            <div className="space-y-1 text-lg">
              <h4 className="font-bold leading-6 mt-3 pb-1 overflow-hidden">
                {job?.jobName}
              </h4>
              <div className="flex items-center font-bold">
                <h4>{language.jobs.salary}</h4>
                <p className="text-[#34b804] text-xl ml-2">
                  {job?.salary}{" "}
                  <span>
                    {job?.currency === "USD" && (
                      <span className="text-green-500">$</span>
                    )}
                    {job?.currency === "EUR" && (
                      <span className="text-[#5D7EA7]">€</span>
                    )}
                    {job?.currency === "RUB" && (
                      <span className="text-[#c7a10a]">₽</span>
                    )}
                    {job?.currency === "UZS" && (
                      <span className="text-[#FFC33C]">so'm</span>
                    )}
                  </span>
                </p>
              </div>
              <div className="flex items-start font-bold">
                <h4>{language.jobs.numOfWorkers}</h4>
                <p style={{ color: theme.iconColor }} className="ml-2">
                  <span className="text-blue-700">{workers.length}</span>/
                  {job?.workersCount}
                </p>
              </div>
              {user?.currentJob === job?.id &&
              job?.endingTime > dayjs().unix() ? (
                <div className="flex items-start font-bold">
                  <h4 className="">{language.jobs.phone}</h4>
                  <p style={{ color: theme.iconColor }} className="ml-2">
                    {job?.userPhoneNumber}
                  </p>
                  <div
                    style={{
                      backgroundColor: isCopied
                        ? theme.buttonOpacityColor
                        : theme.background,
                      borderColor: theme.border,
                    }}
                    className={`ml-2 mt-[3px] border rounded-lg overflow-hidden text-sm`}
                  >
                    <ListItemButton onClick={handleCopyClick}>
                      <p className="w-full text-center -my-2">
                        {isCopied ? language.jobs.copied : language.jobs.copy}
                      </p>
                    </ListItemButton>
                  </div>
                </div>
              ) : job?.userID === user?.uid ? (
                <div className="flex items-start font-bold">
                  <h4 className="">{language.jobs.phone}</h4>
                  <p
                    style={{ color: theme.iconColor }}
                    className="ml-2 truncate"
                  >
                    {job?.userPhoneNumber}
                  </p>
                  <div
                    style={{
                      backgroundColor: isCopied
                        ? theme.buttonOpacityColor
                        : theme.background,
                      borderColor: theme.border,
                    }}
                    className={`ml-2 mt-[3px] border rounded-lg overflow-hidden text-sm`}
                  >
                    <ListItemButton onClick={handleCopyClick}>
                      <p className="w-full text-center -my-2">
                        {isCopied ? language.jobs.copied : language.jobs.copy}
                      </p>
                    </ListItemButton>
                  </div>
                </div>
              ) : null}
              <div className="flex items-start font-bold">
                <h4>{language.jobs.time}</h4>
                <p style={{ color: theme.iconColor }} className="ml-2">
                  {dayjs.unix(job?.startingTime).format("D/M/YYYY")}
                </p>
                <p style={{ color: theme.iconColor }} className="ml-6">
                  {dayjs.unix(job?.startingTime).format("HH:mm")} -{" "}
                  {dayjs.unix(job?.endingTime).format("HH:mm")}
                </p>
              </div>
              <div className="flex items-start font-bold">
                <h4 className="">{language.jobs.country}</h4>
                <p style={{ color: theme.iconColor }} className="ml-2">
                  {job?.country}
                </p>
              </div>
              <div className="flex items-start font-bold">
                <h4 className="">{language.jobs.region}</h4>
                <p style={{ color: theme.iconColor }} className="ml-2">
                  {job?.region}
                </p>
              </div>
              {job?.line !== "Неизвестный" && (
                <div className="flex items-start font-bold">
                  <h4 className="">{language.jobs.metro}</h4>
                  <p style={{ color: theme.iconColor }} className="ml-2">
                    {job?.line} {job?.station}
                  </p>
                </div>
              )}
              <div className="flex items-start font-bold">
                <h4 className="">{language.jobs.address}</h4>
                <p
                  style={{ color: theme.iconColor }}
                  className="ml-2 overflow-hidden"
                >
                  {job?.workingPlace}
                </p>
              </div>
              {user?.currentJob === job?.id || job?.userID === user?.uid ? (
                <div className="flex items-start">
                  <h4 className="font-bold leading-3 overflow-hidden">
                    {language.jobs.comment}{" "}
                    <span
                      style={{ color: theme.iconColor }}
                      className="font-medium text-base"
                    >
                      {job?.comment}
                    </span>
                  </h4>
                </div>
              ) : null}
            </div>
            <div>
              <div className="border-b-[1px] pb-2 pt-4 flex items-center justify-between">
                <p className="font-bold">
                  {showBan ? language.jobs.banned : language.jobs.workers}
                </p>
                {job?.userID === user?.uid && (
                  <div
                    onClick={() => setShowBan(!showBan)}
                    style={{
                      backgroundColor: showBan
                        ? theme.background
                        : theme.textColor,
                      borderColor: showBan ? theme.border : theme.background,
                      color: showBan ? theme.textColor : theme.background,
                    }}
                    className={`border rounded-lg overflow-hidden h-6 w-16 ${
                      showBan && theme.type === "dark"
                        ? "font-[600]"
                        : !showBan && theme.type === "dark"
                        ? "font-bold"
                        : showBan && theme.type === "light"
                        ? "font-bold"
                        : !showBan && theme.type === "light"
                        ? "font-[600]"
                        : ""
                    }`}
                  >
                    <ListItemButton>
                      <p className="h-6 w-16 flex items-center justify-center pb-[18px] pr-8">
                        <span>Ban</span>
                        <BlockIcon
                          style={{
                            fontSize: 18,
                            color: showBan ? theme.textColor : theme.background,
                          }}
                        />
                      </p>
                    </ListItemButton>
                  </div>
                )}
              </div>
              <div className="space-y-2 mt-2">
                {job?.userID === user?.uid && showBan
                  ? bannedWorkers.map((item, index) => (
                      <AdminUserBanCard
                        key={index}
                        image={item.image}
                        username={item.username}
                        uid={item.uid}
                        jobId={job.id}
                        jobEndingTime={job.endingTime}
                        jobName={job.jobName}
                      />
                    ))
                  : job?.userID === user?.uid && !showBan
                  ? workers.map((item, index) => (
                      <AdminUserCard
                        key={index}
                        image={item.image}
                        username={item.username}
                        uid={item.uid}
                        phoneNumber={item.phoneNumber}
                        jobId={job.id}
                        jobEndingTime={job.endingTime}
                        jobName={job.jobName}
                      />
                    ))
                  : workers.map((item, index) => (
                      <UserCard
                        key={index}
                        image={item.image}
                        username={item.username}
                        uid={item.uid}
                      />
                    ))}
              </div>
              {job?.endingTime > dayjs().unix() && job?.deleted === false && (
                <div className="flex items-center justify-center mb-4 mt-6">
                  <div
                    style={{ borderColor: theme.border }}
                    className={`${
                      theme.type === "dark" && "border"
                    } bg-black text-white w-[60%] rounded-lg overflow-hidden`}
                  >
                    <ListItemButton
                      disabled={loading}
                      onClick={() => setShowModul(true)}
                    >
                      <p className="w-full text-center -my-1">
                        {job?.userID === user?.uid
                          ? language.jobs.deleteJob
                          : user?.currentJob === job?.id
                          ? language.jobs.cancelJob
                          : language.jobs.getJob}
                      </p>
                    </ListItemButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <BottomNavigation jobId={jobId} />
    </div>
  );
}

export default JobInfo;
