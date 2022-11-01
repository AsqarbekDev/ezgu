import React from "react";
import WestIcon from "@mui/icons-material/West";
import { useLocation, useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
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

function ExitHeader({ screenName, path, myjob }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector(selectTheme);
  const notifications = useSelector(selectNotifications);
  const [showDeleteModul, setShowDeleteModul] = useState(false);

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
          text="Bildirishnomalarni o'chirishni xoxlaysizmi?"
          cancelFunction={(value) => setShowDeleteModul(value)}
          confirmFunction={deleteNotifications}
        />
      )}
      <div className="relative h-14 flex items-center justify-center">
        <h1 className="font-bold text-xl">{screenName}</h1>
        {!myjob && (
          <div
            onClick={() => (path ? navigate(path) : navigate(-1))}
            className="absolute left-0 z-10 w-14 h-14 flex items-center justify-center"
          >
            <IconButton size="medium">
              <WestIcon style={{ color: theme.textColor }} />
            </IconButton>
          </div>
        )}
        {location.pathname === "/notifications" && (
          <div className="absolute right-0 z-10 w-14 h-14 flex items-center justify-center">
            <Tooltip title="Sozlamalar">
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
                  hammasini o'chirish
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
