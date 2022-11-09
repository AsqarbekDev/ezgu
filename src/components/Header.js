import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import LanguageIcon from "@mui/icons-material/Language";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectNotifications } from "../features/notificationsSlice";
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BlockIcon from "@mui/icons-material/Block";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";

function Header() {
  const location = useLocation();
  const user = useSelector(selectUser);
  const notifications = useSelector(selectNotifications);
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  const [currentScreen, setCurrentScreen] = useState("/");
  const [newNotifications, setNewNotifications] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const newMessagesArray = [];

    notifications.map((item) => {
      if (!item.seen) {
        newMessagesArray.push(item.id);
      }
      return null;
    });

    setNewNotifications(newMessagesArray);
  }, [notifications]);

  useEffect(() => {
    setCurrentScreen(location.pathname);
  }, [location]);

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.textColor,
        borderColor: theme.borderBlack,
      }}
      className={`${
        currentScreen === "/" ||
        currentScreen === "/homes" ||
        currentScreen === "/add" ||
        currentScreen === "/loading/add" ||
        currentScreen === "/chats" ||
        currentScreen === "/loading/chats" ||
        currentScreen === "/profile" ||
        currentScreen === "/loading/profile"
          ? ""
          : "hidden"
      } sticky top-0 z-50 w-full flex items-center justify-center border-b shadow-sm h-14`}
    >
      <div className="relative w-full flex items-center justify-center">
        <h1 className="font-bold text-3xl">EZGU</h1>
        <div
          onClick={() => navigate("/profile/changeLanguage")}
          className={`${
            user ? "hidden" : null
          } absolute right-0 z-10 w-14 h-14 flex items-center justify-center`}
        >
          <IconButton size="small">
            <LanguageIcon style={{ fontSize: 28, color: theme.textColor }} />
          </IconButton>
        </div>
        <div
          onClick={() => navigate("/notifications")}
          className={`${
            !user || currentScreen === "/chats" ? "hidden" : null
          } absolute right-0 z-10 w-14 h-14 flex items-center justify-center`}
        >
          <div className="relative">
            <IconButton size="small">
              <CircleNotificationsIcon
                style={{ fontSize: 30, color: theme.textColor }}
              />
            </IconButton>
            {newNotifications.length > 0 && (
              <div className="absolute right-1 top-1 bg-red-500 rounded-full px-[5px]">
                <p className="text-white text-xs">{newNotifications.length}</p>
              </div>
            )}
          </div>
        </div>
        <div
          className={`${
            currentScreen !== "/chats" && "hidden"
          } absolute right-0 z-10 w-14 h-14 flex items-center justify-center`}
        >
          <Tooltip title={language.header.iconInfo}>
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
            <MenuItem
              className="overflow-hidden"
              onClick={() => navigate("/chats/blockedUsers")}
            >
              <ListItemIcon>
                <BlockIcon fontSize="small" />
              </ListItemIcon>
              {language.header.blockedUsersText}
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Header;
