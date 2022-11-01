import React from "react";
import { Avatar } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../../features/themeSlice";

function JobCard({
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
  currency,
}) {
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);

  const navigateToJob = () => {
    navigate(`/jobs/${id}`);
  };

  return (
    <>
      {deleted && (
        <div className="flex justify-end -mb-1 mt-1">
          <p className="bg-red-500 w-max mr-4 px-6 rounded-t-lg">
            O'chirilgan!
          </p>
        </div>
      )}
      <div
        onClick={navigateToJob}
        style={{ backgroundColor: theme.background, color: theme.textColor }}
        className="m-1 px-3 pt-2 rounded-lg shadow-lg cursor-pointer"
      >
        <div className="flex items-center">
          <Avatar alt={userName} src={userImage} />
          <div className="ml-2 truncate flex-1">
            <h5 className="font-bold text-md -mt-1 ml-[1px] truncate flex-1">
              {userName}
            </h5>
            <div className="flex items-center -mt-[1px]">
              <PersonAddAlt1Icon style={{ fontSize: 14, color: "green" }} />
              <p className="text-xs ml-[2px] ">
                {userWorkedWith}ta odamga ish bergan
              </p>
            </div>
          </div>
        </div>
        <div className="jobCardHr mt-2 mb-1"></div>
        <div className="flex items-end justify-between">
          <h4 className="font-bold text-lg truncate -mb-[1px]">{jobName}</h4>
          <p className="font-bold text-xl text-[#34b804] ml-2 flex items-center">
            {salary}{" "}
            <span className="ml-1">
              {currency === "USD" && <span className="text-green-500">$</span>}
              {currency === "EUR" && <span className="text-[#5D7EA7]">€</span>}
              {currency === "RUB" && <span className="text-[#c7a10a]">₽</span>}
              {currency === "UZS" && (
                <span className="text-[#FFC33C]">so'm</span>
              )}
            </span>
          </p>
        </div>
        <div className="flex items-end justify-between ">
          <div className="flex items-end">
            <LocationCityIcon
              style={{ fontSize: 28, color: theme.iconColor }}
            />
            <p
              style={{ color: theme.iconColor }}
              className="font-bold -mb-[0.6px] text-sm"
            >
              {region}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <GroupsIcon style={{ fontSize: 28, color: theme.iconColor }} />
            <p
              style={{ color: theme.iconColor }}
              className="font-bold -mt-2 text-sm"
            >
              {currentWorkers.length}/{workersCount}
            </p>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col items-end mr-2 mt-1">
              <AccessTimeFilledIcon
                style={{ fontSize: 16, color: theme.iconColor, marginTop: -2 }}
              />
              <p
                style={{ color: theme.iconColor }}
                className="text-sm mt-[2px] font-bold"
              >
                {dayjs.unix(startingTime).format("D/M/YYYY")}
              </p>
            </div>
            <div
              style={{ color: theme.iconColor }}
              className="text-sm font-bold"
            >
              <p>{dayjs.unix(startingTime).format("HH:mm")}</p>
              <p>{dayjs.unix(endingTime).format("HH:mm")}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="jobCardHr"></div>
          <ExpandMoreIcon style={{ color: theme.iconColor }} />
        </div>
      </div>
    </>
  );
}

export default JobCard;
