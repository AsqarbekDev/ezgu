import HomeCard from "../components/homesScreen/HomeCard";
import React, { useEffect } from "react";
import DefaultLoadingModul from "../components/DefaultLoadingModul";
import { useDispatch, useSelector } from "react-redux";
import { selectHomes, setHomes } from "../features/homesSlice";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { selectUser, selectWaiting } from "../features/userSlice";
import dayjs from "dayjs";
import BottomNavigation from "../components/BottomNavigation";

function Homes() {
  const user = useSelector(selectUser);
  const homes = useSelector(selectHomes);
  const waiting = useSelector(selectWaiting);
  const dispatch = useDispatch();

  useEffect(() => {
    if ((!waiting && !user) || (!waiting && !user?.country)) {
      const q = query(collection(db, "homes"), where("disabled", "==", false));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let allHomes = [];

        snapshot.forEach((doc) => {
          allHomes.push({
            id: doc.id,
            rent: doc.data().rent,
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
            country: doc.data().country,
            region: doc.data().region,
            uploadedTime: doc.data().uploadedTime,
          });
        });

        allHomes = allHomes.filter(
          (home) => home.uploadedTime > dayjs().unix() - 2592000
        );
        dispatch(setHomes(allHomes));
      });
      return () => {
        unsubscribe();
      };
    } else if (!waiting && user?.country) {
      const q = query(
        collection(db, "homes"),
        where("country", "==", user.country),
        where("region", "==", user.region),
        where("disabled", "==", false)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let allHomes = [];

        snapshot.forEach((doc) => {
          allHomes.push({
            id: doc.id,
            rent: doc.data().rent,
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
            country: doc.data().country,
            region: doc.data().region,
            uploadedTime: doc.data().uploadedTime,
          });
        });

        allHomes = allHomes.filter(
          (home) => home.uploadedTime > dayjs().unix() - 2592000
        );
        dispatch(setHomes(allHomes));
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user?.region, user?.country, dispatch, user, waiting]);

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
              />
            )
          )}
        </div>
      )}
      <BottomNavigation />
    </div>
  );
}

export default Homes;
