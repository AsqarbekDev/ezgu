import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Jobs from "./screens/Jobs";
import Homes from "./screens/Homes";
import Add from "./screens/Add";
import Chat from "./screens/Chat";
import Profile from "./screens/Profile";
import BottomNavigation from "./components/BottomNavigation";
import Header from "./components/Header";
import AddNewJob from "./screens/AddNewJob";
import AddNewHome from "./screens/AddNewHome";
import SignUp from "./screens/SignUp";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser, setWaiting } from "./features/userSlice";
import SignUpwithEmail from "./screens/SignUpwithEmail";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import {
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
  selectMessagingUsers,
  setChatRooms,
  setChats,
  setMessagingUsers,
} from "./features/chatsSlice";

function App() {
  const user = useSelector(selectUser);
  const chatRooms = useSelector(selectChatRooms);
  const messagingUsers = useSelector(selectMessagingUsers);
  const dispatch = useDispatch();

  useEffect(() => {
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
    if (messagingUsers) {
      Object.keys(messagingUsers).map((key) => {
        const q = query(
          collection(db, "chats", key, "messages"),
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
              id: key,
              messagingUser: messagingUsers[key],
              messages: allMessages,
            })
          );
        });

        return () => {
          unsubscribe();
        };
      });
    }
  }, [dispatch, messagingUsers]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "chats"),
        where("users", "array-contains", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const allChats = [];

        snapshot.forEach((doc) => {
          allChats.push({
            id: doc.id,
            messagingUser: doc
              .data()
              .users.filter((dbUser) => dbUser !== user.uid)[0],
          });
        });

        dispatch(setChatRooms(allChats));
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user, dispatch]);

  useEffect(() => {
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
    if (auth.currentUser) {
      const getTimedOutJobs = async () => {
        const q = query(
          collection(db, "jobs"),
          where("userID", "==", auth.currentUser.uid),
          where("disabled", "==", false),
          where("endingTime", "<", dayjs().unix())
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnap) => {
          await updateDoc(doc(db, "jobs", docSnap.id), {
            disabled: true,
          });
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            workedWith: user.workedWith + docSnap.data().currentWorkers.length,
          });
        });
      };

      const getTimedOutHomes = async () => {
        const q = query(
          collection(db, "homes"),
          where("userID", "==", auth.currentUser.uid),
          where("deleted", "==", false),
          where("uploadedTime", "<", dayjs().unix() - 2592000)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnap) => {
          await updateDoc(doc(db, "homes", docSnap.id), {
            disabled: true,
            deleted: true,
          });
        });
      };
      getTimedOutJobs();
      getTimedOutHomes();
    }
  }, [user?.workedWith]);

  return (
    <div className="app">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Header />
        <Routes>
          <Route path="*" element={<Loading />} />
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobInfo />} />
          <Route path="/homes" element={<Homes />} />
          {user && <Route path="/add" element={<Add />} />}
          {user && <Route path="/add/newjob" element={<AddNewJob />} />}
          {user && <Route path="/add/newhome" element={<AddNewHome />} />}
          {user && <Route path="/chats" element={<Chat />} />}
          {user && <Route path="/chats/:uid" element={<ChatRoom />} />}
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
        <BottomNavigation />
      </LocalizationProvider>
    </div>
  );
}

export default App;
