import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import JobCard from "../jobsScreen/JobCard";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useSelector } from "react-redux";
import { selectMyAddedJobs } from "../../features/jobsSlice";
import { selectTheme } from "../../features/themeSlice";
import { selectLanguage } from "../../features/languageSlice";

function MyJobAddsCard() {
  const [open, setOpen] = useState(false);
  const myAddedJobs = useSelector(selectMyAddedJobs);
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
          {language.add.myJobAdds} {myAddedJobs.length}
        </p>
        {open ? (
          <ExpandLessIcon className="-mb-1" />
        ) : (
          <ExpandMoreIcon className="-mb-1" />
        )}
      </div>
      <div>
        {open &&
          myAddedJobs?.map(
            (
              {
                id,
                userImage,
                userName,
                jobName,
                salary,
                region,
                workersCount,
                startingTime,
                endingTime,
                userWorkedWith,
                currentWorkers,
                currency,
              },
              index
            ) => (
              <JobCard
                key={index}
                id={id}
                userImage={userImage}
                userName={userName}
                jobName={jobName}
                salary={salary}
                region={region}
                workersCount={workersCount}
                startingTime={startingTime}
                endingTime={endingTime}
                userWorkedWith={userWorkedWith}
                currentWorkers={currentWorkers}
                currency={currency}
              />
            )
          )}
      </div>
    </div>
  );
}

export default MyJobAddsCard;
