import dayjs from "dayjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import DefaultLoadingModul from "../components/DefaultLoadingModul";
import HomeCard from "../components/homesScreen/HomeCard";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";

function HomesHistory() {
  const user = useSelector(selectUser);
  const [homes, setHomes] = useState(null);

  useEffect(() => {
    const getHomesHistory = async () => {
      const q1 = query(
        collection(db, "homes"),
        where("userID", "==", user.uid),
        where("deleted", "==", true)
      );
      const q2 = query(
        collection(db, "homes"),
        where("userID", "==", user.uid),
        where("deleted", "==", false),
        where("uploadedTime", "<", dayjs().unix() - 2592000)
      );

      const querySnapshotDeleted = await getDocs(q1);
      const querySnapshotTimeOuted = await getDocs(q2);

      const allHomes = [];

      querySnapshotDeleted.forEach((doc) => {
        allHomes.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      querySnapshotTimeOuted.forEach((doc) => {
        allHomes.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setHomes(allHomes);
    };

    getHomesHistory();
  }, [user.uid]);
  return (
    <div>
      {!homes ? (
        <DefaultLoadingModul />
      ) : (
        <div className="pb-12">
          {homes?.map(
            (
              {
                id,
                userImage,
                userName,
                userID,
                image1,
                image2,
                image3,
                image4,
                rent,
                location,
                line,
                station,
                comment,
                uploadedTime,
                userPhoneNumber,
              },
              index
            ) => (
              <HomeCard
                key={index}
                id={id}
                userImage={userImage}
                userPhoneNumber={userPhoneNumber}
                userName={userName}
                rent={rent}
                location={location}
                line={line}
                station={station}
                comment={comment}
                uploadedTime={uploadedTime}
                image1={image1}
                image2={image2}
                image3={image3}
                image4={image4}
                userID={userID}
                history
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default HomesHistory;
