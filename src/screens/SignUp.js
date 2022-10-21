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

function SignUp() {
  const [loading, setLoading] = useState(false);
  const [showErrorModul, setShowErrorModul] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  const navigate = useNavigate();

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
      <ExitHeader path="/" screenName="Ro'yxatdan o'tish" />
      {loading && <LoadingModul />}
      {showErrorModul && (
        <div className="fixed z-[98] flex items-center top-0 justify-center w-full h-screen">
          <div className="rounded-xl bg-black text-white text-lg p-6">
            <p>Xatolik yuz berdi! Qayta urinib ko'ring.</p>
            <div className="flex items-center justify-center mt-6">
              <button
                onClick={() => setShowErrorModul(false)}
                className="border border-white px-4 rounded-lg"
              >
                Qaytish
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-md mx-auto min-h-screen -mt-11 flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center bg-white shadow-lg px-4 pb-8 pt-6 rounded-lg">
          <h2 className="mb-6 text-center font-bold tracking-tight leading-5">
            Ilovaning to'liq imkoniyatlaridan foydalanish uchun ro'yxatdan
            o'tishingiz kerak!
          </h2>
          <button
            disabled={formDisabled}
            onClick={signInWithGoogle}
            className="flex items-center bg-black p-2 text-white rounded-lg"
          >
            <img className="w-8 h-8 object-contain" src={googleLogo} alt="G" />
            <p className="ml-2 font-[600]">Google orqali ro'yxatdan o'tish</p>
          </button>
          <button
            disabled={formDisabled}
            onClick={() => navigate("/signUpwithEmail")}
            className="flex items-center bg-black p-2 text-white rounded-lg mt-2"
          >
            <img className="w-8 h-8 object-contain" src={emailLogo} alt="E" />
            <p className="ml-2 font-[600]">Email orqali ro'yxatdan o'tish</p>
          </button>
        </div>
      </div>
    </>
  );
}

export default SignUp;
