import React from "react";
import WestIcon from "@mui/icons-material/West";
import { useLocation, useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useSelector } from "react-redux";
import { selectNotifications } from "../features/notificationsSlice";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { selectTheme } from "../features/themeSlice";
import ActionModul from "./ActionModul";
import { selectLanguage } from "../features/languageSlice";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ezgu from "../assets/ezgu.jpg";
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
import { Avatar } from "@mui/material";

function ExitHeader({
  screenName,
  path,
  myjob,
  jobScreen,
  jobName,
  salary,
  workersCount,
  phoneNumber,
  Time,
  country,
  region,
  metro,
  workingPlace,
  comment,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);
  const notifications = useSelector(selectNotifications);
  const [showDeleteModul, setShowDeleteModul] = useState(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const shareUrl = `https://ezgu.netlify.app/${location.pathname}`;
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

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
  };

  const deleteNotifications = () => {
    setShowDeleteModul(false);
    const allNotifications = notifications;
    allNotifications.map(async (item) => {
      await deleteDoc(doc(db, "notifications", item.id));
    });
  };

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.textColor,
        borderColor: theme.borderBlack,
      }}
      className="sticky top-0 z-50 w-full border-b shadow-sm"
    >
      {showDeleteModul && (
        <ActionModul
          text={language.exitHeader.deleteModulText}
          cancelFunction={(value) => setShowDeleteModul(value)}
          confirmFunction={deleteNotifications}
        />
      )}
      <div className="relative h-14 flex items-center justify-center">
        <h1 className="font-bold text-xl text-center truncate w-[72%]">
          {screenName}
        </h1>
        {!myjob && (
          <div className="absolute left-0 z-10 w-14 h-14 flex items-center justify-center">
            <IconButton
              onClick={() => (path ? navigate(path) : navigate(-1))}
              size="medium"
            >
              <WestIcon style={{ color: theme.textColor }} />
            </IconButton>
          </div>
        )}
        {jobScreen && (
          <div className="absolute right-0 z-10 w-14 h-14 flex items-center justify-center">
            <IconButton
              onClick={() => setOpenBottomSheet(!openBottomSheet)}
              size="medium"
            >
              <ShareIcon style={{ color: theme.textColor }} />
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
                  swipeAreaWidth={drawerBleeding}
                  disableSwipeToOpen={false}
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
                        title={`${jobName}\n${salary}\n${workersCount}\n${phoneNumber}\n${Time}\n${country}\n${region}\n${metro}\n${workingPlace}\n${comment}`}
                      >
                        <div className="flex flex-col items-center w-10">
                          <WhatsappIcon size={40} round={true} />
                          <p className="font-[600] text-sm">WhatsApp</p>
                        </div>
                      </WhatsappShareButton>
                      <TelegramShareButton
                        url={shareUrl}
                        title={`${jobName}\n${salary}\n${workersCount}\n${phoneNumber}\n${Time}\n${country}\n${region}\n${metro}\n${workingPlace}\n${comment}`}
                      >
                        <div className="flex flex-col items-center w-10">
                          <TelegramIcon size={40} round={true} />
                          <p className="font-[600] text-sm">Telegram</p>
                        </div>
                      </TelegramShareButton>
                      <OKShareButton
                        url={shareUrl}
                        title={jobName}
                        description={`${salary}\n${workersCount}\n${phoneNumber}\n${Time}\n${country}\n${region}\n${metro}\n${workingPlace}\n${comment}`}
                        image="https://firebasestorage.googleapis.com/v0/b/ezgu-95ab1.appspot.com/o/users%2Fvqd01tM0yxQZrtck92vHNafMvgg1%2Fimage?alt=media&token=89ef4371-91c3-46d9-952e-8fb365c76c5d"
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
                        quote={`${jobName}\n${salary}\n${workersCount}\n${phoneNumber}\n${Time}\n${country}\n${region}\n${metro}\n${workingPlace}\n${comment}`}
                      >
                        <div className="flex flex-col items-center w-10">
                          <FacebookIcon size={40} round={true} />
                          <p className="font-[600] text-sm">Facebook</p>
                        </div>
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={shareUrl}
                        title={`${jobName}\n${salary}\n${workersCount}\n${phoneNumber}\n${Time}\n${country}\n${region}\n${metro}\n${workingPlace}\n${comment}`}
                      >
                        <div className="flex flex-col items-center w-10">
                          <TwitterIcon size={40} round={true} />
                          <p className="font-[600] text-sm">Twitter</p>
                        </div>
                      </TwitterShareButton>
                      <ViberShareButton
                        url={shareUrl}
                        title={`${jobName}\n${salary}\n${workersCount}\n${phoneNumber}\n${Time}\n${country}\n${region}\n${metro}\n${workingPlace}\n${comment}`}
                      >
                        <div className="flex flex-col items-center w-10">
                          <ViberIcon size={40} round={true} />
                          <p className="font-[600] text-sm">Viber</p>
                        </div>
                      </ViberShareButton>
                      <VKShareButton
                        url={shareUrl}
                        title={`${jobName}\n${salary}\n${workersCount}\n${phoneNumber}\n${Time}\n${country}\n${region}\n${metro}\n${workingPlace}\n${comment}`}
                        image="https://firebasestorage.googleapis.com/v0/b/ezgu-95ab1.appspot.com/o/users%2Fvqd01tM0yxQZrtck92vHNafMvgg1%2Fimage?alt=media&token=89ef4371-91c3-46d9-952e-8fb365c76c5d"
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
            </IconButton>
          </div>
        )}
        {location.pathname === "/notifications" && (
          <div className="absolute right-0 z-10 w-14 h-14 flex items-center justify-center">
            <Tooltip title={language.exitHeader.iconInfo}>
              <IconButton
                onClick={handleClick}
                size="medium"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <MoreVertIcon style={{ color: theme.textColor }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {notifications.length > 0 && (
                <MenuItem onClick={() => setShowDeleteModul(true)}>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                  </ListItemIcon>
                  {language.exitHeader.deleteAllText}
                </MenuItem>
              )}
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExitHeader;
