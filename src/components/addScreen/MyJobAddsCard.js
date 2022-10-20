import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import JobCard from "../jobsScreen/JobCard";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import dayjs from "dayjs";

function MyJobAddsCard() {
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "jobs"),
        where("userID", "==", user.uid),
        where("disabled", "==", false)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let allJobs = [];
        snapshot.forEach((doc) => {
          allJobs.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        allJobs = allJobs.filter((job) => job.endingTime > dayjs().unix());
        setJobs(allJobs);
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
        <p className="font-[700] text-sm">
          Ish berish uchun e'lonlaringiz soni {jobs.length}ta
        </p>
        {open ? (
          <ExpandLessIcon className="-mb-1" />
        ) : (
          <ExpandMoreIcon className="-mb-1" />
        )}
      </div>
      <div>
        {open &&
          jobs?.map(
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
    </div>
  );
}

export default MyJobAddsCard;
