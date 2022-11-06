import React, { useState } from "react";
import googleLogo from "../assets/googleLogo.png";
import emailLogo from "../assets/emailLogo.png";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import LoadingModul from "../components/LoadingModul";
import dayjs from "dayjs";
import ExitHeader from "../components/ExitHeader";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";
import ActionModul from "../components/ActionModul";
import { ListItemButton } from "@mui/material";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const [showErrorModul, setShowErrorModul] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  const provider = new GoogleAuthProvider();
  auth.languageCode = "uz";

  const signInWithGoogle = () => {
    setFormDisabled(true);
    signInWithPopup(auth, provider)
      .then(async (result) => {
        setLoading(true);
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const user = result.user;

        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (!docSnap.exists()) {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            username: user.displayName,
            image: user.photoURL,
            phoneNumber: "",
            country: "",
            region: "",
            currentJob: "",
            workedWith: 0,
            homeAdds: 0,
            jobAdds: 0,
            workedJobs: 0,
            bgImage: "",
            lastSeen: dayjs().unix(),
            blockedUsers: [],
            theme: "light",
            language: "uz",
          });
        }
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.customData.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
        setFormDisabled(false);
        setShowErrorModul(true);
      });
  };

  return (
    <>
      <ExitHeader path="/" screenName={language.signUp.headerText} />
      {loading && <LoadingModul />}
      {showErrorModul && (
        <ActionModul
          text={language.signUp.errorModulText}
          cancelFunction={(value) => setShowErrorModul(value)}
          errorModul
        />
      )}
      <div className="max-w-md mx-auto min-h-screen -mt-16 flex items-center justify-center p-4">
        <div
          style={{ backgroundColor: theme.background, color: theme.textColor }}
          className="flex flex-col items-center justify-center shadow-lg px-4 pb-8 pt-6 rounded-lg"
        >
          <h2 className="mb-6 text-center font-bold tracking-tight leading-5">
            {language.signUp.headerInfo}
          </h2>
          <div className="border border-white bg-black text-white rounded-lg overflow-hidden">
            <ListItemButton onClick={signInWithGoogle} disabled={formDisabled}>
              <p className="w-full text-center flex items-center">
                <img
                  className="w-8 h-8 object-contain"
                  src={googleLogo}
                  alt="G"
                />
                <span className="ml-2 font-[600]">
                  {language.signUp.googleBtn}
                </span>
              </p>
            </ListItemButton>
          </div>
          <div className="border border-white bg-black text-white rounded-lg mt-2 overflow-hidden">
            <ListItemButton
              onClick={() => navigate("/signUpwithEmail")}
              disabled={formDisabled}
            >
              <p className="w-full text-center flex items-center">
                <img
                  className="w-8 h-8 object-contain"
                  src={emailLogo}
                  alt="E"
                />
                <span className="ml-2 font-[600]">
                  {language.signUp.emailBtn}
                </span>
              </p>
            </ListItemButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
