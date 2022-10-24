import dayjs from "dayjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ExitHeader from "../components/ExitHeader";
import JobCard from "../components/jobsScreen/JobCard";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";

function JobsHistory() {
  const [showMyAdds, setShowMyAdds] = useState(false);
  const [iWorkedJobs, setIWorkedJobs] = useState([]);
  const [iAddedJobs, setIAddedJobs] = useState([]);

  const user = useSelector(selectUser);

  useEffect(() => {
    const getIAddedJobs = async () => {
      const q1 = query(
        collection(db, "jobs"),
        where("userID", "==", user.uid),
        where("deleted", "==", true)
      );

      const q2 = query(
        collection(db, "jobs"),
        where("userID", "==", user.uid),
        where("deleted", "==", false),
        where("endingTime", "<", dayjs().unix())
      );
      const querySnapshotDeleted = await getDocs(q1);
      const querySnapshotTimeOuted = await getDocs(q2);

      const allJobs = [];

      querySnapshotDeleted.forEach((doc) => {
        allJobs.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      querySnapshotTimeOuted.forEach((doc) => {
        allJobs.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      let highKeyArray = [];
      for (let i = 0; i < allJobs.length; i++) {
        let highest = null;
        let highKey = null;
        allJobs.map((job, index) => {
          if (highest) {
            if (job.startingTime > highest && !highKeyArray.includes(index)) {
              highKey = index;
              highest = job.startingTime;
            }
          } else if (!highKeyArray.includes(index)) {
            highKey = index;
            highest = job.startingTime;
          }
          return null;
        });
        highKeyArray.push(highKey);
      }

      const allJobsFiltered = [];
      highKeyArray.map((index) => allJobsFiltered.push(allJobs[index]));

      setIAddedJobs(allJobsFiltered);
    };

    const getIWorkedJobs = async () => {
      const q1 = query(
        collection(db, "jobs"),
        where("currentWorkers", "array-contains", user.uid),
        where("deleted", "==", true)
      );

      const q2 = query(
        collection(db, "jobs"),
        where("currentWorkers", "array-contains", user.uid),
        where("deleted", "==", false),
        where("endingTime", "<", dayjs().unix())
      );

      const querySnapshotDeleted = await getDocs(q1);
      const querySnapshotTimeOuted = await getDocs(q2);

      const allJobs = [];

      querySnapshotDeleted.forEach((doc) => {
        allJobs.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      querySnapshotTimeOuted.forEach((doc) => {
        allJobs.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      let highKeyArray = [];
      for (let i = 0; i < allJobs.length; i++) {
        let highest = null;
        let highKey = null;
        allJobs.map((job, index) => {
          if (highest) {
            if (job.startingTime > highest && !highKeyArray.includes(index)) {
              highKey = index;
              highest = job.startingTime;
            }
          } else if (!highKeyArray.includes(index)) {
            highKey = index;
            highest = job.startingTime;
          }
          return null;
        });
        highKeyArray.push(highKey);
      }

      const allJobsFiltered = [];
      highKeyArray.map((index) => allJobsFiltered.push(allJobs[index]));

      setIWorkedJobs(allJobsFiltered);
    };

    getIAddedJobs();
    getIWorkedJobs();
  }, [user]);

  return (
    <div className="pb-1">
      <ExitHeader screenName="Ishlar tarixi" />
      <div className="fixed w-full z-30 flex items-center">
        <button
          onClick={() => setShowMyAdds(false)}
          className={`flex-1 pb-3 pt-4 font-bold bg-gray-200 -mt-1 ${
            showMyAdds
              ? "border-gray-200 border-b-2"
              : "border-gray-400 border-b-2"
          }`}
        >
          Ishlaganlarim
        </button>
        <button
          onClick={() => setShowMyAdds(true)}
          className={`flex-1 pb-3 pt-4 font-bold bg-gray-200 -mt-1 ${
            showMyAdds
              ? "border-gray-400 border-b-2"
              : "border-gray-200 border-b-2"
          }`}
        >
          Bergan e'lonlarim
        </button>
      </div>
      <div className="pt-[50px]">
        {showMyAdds
          ? iAddedJobs?.map(
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
                  deleted,
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
                  deleted={deleted}
                />
              )
            )
          : iWorkedJobs?.map(
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
                  deleted,
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
                  deleted={deleted}
                />
              )
            )}
      </div>
    </div>
  );
}

export default JobsHistory;
