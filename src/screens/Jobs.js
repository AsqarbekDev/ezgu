import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import JobCard from "../components/jobsScreen/JobCard";
import DefaultLoadingModul from "../components/DefaultLoadingModul";
import { selectJobs } from "../features/jobsSlice";
import { selectUser, selectWaiting } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";

function Jobs() {
  const user = useSelector(selectUser);
  const jobs = useSelector(selectJobs);
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);
  const waiting = useSelector(selectWaiting);
  const navigate = useNavigate();

  useEffect(() => {
    if (!waiting && user?.currentJob) {
      navigate(`/jobs/${user.currentJob}`);
    }
  }, [navigate, user?.currentJob, waiting]);

  return (
    <div>
      {!jobs ? (
        <DefaultLoadingModul />
      ) : jobs.length === 0 ? (
        <div
          style={{ color: theme.textColor }}
          className="flex items-center justify-center w-full h-screen -mt-14"
        >
          <p className="font-[600] text-xl text-center mx-6">
            {language.jobs.noItem}
          </p>
        </div>
      ) : (
        <div className="pb-12 xl:pb-1">
          {jobs?.map(
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
      )}
    </div>
  );
}

export default Jobs;
