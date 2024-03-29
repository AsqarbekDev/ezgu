import React, { useEffect, useState } from "react";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import PinDropIcon from "@mui/icons-material/PinDrop";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import PublicIcon from "@mui/icons-material/Public";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { moscowMetroList } from "../assets/moscowMetroList";
import { Avatar, ListItemButton } from "@mui/material";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectLanguage } from "../features/languageSlice";
import LoadingModul from "../components/LoadingModul";
import ExitHeader from "../components/ExitHeader";
import MenuItem from "@mui/material/MenuItem";
import ActionModul from "../components/ActionModul";

function AddNewJob() {
  const [jobName, setJobName] = useState("");
  const [salary, setSalary] = useState("");
  const [workersCount, setWorkersCount] = useState("");
  const [workingPlace, setWorkingPlace] = useState("");
  const [comment, setComment] = useState("");
  const [startingTime, setStartingTime] = useState(dayjs());
  const [endingTime, setEndingTime] = useState(dayjs());
  const [line, setLine] = useState(moscowMetroList[0].line);
  const [station, setStation] = useState(moscowMetroList[0].stations[0]);
  const [lineIndex, setLineIndex] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [formDisabled, setFormDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModul, setShowErrorModul] = useState("");
  const [addedJobs, setAddedJobs] = useState([]);

  const user = useSelector(selectUser);
  const language = useSelector(selectLanguage);

  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [country, setCountry] = useState(user.country || "");
  const [region, setRegion] = useState("");
  const [currency, setCurrency] = useState("RUB");

  const navigate = useNavigate();

  const currencies = [
    {
      value: "USD",
      label: "$",
    },
    {
      value: "EUR",
      label: "€",
    },
    {
      value: "RUB",
      label: "₽",
    },
    {
      value: "UZS",
      label: "so'm",
    },
  ];

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  useEffect(() => {
    const checkLimit = async () => {
      const q = query(
        collection(db, "jobs"),
        where("userID", "==", user.uid),
        where("uploadedTime", ">", dayjs().unix() - 86400)
      );
      const querySnapshot = await getDocs(q);
      const allJobs = [];
      querySnapshot.forEach((doc) => {
        allJobs.push(doc.id);
      });
      setAddedJobs(allJobs);
    };
    checkLimit();
  }, [user.uid]);

  useEffect(() => {
    if (user.currentJob) {
      setShowErrorModul(language.addNewJob.errorModulTextJob);
    }
  }, [user.currentJob, language.addNewJob.errorModulTextJob]);

  useEffect(() => {
    setLine(moscowMetroList[lineIndex].line);
    setStation(moscowMetroList[lineIndex].stations[0]);
  }, [lineIndex]);

  const checkForm = () => {
    const errors = {};

    if (!jobName || jobName.replace(/\s/g, "").length <= 0) {
      errors.jobName = language.addNewJob.jobNameError;
    }
    if (!salary || salary.replace(/\s/g, "").length <= 0) {
      errors.salary = language.addNewJob.salaryError;
    }
    if (!workersCount || workersCount.replace(/\s/g, "").length <= 0) {
      errors.workersCount = language.addNewJob.workersCountError;
    }
    if (!workingPlace || workingPlace.replace(/\s/g, "").length <= 0) {
      errors.workingPlace = language.addNewJob.workingPlaceError;
    }
    if (!comment || comment.replace(/\s/g, "").length <= 0) {
      errors.comment = language.addNewJob.commentError;
    }
    if (startingTime.unix() < dayjs().unix() + 7200) {
      errors.startingTime = language.addNewJob.startingTimeError;
    }
    if (
      endingTime.unix() < startingTime.unix() + 3600 ||
      endingTime.unix() > startingTime.unix() + 43200
    ) {
      errors.endingTime = language.addNewJob.endingTimeError;
    }
    if (!country || !region) {
      errors.country = language.addNewJob.regionError;
    }
    if (country === "Russian Federation" && region === "Moscow") {
      if (line === moscowMetroList[0].line) {
        errors.metro = language.addNewJob.metroError;
      }
    }
    if (!phoneNumber || phoneNumber?.length < 10 || phoneNumber?.length > 20) {
      errors.number = language.addNewJob.numberError;
    }

    if (Object.keys(errors).length === 0) {
      setFormDisabled(true);
      uploadToDB();
    }
    return errors;
  };

  const handleSubmit = () => {
    setFormErrors(checkForm());
  };

  const uploadToDB = () => {
    if (addedJobs.length < 4) {
      setLoading(true);
      addDoc(collection(db, "jobs"), {
        jobName,
        salary,
        currency,
        workersCount,
        currentWorkers: [],
        workingPlace,
        comment,
        startingTime: startingTime.unix(),
        endingTime: endingTime.unix(),
        line,
        station,
        userID: user.uid,
        userName: user.username,
        userImage: user.image,
        userEmail: user.email,
        userPhoneNumber: phoneNumber,
        userWorkedWith: user.workedWith,
        country,
        region,
        uploadedTime: dayjs().unix(),
        disabled: false,
        deleted: false,
      })
        .then(async () => {
          await updateDoc(doc(db, "users", user.uid), {
            phoneNumber,
            country,
            region,
            jobAdds: user.jobAdds + 1,
          });

          setLoading(false);
          navigate("/add");
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    } else {
      setShowErrorModul(language.addNewJob.errorModulText);
    }
  };

  return (
    <div>
      <ExitHeader screenName={language.addNewJob.headerText} />
      {loading && <LoadingModul />}
      {showErrorModul && (
        <ActionModul
          text={showErrorModul}
          exitFunction={() =>
            showErrorModul === language.addNewJob.errorModulText
              ? navigate("/")
              : navigate(`/jobs/${user.currentJob}`)
          }
          errorModulExit
          buttonName={
            showErrorModul === language.addNewJob.errorModulText
              ? language.addNewJob.errorModulBtn
              : language.addNewJob.errorModulBtnJob
          }
        />
      )}
      <div className="p-2">
        <div className="bg-white shadow-xl rounded-lg px-2 py-4">
          <div className="flex flex-col items-center">
            <Avatar
              style={{
                height: 60,
                width: 60,
                borderWidth: 3,
                borderColor: "black",
              }}
              alt={user.username}
              src={user.image}
            />
          </div>
          <h2 className="font-bold truncate text-center">{user.username}</h2>
          <div className="flex items-center mt-4">
            <DriveFileRenameOutlineIcon style={{ fontSize: 20 }} />
            <input
              className="ml-2 border border-black outline-[#0fdbff] rounded-lg py-1 px-2 w-full"
              placeholder={language.addNewJob.jobName}
              type="text"
              maxLength={100}
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              disabled={formDisabled}
            />
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.jobName}
          </p>
          <div className="flex items-center mt-4">
            <LocalAtmIcon style={{ fontSize: 20 }} />
            <input
              className="ml-2 border border-black outline-[#0fdbff]  rounded-lg py-1 px-2 w-full"
              placeholder="2000..."
              type="number"
              value={salary}
              onChange={(e) => {
                e.target.value.length < 8 && setSalary(e.target.value);
              }}
              disabled={formDisabled}
            />
            <div className="ml-2 -mt-4">
              <TextField
                id="outlined-select-currency"
                select
                value={currency}
                onChange={handleChange}
                className="w-20 h-10"
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.salary}
          </p>
          <div className="flex items-center mt-4">
            <GroupsIcon style={{ fontSize: 20 }} />
            <input
              className="ml-2 border border-black outline-[#0fdbff]  rounded-lg py-1 px-2 w-full"
              placeholder={language.addNewJob.numOfWorkers}
              type="number"
              value={workersCount}
              onChange={(e) => {
                e.target.value.length < 4 && setWorkersCount(e.target.value);
              }}
              disabled={formDisabled}
            />
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.workersCount}
          </p>
          <div className="flex items-center mt-4">
            <PinDropIcon style={{ fontSize: 20 }} />
            <input
              className="ml-2 border border-black outline-[#0fdbff]  rounded-lg py-1 px-2 w-full"
              placeholder={language.addNewJob.address}
              type="text"
              maxLength={100}
              value={workingPlace}
              onChange={(e) => setWorkingPlace(e.target.value)}
              disabled={formDisabled}
            />
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.workingPlace}
          </p>
          <div className="flex items-center mt-4">
            <MessageOutlinedIcon style={{ fontSize: 18 }} />
            <textarea
              className="ml-2 text-sm border border-black outline-[#0fdbff]  rounded-lg py-1 px-2 w-full"
              placeholder={language.addNewJob.comment}
              type="text"
              maxLength={300}
              rows="6"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={formDisabled}
            />
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.comment}
          </p>
          <div className="flex items-center mt-4">
            <PhoneAndroidIcon style={{ fontSize: 18 }} />
            <PhoneInput
              defaultCountry="UZ"
              className="ml-2 border border-black p-2 rounded-lg min-w-[10%] max-w-[100%] flex-1"
              value={phoneNumber}
              onChange={setPhoneNumber}
              international
              limitMaxLength
              disabled={formDisabled}
            />
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.number}
          </p>
          <div className="flex items-center space-x-2 mt-5">
            <EventAvailableIcon style={{ fontSize: 20 }} />
            <div className="space-y-2 flex flex-col">
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label={language.addNewJob.startingTime}
                value={startingTime}
                onChange={(newValue) => {
                  setStartingTime(newValue);
                }}
                disabled={formDisabled}
                ampm={false}
              />
              <p className="ml-2 text-red-600 font-[600] text-sm">
                {formErrors.startingTime}
              </p>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label={language.addNewJob.endingTime}
                value={endingTime}
                onChange={(newValue) => {
                  setEndingTime(newValue);
                }}
                disabled={formDisabled}
                ampm={false}
              />
              <p className="ml-2 text-red-600 font-[600] text-sm">
                {formErrors.endingTime}
              </p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <PublicIcon style={{ fontSize: 20 }} />
            <div className="flex flex-col ml-5 space-y-4 text-sm font-[700] text-right">
              <p>{language.addNewJob.country}</p>
              <p>{language.addNewJob.region}</p>
            </div>
            <div className="flex flex-col ml-[11px] space-y-4 min-w-[10%] max-w-[100%] flex-1">
              <CountryDropdown
                value={country}
                onChange={(val) => {
                  setCountry(val);
                  setRegion("");
                }}
                defaultOptionLabel={language.addNewJob.countryDefault}
                disabled={formDisabled}
              />
              <RegionDropdown
                country={country}
                value={region}
                onChange={(val) => setRegion(val)}
                defaultOptionLabel={language.addNewJob.regionDefault}
                disabled={formDisabled}
              />
            </div>
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.country}
          </p>
          {country === "Russian Federation" && region === "Moscow" && (
            <>
              <div className="flex items-center space-x-3 mt-4">
                <DirectionsTransitIcon style={{ fontSize: 20 }} />
                <div className="flex flex-col space-y-4 text-sm font-[700] text-right">
                  <p>{language.addNewJob.line}</p>
                  <p>{language.addNewJob.station}</p>
                </div>
                <div className="flex flex-col space-y-4">
                  <select
                    disabled={formDisabled}
                    onChange={(e) => {
                      setLineIndex(e.target.value);
                    }}
                    name="Liniya"
                    id="Liniya"
                  >
                    {moscowMetroList.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item.line}
                        </option>
                      );
                    })}
                  </select>

                  <select
                    disabled={formDisabled}
                    onChange={(e) => {
                      setStation(e.target.value);
                    }}
                    name="Stansiya"
                    id="Stansiya"
                  >
                    {moscowMetroList[lineIndex].stations.map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <p className="ml-9 text-red-600 font-[600] text-sm">
                {formErrors.metro}
              </p>
            </>
          )}
          <div className="flex justify-center mt-6 mb-2">
            <div className="bg-black text-white my-2 text-sm rounded-lg w-[60%] overflow-hidden">
              <ListItemButton onClick={handleSubmit} disabled={formDisabled}>
                <p className="w-full text-center -my-1">
                  {language.addNewJob.saveBtn}
                </p>
              </ListItemButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewJob;
