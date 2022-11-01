import { Alert, Button } from "@mui/material";
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

function ConfirmEmail() {
  const [loginError, setLoginError] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [reSignDisabled, setReSignDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    if (!user || user?.emailVerified) {
      navigate("/");
    }
  }, [user?.emailVerified, navigate, user]);

  const reSignUp = async () => {
    setReSignDisabled(true);
    setLoading(true);
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
        setLoginError("Xatolik yuz berdi! Qayta urinib ko'ring!");
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
            `Emailingizga tasdiqlash xabari yuborildi! (${auth.currentUser.email})`
          );
          setShowSuccess(true);
        })
        .catch((error) => {
          setLoginError("Xatolik yuz berdi! Qayta urinib ko'ring!");
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
                  Chiqish
                </Button>
              }
            >
              {loginError}
            </Alert>
          )}
          <h2 className="mb-2 text-center text-lg font-bold tracking-tight leading-5">
            Emailingizni tasdiqlang!
          </h2>
          <p className="text-center text-sm tracking-tight leading-5">
            Tasdiqlash xabarini olish uchun yuborish tugmasini bosing va
            Emailigizga kirib tasdiqlang! (Agarda Emailni topolmasangiz Spam
            bo'limini tekshirib ko'ring!)
          </p>
          <button
            disabled={formDisabled}
            onClick={sendConfirm}
            className="logButton border border-white mb-2 mt-4 bg-black py-1 rounded-md text-sm text-white w-[60%]"
          >
            Yuborish
          </button>
          <button
            disabled={reSignDisabled}
            onClick={reSignUp}
            className="text-blue-400 mt-2 text-xs font-[600]"
          >
            Qayta ro'yxatdan o'tish
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmEmail;
