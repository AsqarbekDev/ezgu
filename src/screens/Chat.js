import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ChatCard from "../components/chatsScreen/ChatCard";
import DefaultLoadingModul from "../components/DefaultLoadingModul";
import { selectChats, selectWaitingChat } from "../features/chatsSlice";
import { selectLanguage } from "../features/languageSlice";
import { selectTheme } from "../features/themeSlice";
import { selectUser } from "../features/userSlice";

function Chat() {
  const chats = useSelector(selectChats);
  const waitingChat = useSelector(selectWaitingChat);
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);
  const user = useSelector(selectUser);
  const [chatsArray, setChatsArray] = useState([]);

  useEffect(() => {
    let highKeyArray = [];
    for (let i = 0; i < Object.keys(chats).length; i++) {
      let highest = null;
      let highKey = null;
      Object.keys(chats).map((key) => {
        if (highest) {
          if (
            chats[key].messages[chats[key].messages.length - 1]?.timestamp >
              highest &&
            !highKeyArray.includes(key)
          ) {
            highKey = key;
            highest =
              chats[key].messages[chats[key].messages.length - 1]?.timestamp;
          }
        } else if (!highKeyArray.includes(key)) {
          highKey = key;
          highest =
            chats[key].messages[chats[key].messages.length - 1]?.timestamp;
        }
        return null;
      });
      highKeyArray.push(highKey);
    }
    setChatsArray(highKeyArray);
  }, [chats]);

  return (
    <div className="pb-12 xl:pb-1">
      {waitingChat ? (
        <DefaultLoadingModul />
      ) : chatsArray.length === 0 ? (
        <div
          style={{ color: theme.textColor }}
          className="flex items-center justify-center w-full h-screen -mt-14 -mb-14"
        >
          <p className="font-[600] text-xl text-center mx-6">
            {language.chats.noItem}
          </p>
        </div>
      ) : (
        chatsArray.map(
          (key, index) =>
            chats[key]?.deleted === false && (
              <ChatCard
                key={index}
                id={key}
                uid={chats[key].messagingUser.uid}
                username={chats[key].messagingUser.username}
                userImage={chats[key].messagingUser.image}
                lastMessage={
                  chats[key].messages[chats[key].messages.length - 1]?.message
                }
                lastImage={
                  chats[key].messages[chats[key].messages.length - 1]?.image
                }
                timestamp={
                  chats[key].messages[chats[key].messages.length - 1]?.timestamp
                }
                seen={chats[key].messages[chats[key].messages.length - 1]?.seen}
                mine={
                  chats[key].messages[chats[key].messages.length - 1]?.uid ===
                  user.uid
                    ? true
                    : false
                }
                lastSeen={chats[key].messagingUser.lastSeen}
                showAvatar={
                  !chats[key]?.messagingUser?.blockedUsers?.includes(
                    user.uid
                  ) &&
                  !user.blockedUsers.includes(chats[key]?.messagingUser.uid)
                    ? true
                    : false
                }
              />
            )
        )
      )}
    </div>
  );
}

export default Chat;
