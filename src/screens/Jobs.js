import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import JobCard from "../components/jobsScreen/JobCard";
import DefaultLoadingModul from "../components/DefaultLoadingModul";
import { selectJobs } from "../features/jobsSlice";
import { selectUser, selectWaiting } from "../features/userSlice";
import { useNavigate } from "react-router-dom";

function Jobs() {
  const user = useSelector(selectUser);
  const jobs = useSelector(selectJobs);
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
      ) : (
        <div className="pb-12">
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
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Jobs;
