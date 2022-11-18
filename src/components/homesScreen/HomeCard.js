import {
  Avatar,
  IconButton,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import React from "react";
import { useEffect, useRef, useState } from "react";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import PlaceIcon from "@mui/icons-material/Place";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import MessageIcon from "@mui/icons-material/Message";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ShareIcon from "@mui/icons-material/Share";
import "./HomeCard.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LoadingModul from "../LoadingModul";
import { selectTheme } from "../../features/themeSlice";
import ActionModul from "../ActionModul";
import { selectLanguage } from "../../features/languageSlice";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ezgu from "../../assets/ezgu.jpg";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import {
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  OKShareButton,
  OKIcon,
  TwitterShareButton,
  TwitterIcon,
  ViberShareButton,
  ViberIcon,
  VKShareButton,
  VKIcon,
} from "react-share";

function HomeCard({
  id,
  userImage,
  userName,
  userID,
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
  history,
  region,
  currency,
}) {
  const target = useRef(null);
  const theme = useSelector(selectTheme);

  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showRemoveHomeModul, setShowRemoveHomeModul] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const user = useSelector(selectUser);
  const language = useSelector(selectLanguage);
  const navigate = useNavigate();
  const locationPath = useLocation();

  const shareUrl = `https://ezgu.netlify.app/homes`;
  const drawerBleeding = 56;
  const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
  }));
  const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
    borderRadius: 3,
    position: "absolute",
    top: 8,
    left: "calc(50% - 15px)",
  }));
  const toggleDrawer = (newOpen) => () => {
    setOpenBottomSheet(newOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setAnchorEl(null);
    setShowRemoveHomeModul(true);
  };

  useEffect(() => {
    const newImages = [];

    if (image1) {
      newImages.push({
        image: image1,
        id: id,
      });
    }
    if (image2) {
      newImages.push({
        image: image2,
        id: id,
      });
    }
    if (image3) {
      newImages.push({
        image: image3,
        id: id,
      });
    }
    if (image4) {
      newImages.push({
        image: image4,
        id: id,
      });
    }

    setImages(newImages);
  }, [image1, image2, image3, image4, id]);

  // const scrollImage = (index, id) => {
  //   document
  //     .querySelector(`#slide-${index > 3 ? 0 : index}-${id}`)
  //     .scrollIntoView();
  // };

  const scrollListener = () => {
    if (!target.current) {
      return;
    }

    const element = target.current;
    const windowScroll = element.scrollLeft;
    const totalWidth = element.scrollWidth;
    if (windowScroll >= 0 && windowScroll <= totalWidth / images.length / 2) {
      setCurrent(0);
    }
    if (
      windowScroll > totalWidth / images.length / 2 &&
      windowScroll <=
        (totalWidth / images.length) * 2 - totalWidth / images.length / 2
    ) {
      setCurrent(1);
    }
    if (
      windowScroll >
        (totalWidth / images.length) * 2 - totalWidth / images.length / 2 &&
      windowScroll <=
        (totalWidth / images.length) * 3 - totalWidth / images.length / 2
    ) {
      setCurrent(2);
    }
    if (
      windowScroll >
        (totalWidth / images.length) * 3 - totalWidth / images.length / 2 &&
      windowScroll <=
        (totalWidth / images.length) * 4 - totalWidth / images.length / 2
    ) {
      setCurrent(3);
    }
  };

  useEffect(() => {
    const element = target.current;
    element.addEventListener("scroll", scrollListener);
    return () =>
      element && element.removeEventListener("scroll", scrollListener);
  });

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(userPhoneNumber)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteHome = async () => {
    setShowRemoveHomeModul(false);
    setLoading(true);
    await updateDoc(doc(db, "homes", id), {
      disabled: true,
      deleted: true,
    });
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingModul />}
      {showRemoveHomeModul && (
        <ActionModul
          text={language.homes.deleteModul}
          cancelFunction={(value) => setShowRemoveHomeModul(value)}
          confirmFunction={deleteHome}
        />
      )}
      <div
        style={{ backgroundColor: theme.background, color: theme.textColor }}
        className="relative m-2 rounded-lg shadow-lg pb-3"
      >
        <div className="flex items-center p-2">
          <div
            onClick={() =>
              userID !== user?.uid
                ? user
                  ? navigate(`/chats/${userID}`)
                  : navigate("/signUp")
                : null
            }
            className="flex items-center flex-1"
          >
            <Avatar
              style={{ height: 32, width: 32 }}
              alt={userName}
              src={userImage}
            />
            <h2 className="font-bold mx-2 flex-1 truncate">{userName}</h2>
          </div>
          <div>
            <IconButton
              onClick={handleClick}
              size="medium"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVertIcon style={{ color: theme.iconColor }} />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {userID === user?.uid &&
                !history &&
                locationPath.pathname !== "/homes" && (
                  <MenuItem onClick={() => handleDelete()}>
                    <ListItemIcon>
                      <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    {language.homes.deleteBtn}
                  </MenuItem>
                )}
              <MenuItem
                onClick={() => {
                  setOpenBottomSheet(!openBottomSheet);
                  setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <ShareIcon fontSize="small" />
                </ListItemIcon>
                {language.homes.shareBtn}
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div>
          <Global
            styles={{
              ".MuiDrawer-root > .MuiPaper-root": {
                height: `calc(40% - ${drawerBleeding}px)`,
                width: "100%",
                maxWidth: "672px",
                marginLeft: "auto",
                marginRight: "auto",
                overflow: "visible",
              },
            }}
          />
          <SwipeableDrawer
            anchor="bottom"
            open={openBottomSheet}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            disableSwipeToOpen={true}
            ModalProps={{
              keepMounted: false,
            }}
          >
            <StyledBox
              sx={{
                position: "absolute",
                top: -drawerBleeding,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                visibility: "visible",
                width: "100%",
              }}
            >
              <Puller />
              <div className="flex items-center justify-center pt-3">
                <Typography
                  sx={{
                    p: 2,
                    color: "#000",
                    fontSize: 24,
                    fontWeight: 500,
                  }}
                >
                  {language.exitHeader.shareText}
                </Typography>
              </div>
            </StyledBox>
            <StyledBox
              sx={{
                px: 2,
                pb: 2,
                pt: 3,
                width: "100%",
                overflowX: "scroll",
                overflowY: "hidden",
              }}
              className="scrollbar-hide"
            >
              <div className="flex items-center justify-around space-x-2">
                <WhatsappShareButton
                  url={shareUrl}
                  title={`💵 ${rent}\n⏰ ${dayjs
                    .unix(uploadedTime)
                    .format("HH:mm")} ${dayjs
                    .unix(uploadedTime)
                    .format(
                      "D/M/YYYY"
                    )}\n📱 ${userPhoneNumber}\n🌆 ${region}\n📌 ${location}\n${
                    line !== "Неизвестный" ? `🚇 ${line} ${station}\n` : ""
                  }📝 ${comment}`}
                >
                  <div className="flex flex-col items-center w-10">
                    <WhatsappIcon size={40} round={true} />
                    <p className="font-[600] text-sm">WhatsApp</p>
                  </div>
                </WhatsappShareButton>
                <TelegramShareButton
                  url={shareUrl}
                  title={`💵 ${rent}\n⏰ ${dayjs
                    .unix(uploadedTime)
                    .format("HH:mm")} ${dayjs
                    .unix(uploadedTime)
                    .format(
                      "D/M/YYYY"
                    )}\n📱 ${userPhoneNumber}\n🌆 ${region}\n📌 ${location}\n${
                    line !== "Неизвестный" ? `🚇 ${line} ${station}\n` : ""
                  }📝 ${comment}`}
                >
                  <div className="flex flex-col items-center w-10">
                    <TelegramIcon size={40} round={true} />
                    <p className="font-[600] text-sm">Telegram</p>
                  </div>
                </TelegramShareButton>
                <OKShareButton
                  url={shareUrl}
                  title={`💵 ${rent}`}
                  description={`⏰ ${dayjs
                    .unix(uploadedTime)
                    .format("HH:mm")} ${dayjs
                    .unix(uploadedTime)
                    .format(
                      "D/M/YYYY"
                    )}\n📱 ${userPhoneNumber}\n🌆 ${region}\n📌 ${location}\n${
                    line !== "Неизвестный" ? `🚇 ${line} ${station}\n` : ""
                  }📝 ${comment}`}
                  image={images[0]}
                >
                  <div className="flex flex-col items-center w-10">
                    <OKIcon size={40} round={true} />
                    <p className="font-[600] text-sm">OK</p>
                  </div>
                </OKShareButton>
                <button>
                  <div className="flex flex-col items-center w-10">
                    <Avatar src={ezgu} />
                    <p className="font-[600] text-sm">Chats</p>
                  </div>
                </button>
              </div>
            </StyledBox>
            <StyledBox
              sx={{
                px: 2,
                pb: 2,
                pt: 3,
                width: "100%",
                overflowX: "scroll",
                overflowY: "hidden",
              }}
              className="scrollbar-hide"
            >
              <div className="flex items-center justify-around space-x-2">
                <FacebookShareButton
                  url={shareUrl}
                  quote={`💵 ${rent}\n⏰ ${dayjs
                    .unix(uploadedTime)
                    .format("HH:mm")} ${dayjs
                    .unix(uploadedTime)
                    .format(
                      "D/M/YYYY"
                    )}\n📱 ${userPhoneNumber}\n🌆 ${region}\n📌 ${location}\n${
                    line !== "Неизвестный" ? `🚇 ${line} ${station}\n` : ""
                  }📝 ${comment}`}
                >
                  <div className="flex flex-col items-center w-10">
                    <FacebookIcon size={40} round={true} />
                    <p className="font-[600] text-sm">Facebook</p>
                  </div>
                </FacebookShareButton>
                <TwitterShareButton
                  url={shareUrl}
                  title={`💵 ${rent}\n⏰ ${dayjs
                    .unix(uploadedTime)
                    .format("HH:mm")} ${dayjs
                    .unix(uploadedTime)
                    .format(
                      "D/M/YYYY"
                    )}\n📱 ${userPhoneNumber}\n🌆 ${region}\n📌 ${location}\n${
                    line !== "Неизвестный" ? `🚇 ${line} ${station}\n` : ""
                  }📝 ${comment}`}
                >
                  <div className="flex flex-col items-center w-10">
                    <TwitterIcon size={40} round={true} />
                    <p className="font-[600] text-sm">Twitter</p>
                  </div>
                </TwitterShareButton>
                <ViberShareButton
                  url={shareUrl}
                  title={`💵 ${rent}\n⏰ ${dayjs
                    .unix(uploadedTime)
                    .format("HH:mm")} ${dayjs
                    .unix(uploadedTime)
                    .format(
                      "D/M/YYYY"
                    )}\n📱 ${userPhoneNumber}\n🌆 ${region}\n📌 ${location}\n${
                    line !== "Неизвестный" ? `🚇 ${line} ${station}\n` : ""
                  }📝 ${comment}`}
                >
                  <div className="flex flex-col items-center w-10">
                    <ViberIcon size={40} round={true} />
                    <p className="font-[600] text-sm">Viber</p>
                  </div>
                </ViberShareButton>
                <VKShareButton
                  url={shareUrl}
                  title={`💵 ${rent}\n⏰ ${dayjs
                    .unix(uploadedTime)
                    .format("HH:mm")} ${dayjs
                    .unix(uploadedTime)
                    .format(
                      "D/M/YYYY"
                    )}\n📱 ${userPhoneNumber}\n🌆 ${region}\n📌 ${location}\n${
                    line !== "Неизвестный" ? `🚇 ${line} ${station}\n` : ""
                  }📝 ${comment}`}
                  image={images[0]}
                >
                  <div className="flex flex-col items-center w-10">
                    <VKIcon size={40} round={true} />
                    <p className="font-[600] text-sm">VK</p>
                  </div>
                </VKShareButton>
              </div>
            </StyledBox>
          </SwipeableDrawer>
        </div>
        <div
          style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
          className={`imageContainer ${
            images.length < 2 && "imageContainer2"
          } flex items-center overflow-x-scroll`}
          ref={target}
        >
          {images.map(({ image, id }, index) => {
            return (
              <img
                key={index}
                id={`slide-${index}-${id}`}
                style={{ scrollSnapAlign: "start" }}
                className="homeImage"
                src={image}
                alt=""
              />
            );
          })}
        </div>
        {images.length > 1 && (
          <div className="absolute z-10 top-[288px] w-full flex items-center justify-center space-x-2">
            {images.map(({ image, id }, index) => {
              return (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-white flex items-center justify-center"
                  // onClick={() => {
                  //   scrollImage(index, id);
                  // }}
                >
                  <div
                    className={`${
                      current === index && "bg-white"
                    } w-3 h-3 rounded-full`}
                  >
                    {current !== index && (
                      <img
                        className="w-3 h-3 rounded-full object-cover"
                        src={image}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center font-bold text-lg">
              <p className="text-[#34b804]">
                {rent}{" "}
                <span>
                  {currency === "USD" && (
                    <span className="text-green-500">$</span>
                  )}
                  {currency === "EUR" && (
                    <span className="text-[#5D7EA7]">€</span>
                  )}
                  {currency === "RUB" && (
                    <span className="text-[#c7a10a]">₽</span>
                  )}
                  {currency === "UZS" && (
                    <span className="text-[#FFC33C]">so'm</span>
                  )}
                </span>
              </p>
            </div>
            <div className="flex items-center font-bold text-sm">
              <WatchLaterIcon
                style={{ fontSize: 16, marginTop: -1, color: theme.iconColor }}
              />
              <p style={{ color: theme.iconColor }} className="ml-1">
                {dayjs.unix(uploadedTime).format("HH:mm")}
              </p>
              <p style={{ color: theme.iconColor }} className="ml-3">
                {dayjs.unix(uploadedTime).format("D/M/YYYY")}
              </p>
            </div>
          </div>
          <div className="flex items-start text-sm font-[600]">
            <PhoneAndroidIcon
              style={{
                fontSize: 14,
                marginLeft: -2,
                marginTop: 2,
                marginRight: 3,
              }}
            />
            <p className="-mt-[0.5px]">{userPhoneNumber}</p>
            <div
              onClick={handleCopyClick}
              style={{
                backgroundColor: isCopied
                  ? theme.buttonOpacityColor
                  : theme.background,
                borderColor: theme.border,
              }}
              className={`ml-2 border rounded-lg text-xs overflow-hidden`}
            >
              <ListItemButton>
                <p className="w-full text-center -my-2">
                  {isCopied ? language.jobs.copied : language.jobs.copy}
                </p>
              </ListItemButton>
            </div>
          </div>
          <div className="flex items-start text-sm font-[600] mt-[2px]">
            <LocationCityIcon
              style={{
                fontSize: 16,
                marginLeft: -3,
                marginTop: 1.4,
                marginRight: 3,
              }}
            />
            <p className="overflow-hidden">{region}</p>
          </div>
          <div className="flex items-start text-sm font-[600] mt-[2px]">
            <PlaceIcon
              style={{
                fontSize: 16,
                marginLeft: -3,
                marginTop: 2,
                marginRight: 3,
              }}
            />
            <p className="overflow-hidden">{location}</p>
          </div>
          {line !== "Неизвестный" && (
            <div className="flex items-start text-sm font-[600] mt-[2px]">
              <DirectionsTransitIcon
                style={{
                  fontSize: 16,
                  marginTop: 2,
                  marginLeft: -3,
                  marginRight: 3,
                }}
              />
              <p className="overflow-hidden">
                {line} {station}
              </p>
            </div>
          )}
          <div
            onClick={() => setShowComments(!showComments)}
            className="flex relative items-start text-xs font-[500] mt-1 cursor-pointer"
          >
            <MessageIcon
              style={{
                fontSize: 13,
                marginTop: 2,
                marginLeft: -1,
                marginRight: 4,
              }}
            />
            <p
              className={
                !showComments
                  ? "line-clamp-2 overflow-hidden"
                  : "overflow-hidden"
              }
            >
              {comment}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeCard;
