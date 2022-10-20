import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectUser, selectWaiting } from "../features/userSlice";
import DefaultLoadingModul from "../components/DefaultLoadingModul";

function Loading() {
  const location = useLocation();
  const user = useSelector(selectUser);
  const waiting = useSelector(selectWaiting);
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.pathname.includes("/loading")) {
      navigate("/");
    } else if (!waiting && user) {
      if (user.emailVerified) {
        const newPath = location.pathname.replace("/loading", "");
        navigate(newPath);
      } else {
        navigate("/confirmEmail");
      }
    } else if (!waiting && !user) {
      navigate("/signUp");
    }
  }, [user, waiting, location.pathname, navigate]);

  return <DefaultLoadingModul />;
}

export default Loading;
