import React from "react";
import ExitHeader from "../components/ExitHeader";
import NotifyCard from "../components/NotifyCard";
import { selectNotifications } from "../features/notificationsSlice";
import { useSelector } from "react-redux";

function Notifications() {
  const notifications = useSelector(selectNotifications);

  return (
    <div className="pb-1">
      <ExitHeader screenName="Bildirishnomalar" />
      {notifications.length === 0 ? (
        <div className="flex items-center justify-center w-full h-screen -mt-16">
          <p className="font-[600] text-xl">Bildirishnomalar yo'q</p>
        </div>
      ) : (
        notifications.map((item, index) => (
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
            notifyID={item.notifyID}
          />
        ))
      )}
    </div>
  );
}

export default Notifications;
