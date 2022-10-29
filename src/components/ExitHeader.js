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

function ExitHeader({ screenName, path, myjob }) {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      {showDeleteModul && (
        <div className="fixed z-[98] max-w-2xl flex items-center top-0 justify-center w-full h-screen">
          <div className="rounded-xl bg-black text-white text-lg p-6">
            <p>Bildirishnomalarni o'chirishni xoxlaysizmi?</p>
            <div className="flex items-center justify-around mt-6">
              <button
                onClick={() => setShowDeleteModul(false)}
                className="border border-white w-16 rounded-lg"
              >
                YO'Q
              </button>
              <button
                onClick={deleteNotifications}
                className="border border-white w-16 rounded-lg"
              >
                HA
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative h-14 flex items-center justify-center">
        <h1 className="font-bold text-xl">{screenName}</h1>
        {!myjob && (
          <div
            onClick={() => (path ? navigate(path) : navigate(-1))}
            className="absolute left-0 z-10 w-14 h-14 flex items-center justify-center"
          >
            <IconButton size="medium">
              <WestIcon style={{ color: "black" }} />
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
                <MoreVertIcon style={{ color: "black" }} />
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
              <MenuItem onClick={() => setShowDeleteModul(true)}>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize="small" />
                </ListItemIcon>
                hammasini o'chirish
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExitHeader;
