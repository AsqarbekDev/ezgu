import { Alert, Button, ListItemButton } from "@mui/material";
import { deleteUser, sendEmailVerification } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingModul from "../components/LoadingModul";
import { selectTheme } from "../features/themeSlice";
import { selectUser } from "../features/userSlice";
import { auth, db, storage } from "../firebase";
import { useCookies } from "react-cookie";
import { selectLanguage } from "../features/languageSlice";

function ConfirmEmail() {
  const [loginError, setLoginError] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [reSignDisabled, setReSignDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [, , removeCookie] = useCookies(["user"]);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  useEffect(() => {
    if (!user || user?.emailVerified) {
      navigate("/");
    }
  }, [user?.emailVerified, navigate, user]);

  const reSignUp = async () => {
    setReSignDisabled(true);
    setLoading(true);
    removeCookie("user", { path: "/" });
    const storageRef = ref(storage, `users/${auth.currentUser.uid}/image`);
    deleteObject(storageRef)
      .then(() => {})
      .catch((error) => {
        console.log("error");
      });
    await deleteDoc(doc(db, "users", auth.currentUser.uid));
    deleteUser(auth.currentUser)
      .then(() => {
        setLoading(false);
        window.location.href = "/signUpwithEmail";
      })
      .catch((error) => {
        setLoginError(language.confirm.errorModulText);
        setShowError(true);
        setReSignDisabled(false);
        setLoading(false);
      });
  };

  const sendConfirm = () => {
    setFormDisabled(true);
    if (!user?.emailVerified) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          setLoginError(
            `${language.confirm.successModulText} (${auth.currentUser.email})`
          );
          setShowSuccess(true);
        })
        .catch((error) => {
          setLoginError(language.confirm.errorModulText);
          setShowError(true);
        });
    }
  };

  return (
    <>
      {loading && <LoadingModul />}
      <div className="max-w-md -mt-11 mx-auto h-screen px-4 flex items-center justify-center">
        <div
          style={{ backgroundColor: theme.background, color: theme.textColor }}
          className="shadow-lg w-full flex flex-col items-center justify-center py-4 px-6 rounded-lg"
        >
          {showError && (
            <Alert
              className="mb-4"
              variant="filled"
              severity="error"
              onClose={() => setShowError(false)}
            >
              {loginError}
            </Alert>
          )}
          {showSuccess && (
            <Alert
              className="mb-4"
              variant="filled"
              severity="success"
              action={
                <Button
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  color="inherit"
                  size="small"
                >
                  {language.confirm.successModulBtn}
                </Button>
              }
            >
              {loginError}
            </Alert>
          )}
          <h2 className="mb-2 text-center text-lg font-bold tracking-tight leading-5">
            {language.confirm.headerText}
          </h2>
          <p className="text-center text-sm tracking-tight leading-5">
            {language.confirm.infoText}
          </p>
          <div className="logButton border border-white mb-2 mt-4 bg-black rounded-md text-sm text-white w-[60%] overflow-hidden">
            <ListItemButton onClick={sendConfirm} disabled={formDisabled}>
              <p className="w-full text-center -my-1">
                {language.confirm.sendBtn}
              </p>
            </ListItemButton>
          </div>
          <button
            disabled={reSignDisabled}
            onClick={reSignUp}
            className="text-blue-400 mt-2 text-xs font-[600]"
          >
            {language.confirm.retryBtn}
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmEmail;
