import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobCard from "../components/jobsScreen/JobCard";
import DefaultLoadingModul from "../components/DefaultLoadingModul";
import { selectJobs, setJobs } from "../features/jobsSlice";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { selectUser, selectWaiting } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Jobs() {
  const user = useSelector(selectUser);
  const jobs = useSelector(selectJobs);
  const waiting = useSelector(selectWaiting);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function getDataFromDB() {
      if (!waiting && user?.currentJob) {
        navigate(`/jobs/${user.currentJob}`);
      } else if (
        (!waiting && !user) ||
        (!waiting && !user?.country && !user?.currentJob)
      ) {
        const q = query(
          collection(db, "jobs"),
          where("disabled", "==", false),
          where("startingTime", ">", dayjs().unix() + 3600)
        );

        const querySnapshot = await getDocs(q);
        const allJobs = [];
        querySnapshot.forEach((doc) => {
          allJobs.push({
            id: doc.id,
            jobName: doc.data().jobName,
            salary: doc.data().salary,
            workersCount: doc.data().workersCount,
            currentWorkers: doc.data().currentWorkers,
            workingPlace: doc.data().workingPlace,
            comment: doc.data().comment,
            startingTime: doc.data().startingTime,
            endingTime: doc.data().endingTime,
            line: doc.data().line,
            station: doc.data().station,
            userID: doc.data().userID,
            userName: doc.data().userName,
            userImage: doc.data().userImage,
            userEmail: doc.data().userEmail,
            userPhoneNumber: doc.data().userPhoneNumber,
            country: doc.data().country,
            region: doc.data().region,
            userWorkedWith: doc.data().userWorkedWith,
            uploadedTime: doc.data().uploadedTime,
            deleted: doc.data().deleted,
            disabled: doc.data().disabled,
          });
        });
        dispatch(setJobs(allJobs));
      } else if (!waiting && user?.country && !user?.currentJob) {
        const q = query(
          collection(db, "jobs"),
          where("country", "==", user.country),
          where("region", "==", user.region),
          where("startingTime", ">", dayjs().unix() + 3600),
          where("disabled", "==", false)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const allJobs = [];

          snapshot.forEach((doc) => {
            allJobs.push({
              id: doc.id,
              jobName: doc.data().jobName,
              salary: doc.data().salary,
              workersCount: doc.data().workersCount,
              currentWorkers: doc.data().currentWorkers,
              workingPlace: doc.data().workingPlace,
              comment: doc.data().comment,
              startingTime: doc.data().startingTime,
              endingTime: doc.data().endingTime,
              line: doc.data().line,
              station: doc.data().station,
              userID: doc.data().userID,
              userName: doc.data().userName,
              userImage: doc.data().userImage,
              userEmail: doc.data().userEmail,
              userPhoneNumber: doc.data().userPhoneNumber,
              country: doc.data().country,
              region: doc.data().region,
              userWorkedWith: doc.data().userWorkedWith,
              uploadedTime: doc.data().uploadedTime,
              deleted: doc.data().deleted,
              disabled: doc.data().disabled,
            });
          });

          dispatch(setJobs(allJobs));
        });
        return () => {
          unsubscribe();
        };
      }
    }

    getDataFromDB();
  }, [user?.region, user?.country, dispatch, user, waiting, navigate]);

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
