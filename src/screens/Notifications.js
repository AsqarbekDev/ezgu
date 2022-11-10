import React from "react";
import ExitHeader from "../components/ExitHeader";
import NotifyCard from "../components/NotifyCard";
import { selectNotifications } from "../features/notificationsSlice";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";

function Notifications() {
  const notifications = useSelector(selectNotifications);
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  return (
    <div className="pb-1">
      <ExitHeader screenName={language.notifications.headerText} />
      {notifications.length === 0 ? (
        <div
          style={{ color: theme.textColor }}
          className="flex items-center justify-center w-full h-screen -mt-16"
        >
          <p className="font-[600] text-xl text-center">
            {language.notifications.noItem}
          </p>
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
