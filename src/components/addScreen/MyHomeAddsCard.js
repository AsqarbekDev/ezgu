import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HomeCard from "../homesScreen/HomeCard";
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

function MyHomeAddsCard() {
  const [open, setOpen] = useState(false);
  const [homes, setHomes] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "homes"),
        where("userID", "==", user.uid),
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

        setHomes(allHomesFiltered);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  return (
    <div className="mt-1">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center pt-1 pb-2 justify-center bg-gray-200"
      >
        <p className="font-[700] text-sm -mb-[2px]">
          Uy ijaraga berish uchun e'lonlaringiz soni {homes.length}ta
        </p>
        {open ? (
          <ExpandLessIcon className="-mb-1" />
        ) : (
          <ExpandMoreIcon className="-mb-1" />
        )}
      </div>
      <div>
        {open &&
          homes?.map(
            (
              {
                id,
                userImage,
                userName,
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
                userID,
              },
              index
            ) => (
              <HomeCard
                key={index}
                id={id}
                userImage={userImage}
                userName={userName}
                userPhoneNumber={userPhoneNumber}
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
    </div>
  );
}

export default MyHomeAddsCard;
