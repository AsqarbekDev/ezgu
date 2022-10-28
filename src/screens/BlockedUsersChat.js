import { collection, getDocs, query, where } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BannedUserCard from "../components/chatsScreen/BannedUserCard";
import ExitHeader from "../components/ExitHeader";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";

function BlockedUsersChat() {
  const user = useSelector(selectUser);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [blockedUsers] = useState(user.blockedUsers);

  useEffect(() => {
    const getBannedUsers = async () => {
      const q = query(
        collection(db, "users"),
        where("uid", "in", blockedUsers)
      );
      const querySnapshot = await getDocs(q);
      const usersArray = [];
      querySnapshot.forEach((doc) => {
        usersArray.push(doc.data());
      });
      setBannedUsers(usersArray);
    };

    if (blockedUsers.length > 0) {
      getBannedUsers();
    }
  }, [blockedUsers]);

  return (
    <div>
      <ExitHeader screenName="Bloklangan foydalanuvchilar" />
      {bannedUsers.map((item, index) => (
        <BannedUserCard key={index} uid={item.uid} username={item.username} />
      ))}
    </div>
  );
}

export default BlockedUsersChat;
