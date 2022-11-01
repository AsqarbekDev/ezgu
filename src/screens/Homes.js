import HomeCard from "../components/homesScreen/HomeCard";
import React from "react";
import DefaultLoadingModul from "../components/DefaultLoadingModul";
import { useSelector } from "react-redux";
import { selectHomes } from "../features/homesSlice";
import { selectTheme } from "../features/themeSlice";

function Homes() {
  const homes = useSelector(selectHomes);
  const theme = useSelector(selectTheme);

  return (
    <div>
      {!homes ? (
        <DefaultLoadingModul />
      ) : homes.length === 0 ? (
        <div
          style={{ color: theme.textColor }}
          className="flex items-center justify-center w-full h-screen -mt-14"
        >
          <p className="font-[600] text-xl">
            Xozircha uy ijarasi uchun e'lonlar yo'q
          </p>
        </div>
      ) : (
        <div className="pb-14 xl:pb-1">
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
                userRegion,
                currency,
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
                userRegion={userRegion}
                currency={currency}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Homes;
