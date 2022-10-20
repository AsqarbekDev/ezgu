import dayjs from "dayjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
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
      const q = query(
        collection(db, "jobs"),
        where("userID", "==", user.uid),
        where("endingTime", "<", dayjs().unix())
      );
      const querySnapshot = await getDocs(q);

      const allJobs = [];
      querySnapshot.forEach((doc) => {
        allJobs.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setIAddedJobs(allJobs);
    };

    const getIWorkedJobs = async () => {
      const q = query(
        collection(db, "jobs"),
        where("currentWorkers", "array-contains", user.uid),
        where("endingTime", "<", dayjs().unix())
      );
      const querySnapshot = await getDocs(q);

      const allJobs = [];
      querySnapshot.forEach((doc) => {
        allJobs.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setIWorkedJobs(allJobs);
    };

    getIAddedJobs();
    getIWorkedJobs();
  }, [user]);

  return (
    <div className="pb-10">
      <div className="fixed w-full z-30 flex items-center">
        <button
          onClick={() => setShowMyAdds(false)}
          className={`flex-1 pb-1 pt-2 bg-gray-200 -mt-1 ${
            showMyAdds
              ? "border-gray-200 border-b-2"
              : "border-gray-400 border-b-2"
          }`}
        >
          Ishlaganlarim
        </button>
        <button
          onClick={() => setShowMyAdds(true)}
          className={`flex-1 pb-1 pt-2 bg-gray-200 -mt-1 ${
            showMyAdds
              ? "border-gray-400 border-b-2"
              : "border-gray-200 border-b-2"
          }`}
        >
          Bergan e'lonlarim
        </button>
      </div>
      <div className="pt-[34px]">
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
