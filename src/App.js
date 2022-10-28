import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Jobs from "./screens/Jobs";
import Homes from "./screens/Homes";
import Add from "./screens/Add";
import Chat from "./screens/Chat";
import Profile from "./screens/Profile";
import Header from "./components/Header";
import AddNewJob from "./screens/AddNewJob";
import AddNewHome from "./screens/AddNewHome";
import Notifications from "./screens/Notifications";
import SignUp from "./screens/SignUp";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectUser,
  selectWaiting,
  setWaiting,
} from "./features/userSlice";
import SignUpwithEmail from "./screens/SignUpwithEmail";
import { useEffect } from "react";
import { setNotifications } from "./features/notificationsSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Loading from "./screens/Loading";
import SignInwithEmail from "./screens/SignInwithEmail";
import ConfirmEmail from "./screens/ConfirmEmail";
import JobInfo from "./screens/JobInfo";
import JobsHistory from "./screens/JobsHistory";
import HomesHistory from "./screens/HomesHistory";
import dayjs from "dayjs";
import ChatRoom from "./screens/ChatRoom";
import {
  selectChatRooms,
  setChatRooms,
  setChats,
  setMessagingUsers,
} from "./features/chatsSlice";
import BottomNavigation from "./components/BottomNavigation";
import { setJobs, setMyAddedJobs } from "./features/jobsSlice";
import { setHomes, setMyAddedHomes } from "./features/homesSlice";
import BlockedUsersChat from "./screens/BlockedUsersChat";

function App() {
  const user = useSelector(selectUser);
  const chatRooms = useSelector(selectChatRooms);
  const waiting = useSelector(selectWaiting);
  const dispatch = useDispatch();
  const UserCurrent = auth?.currentUser;

  useEffect(() => {
    //Updating User LastSeen
    if (auth?.currentUser?.uid) {
      const updateSeen = async () => {
        await updateDoc(doc(db, "users", auth?.currentUser?.uid), {
          lastSeen: dayjs().unix(),
        });
      };
      updateSeen();
      const interval = setInterval(async () => {
        await updateDoc(doc(db, "users", auth?.currentUser?.uid), {
          lastSeen: dayjs().unix(),
        });
      }, 60000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [UserCurrent]);

  useEffect(() => {
    // Getting Jobs
    async function getDataFromDB() {
      if (
        (!waiting && !auth?.currentUser?.uid) ||
        (!waiting && !user?.country && !user?.currentJob)
      ) {
        const q = query(
          collection(db, "jobs"),
          where("disabled", "==", false),
          where("startingTime", ">", dayjs().unix() + 3600)
        );

        const querySnapshot = await getDocs(q);
        const allJobs = [];
        querySnapshot.forEach((doc) => {
          allJobs.push({
            id: doc.id,
            jobName: doc.data().jobName,
            salary: doc.data().salary,
            currency: doc.data().currency,
            workersCount: doc.data().workersCount,
            currentWorkers: doc.data().currentWorkers,
            workingPlace: doc.data().workingPlace,
            comment: doc.data().comment,
            startingTime: doc.data().startingTime,
            endingTime: doc.data().endingTime,
            line: doc.data().line,
            station: doc.data().station,
            userID: doc.data().userID,
            userName: doc.data().userName,
            userImage: doc.data().userImage,
            userEmail: doc.data().userEmail,
            userPhoneNumber: doc.data().userPhoneNumber,
            country: doc.data().country,
            region: doc.data().region,
            userWorkedWith: doc.data().userWorkedWith,
            uploadedTime: doc.data().uploadedTime,
            deleted: doc.data().deleted,
            disabled: doc.data().disabled,
          });
        });
        dispatch(setJobs(allJobs));
      } else if (!waiting && user?.country && !user?.currentJob) {
        const q = query(
          collection(db, "jobs"),
          where("country", "==", user.country),
          where("region", "==", user.region),
          where("startingTime", ">", dayjs().unix() + 3600),
          where("disabled", "==", false)
        );
        const querySnapshot = await getDocs(q);
        const allJobs = [];

        querySnapshot.forEach((doc) => {
          allJobs.push({
            id: doc.id,
            jobName: doc.data().jobName,
            salary: doc.data().salary,
            currency: doc.data().currency,
            workersCount: doc.data().workersCount,
            currentWorkers: doc.data().currentWorkers,
            workingPlace: doc.data().workingPlace,
            comment: doc.data().comment,
            startingTime: doc.data().startingTime,
            endingTime: doc.data().endingTime,
            line: doc.data().line,
            station: doc.data().station,
            userID: doc.data().userID,
            userName: doc.data().userName,
            userImage: doc.data().userImage,
            userEmail: doc.data().userEmail,
            userPhoneNumber: doc.data().userPhoneNumber,
            country: doc.data().country,
            region: doc.data().region,
            userWorkedWith: doc.data().userWorkedWith,
            uploadedTime: doc.data().uploadedTime,
            deleted: doc.data().deleted,
            disabled: doc.data().disabled,
          });
        });

        dispatch(setJobs(allJobs));
      }
    }

    getDataFromDB();
  }, [user?.region, user?.country, user?.currentJob, dispatch, waiting]);

  useEffect(() => {
    // Getting Homes
    async function getDataFromDB() {
      if (
        (!waiting && !auth?.currentUser?.uid) ||
        (!waiting && !user?.country)
      ) {
        const q = query(
          collection(db, "homes"),
          where("disabled", "==", false),
          where("uploadedTime", ">", dayjs().unix() - 2592000)
        );
        const querySnapshot = await getDocs(q);
        let allHomes = [];

        querySnapshot.forEach((doc) => {
          allHomes.push({
            id: doc.id,
            rent: doc.data().rent,
            currency: doc.data().currency,
            location: doc.data().location,
            comment: doc.data().comment,
            image1: doc.data().image1,
            image2: doc.data().image2,
            image3: doc.data().image3,
            image4: doc.data().image4,
            line: doc.data().line,
            station: doc.data().station,
            userID: doc.data().userID,
            userName: doc.data().userName,
            userImage: doc.data().userImage,
            userEmail: doc.data().userEmail,
            userPhoneNumber: doc.data().userPhoneNumber,
            userRegion: doc.data().userRegion,
            country: doc.data().country,
            region: doc.data().region,
            uploadedTime: doc.data().uploadedTime,
            deleted: doc.data().deleted,
            disabled: doc.data().disabled,
          });
        });

        let highKeyArray = [];
        for (let i = 0; i < allHomes.length; i++) {
          let highest = null;
          let highKey = null;
          allHomes.map((home, index) => {
            if (highest) {
              if (
                home.uploadedTime > highest &&
                !highKeyArray.includes(index)
              ) {
                highKey = index;
                highest = home.uploadedTime;
              }
            } else if (!highKeyArray.includes(index)) {
              highKey = index;
              highest = home.uploadedTime;
            }
            return null;
          });
          highKeyArray.push(highKey);
        }

        const allHomesFiltered = [];
        highKeyArray.map((index) => allHomesFiltered.push(allHomes[index]));

        dispatch(setHomes(allHomesFiltered));
      } else if (!waiting && user?.country) {
        const q = query(
          collection(db, "homes"),
          where("country", "==", user.country),
          where("region", "==", user.region),
          where("disabled", "==", false),
          where("uploadedTime", ">", dayjs().unix() - 2592000)
        );
        const querySnapshot = await getDocs(q);
        let allHomes = [];

        querySnapshot.forEach((doc) => {
          allHomes.push({
            id: doc.id,
            rent: doc.data().rent,
            currency: doc.data().currency,
            location: doc.data().location,
            comment: doc.data().comment,
            image1: doc.data().image1,
            image2: doc.data().image2,
            image3: doc.data().image3,
            image4: doc.data().image4,
            line: doc.data().line,
            station: doc.data().station,
            userID: doc.data().userID,
            userName: doc.data().userName,
            userImage: doc.data().userImage,
            userEmail: doc.data().userEmail,
            userPhoneNumber: doc.data().userPhoneNumber,
            userRegion: doc.data().userRegion,
            country: doc.data().country,
            region: doc.data().region,
            uploadedTime: doc.data().uploadedTime,
            deleted: doc.data().deleted,
            disabled: doc.data().disabled,
          });
        });

        let highKeyArray = [];
        for (let i = 0; i < allHomes.length; i++) {
          let highest = null;
          let highKey = null;
          allHomes.map((home, index) => {
            if (highest) {
              if (
                home.uploadedTime > highest &&
                !highKeyArray.includes(index)
              ) {
                highKey = index;
                highest = home.uploadedTime;
              }
            } else if (!highKeyArray.includes(index)) {
              highKey = index;
              highest = home.uploadedTime;
            }
            return null;
          });
          highKeyArray.push(highKey);
        }

        const allHomesFiltered = [];
        highKeyArray.map((index) => allHomesFiltered.push(allHomes[index]));

        dispatch(setHomes(allHomesFiltered));
      }
    }

    getDataFromDB();
  }, [user?.region, user?.country, dispatch, waiting]);

  useEffect(() => {
    //Listening for My Added Jobs
    if (auth?.currentUser?.uid) {
      const q = query(
        collection(db, "jobs"),
        where("userID", "==", auth?.currentUser?.uid),
        where("disabled", "==", false),
        where("endingTime", ">", dayjs().unix())
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let allJobs = [];
        snapshot.forEach((doc) => {
          allJobs.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        let highKeyArray = [];
        for (let i = 0; i < allJobs.length; i++) {
          let highest = null;
          let highKey = null;
          allJobs.map((job, index) => {
            if (highest) {
              if (job.startingTime < highest && !highKeyArray.includes(index)) {
                highKey = index;
                highest = job.startingTime;
              }
            } else if (!highKeyArray.includes(index)) {
              highKey = index;
              highest = job.startingTime;
            }
            return null;
          });
          highKeyArray.push(highKey);
        }

        const allJobsFiltered = [];
        highKeyArray.map((index) => allJobsFiltered.push(allJobs[index]));

        dispatch(setMyAddedJobs(allJobsFiltered));
      });

      return () => {
        unsubscribe();
      };
    }
  }, [dispatch, UserCurrent]);

  useEffect(() => {
    //Listening for My Added Homes
    if (auth?.currentUser?.uid) {
      const q = query(
        collection(db, "homes"),
        where("userID", "==", auth?.currentUser?.uid),
        where("disabled", "==", false)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const allHomes = [];
        snapshot.forEach((doc) => {
          allHomes.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        let highKeyArray = [];
        for (let i = 0; i < allHomes.length; i++) {
          let highest = null;
          let highKey = null;
          allHomes.map((home, index) => {
            if (highest) {
              if (
                home.uploadedTime > highest &&
                !highKeyArray.includes(index)
              ) {
                highKey = index;
                highest = home.uploadedTime;
              }
            } else if (!highKeyArray.includes(index)) {
              highKey = index;
              highest = home.uploadedTime;
            }
            return null;
          });
          highKeyArray.push(highKey);
        }

        const allHomesFiltered = [];
        highKeyArray.map((index) => allHomesFiltered.push(allHomes[index]));

        dispatch(setMyAddedHomes(allHomesFiltered));
      });

      return () => {
        unsubscribe();
      };
    }
  }, [dispatch, UserCurrent]);

  useEffect(() => {
    //Listening to Messaging Users
    if (chatRooms) {
      chatRooms.map((chatRoom) => {
        const unsubscribe = onSnapshot(
          doc(db, "users", chatRoom.messagingUser),
          (docSnap) => {
            if (docSnap.exists()) {
              dispatch(
                setMessagingUsers({
                  id: chatRoom.id,
                  messagingUser: {
                    uid: docSnap.id,
                    image: docSnap.data().image,
                    username: docSnap.data().username,
                    lastSeen: docSnap.data().lastSeen,
                    blockedUsers: docSnap.data().blockedUsers,
                  },
                })
              );
            }
          }
        );

        return () => {
          unsubscribe();
        };
      });
    }
  }, [chatRooms, dispatch]);

  useEffect(() => {
    //Listening to Messages
    if (chatRooms) {
      chatRooms.map((chatRoom) => {
        const q = query(
          collection(db, "chats", chatRoom.id, "messages"),
          orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const allMessages = [];

          snapshot.forEach((doc) => {
            allMessages.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          dispatch(
            setChats({
              id: chatRoom.id,
              messages: allMessages,
            })
          );
        });

        return () => {
          unsubscribe();
        };
      });
    }
  }, [dispatch, chatRooms]);

  useEffect(() => {
    //Listening to ChatRooms
    if (auth?.currentUser?.uid) {
      const q = query(
        collection(db, "chats"),
        where("users", "array-contains", auth.currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const allChats = [];

        snapshot.forEach((doc) => {
          allChats.push({
            id: doc.id,
            messagingUser: doc
              .data()
              .users.filter((dbUser) => dbUser !== auth.currentUser.uid)[0],
          });
        });

        dispatch(setChatRooms(allChats));
      });

      return () => {
        unsubscribe();
      };
    }
  }, [dispatch, UserCurrent]);

  useEffect(() => {
    //Listening to User
    onAuthStateChanged(auth, async (userInfo) => {
      if (userInfo) {
        const unsub = onSnapshot(doc(db, "users", userInfo.uid), (docSnap) => {
          dispatch(
            login({
              uid: userInfo.uid,
              email: docSnap.data().email,
              image: docSnap.data().image,
              username: docSnap.data().username,
              phoneNumber: docSnap.data().phoneNumber,
              country: docSnap.data().country,
              region: docSnap.data().region,
              emailVerified: userInfo.emailVerified,
              workedWith: docSnap.data().workedWith,
              currentJob: docSnap.data().currentJob,
              homeAdds: docSnap.data().homeAdds,
              jobAdds: docSnap.data().jobAdds,
              workedJobs: docSnap.data().workedJobs,
              bgImage: docSnap.data().bgImage,
              blockedUsers: docSnap.data().blockedUsers,
            })
          );
          dispatch(setWaiting(false));
        });

        return () => {
          unsub();
        };
      } else {
        dispatch(setWaiting(false));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    //Getting TimedOutJobs
    if (auth?.currentUser?.uid) {
      const q = query(
        collection(db, "jobs"),
        where("userID", "==", auth.currentUser.uid),
        where("disabled", "==", false),
        where("endingTime", "<", dayjs().unix())
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(async (docSnap) => {
          await updateDoc(doc(db, "jobs", docSnap.id), {
            disabled: true,
          });
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            workedWith: user.workedWith + docSnap.data().currentWorkers.length,
          });
          await addDoc(collection(db, "notifications"), {
            userID: docSnap.data().userID,
            userImage: docSnap.data().userImage,
            userName: docSnap.data().userName,
            notifyName: docSnap.data().jobName,
            notifyID: docSnap.id,
            message: "Bergan e'loningiz muvaffaqiyat tugatildi!",
            to: docSnap.data().userID,
            from: "jobs",
            messageType: "mySuccess",
            seen: false,
            timestamp: docSnap.data().endingTime,
          });
        });
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user?.workedWith, UserCurrent]);

  useEffect(() => {
    //Getting TimedOutHomes
    if (auth?.currentUser?.uid) {
      const q = query(
        collection(db, "homes"),
        where("userID", "==", auth.currentUser.uid),
        where("deleted", "==", false),
        where("uploadedTime", "<", dayjs().unix() - 2592000)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(async (docSnap) => {
          await updateDoc(doc(db, "homes", docSnap.id), {
            disabled: true,
            deleted: true,
          });
          await addDoc(collection(db, "notifications"), {
            userID: docSnap.data().userID,
            userImage: docSnap.data().userImage,
            userName: docSnap.data().userName,
            notifyName: docSnap.data().location,
            notifyID: docSnap.id,
            message:
              "E'lon berganingizga 30 kun bo'lganligi sababli ushbu e'lon o'chirib tashlandi!",
            to: docSnap.data().userID,
            from: "homes",
            messageType: "deletedHome",
            seen: false,
            timestamp: docSnap.data().uploadedTime + 2592000,
          });
        });
      });

      return () => {
        unsubscribe();
      };
    }
  }, [UserCurrent]);

  useEffect(() => {
    //Listening to Notifications
    if (auth?.currentUser?.uid) {
      const q = query(
        collection(db, "notifications"),
        where("to", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let allNotifications = [];
        snapshot.forEach((doc) => {
          allNotifications.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        dispatch(setNotifications(allNotifications));
      });

      return () => {
        unsubscribe();
      };
    }
  }, [dispatch, UserCurrent]);

  return (
    <div className="app">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Header />
        <Routes>
          <Route path="*" element={<Loading />} />
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobInfo />} />
          <Route path="/homes" element={<Homes />} />
          {user && <Route path="/notifications" element={<Notifications />} />}
          {user && <Route path="/add" element={<Add />} />}
          {user && <Route path="/add/newjob" element={<AddNewJob />} />}
          {user && <Route path="/add/newhome" element={<AddNewHome />} />}
          {user && <Route path="/chats" element={<Chat />} />}
          {user && <Route path="/chats/:uid" element={<ChatRoom />} />}
          {user && (
            <Route path="/chats/blockedUsers" element={<BlockedUsersChat />} />
          )}
          {user && <Route path="/profile" element={<Profile />} />}
          {user && (
            <Route path="/profile/jobsHistory" element={<JobsHistory />} />
          )}
          {user && (
            <Route path="/profile/homesHistory" element={<HomesHistory />} />
          )}
          <Route path="/signUpwithEmail" element={<SignUpwithEmail />} />
          <Route path="/confirmEmail" element={<ConfirmEmail />} />
          {!user && (
            <Route path="/signInwithEmail" element={<SignInwithEmail />} />
          )}
          {!user && <Route path="/signUp" element={<SignUp />} />}
          <Route path="/loading/:path" element={<Loading />} />
        </Routes>
      </LocalizationProvider>
      <BottomNavigation />
    </div>
  );
}

export default App;
