import HomeCard from "../components/homesScreen/HomeCard";
import React from "react";
import DefaultLoadingModul from "../components/DefaultLoadingModul";
import { useSelector } from "react-redux";
import { selectHomes } from "../features/homesSlice";

function Homes() {
  const homes = useSelector(selectHomes);

  return (
    <div>
      {!homes ? (
        <DefaultLoadingModul />
      ) : (
        <div className="pb-14">
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
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Homes;
