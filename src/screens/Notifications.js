import React from "react";
import ExitHeader from "../components/ExitHeader";
import NotifyCard from "../components/NotifyCard";
import { selectNotifications } from "../features/notificationsSlice";
import { useSelector } from "react-redux";

function Notifications() {
  const notifications = useSelector(selectNotifications);

  return (
    <div>
      <ExitHeader screenName="Bildirishnomalar" />
      {notifications.map((item, index) => (
        <NotifyCard
          id={item.id}
          key={index}
          userID={item.userID}
          userImage={item.userImage}
          userName={item.userName}
          notifyName={item.notifyName}
          message={item.message}
          messageType={item.messageType}
          timestamp={item.timestamp}
          from={item.from}
          seen={item.seen}
        />
      ))}
    </div>
  );
}

export default Notifications;
