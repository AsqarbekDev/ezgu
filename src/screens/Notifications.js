import React from "react";
import { useEffect } from "react";
import ExitHeader from "../components/ExitHeader";
import NotifyCard from "../components/NotifyCard";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("to", "==", auth.currentUser.uid),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let allNotifications = [];
      snapshot.forEach((doc) => {
        allNotifications.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setNotifications(allNotifications);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <ExitHeader screenName="Bildirishnomalar" />
      {notifications.map((item, index) => (
        <NotifyCard
          key={index}
          userID={item.userID}
          userImage={item.userImage}
          userName={item.userName}
          notifyName={item.notifyName}
          message={item.message}
          messageType={item.messageType}
          timestamp={item.timestamp}
          from={item.from}
        />
      ))}
    </div>
  );
}

export default Notifications;
