import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HomeCard from "../homesScreen/HomeCard";
import { useSelector } from "react-redux";
import { selectMyAddedHomes } from "../../features/homesSlice";
import { selectTheme } from "../../features/themeSlice";
import { selectLanguage } from "../../features/languageSlice";

function MyHomeAddsCard() {
  const [open, setOpen] = useState(false);
  const homes = useSelector(selectMyAddedHomes);
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  return (
    <div className="mt-1">
      <div
        onClick={() => setOpen(!open)}
        style={{
          backgroundColor: theme.addScreenMoreCom,
          color: theme.textColor,
        }}
        className="cursor-pointer flex items-center pt-1 pb-2 justify-center"
      >
        <p className="font-[700] text-sm -mb-1">
          {language.add.myHomeAdds} {homes.length}
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
                region,
                currency,
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
                region={region}
                currency={currency}
              />
            )
          )}
      </div>
    </div>
  );
}

export default MyHomeAddsCard;
