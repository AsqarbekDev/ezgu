import { Alert, Avatar } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { selectUser } from "../features/userSlice";
import LoadingModul from "../components/LoadingModul";
import dayjs from "dayjs";
import ExitHeader from "../components/ExitHeader";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";

function SignUpwithEmail() {
  const avatarRef = useRef(null);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  const addImage = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImage(readerEvent.target.result);
    };
  };

  const checkForm = () => {
    const errors = {};
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!image) {
      errors.image = language.signUpWithEmail.imageError;
    }
    if (!username || username.replace(/\s/g, "").length <= 0) {
      errors.username = language.signUpWithEmail.nameError;
    }
    if (!email || email.replace(/\s/g, "").length <= 0) {
      errors.email = language.signUpWithEmail.emailError;
    } else if (!regex.test(email)) {
      errors.email = language.signUpWithEmail.emailFailedError;
    }
    if (!password || password.replace(/\s/g, "").length <= 0) {
      errors.password = language.signUpWithEmail.passwordError;
    } else if (password.replace(/\s/g, "").length < 6) {
      errors.password = language.signUpWithEmail.passwordFailedError;
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = language.signUpWithEmail.passwordWrongError;
    }

    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitted) {
      setLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            username,
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
          }).then(async () => {
            if (image) {
              const storageRef = ref(storage, `users/${user.uid}/image`);
              const uploadTask = uploadBytesResumable(
                storageRef,
                avatarRef.current.files[0]
              );
              uploadTask.on(
                "state_changed",
                (snapshot) => {},
                (error) => {
                  setLoading(false);
                  console.log(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(
                    async (downloadURL) => {
                      await updateDoc(doc(db, "users", user.uid), {
                        image: downloadURL,
                      });
                      setLoading(false);
                    }
                  );
                }
              );
            }

            navigate("/loading/confirmEmail");
          });
        })
        .catch((error) => {
          const errorCode = error.code;

          if (errorCode === "auth/email-already-in-use") {
            setSignUpError(language.signUpWithEmail.emailExistsError);
            setLoading(false);
            setShowError(true);
          } else {
            setSignUpError(language.signUpWithEmail.errorText);
            setLoading(false);
            setShowError(true);
          }

          setFormDisabled(false);
        });
    } else {
      setFormDisabled(false);
    }
  }, [
    formErrors,
    isSubmitted,
    email,
    image,
    password,
    username,
    navigate,
    language.signUpWithEmail.emailExistsError,
    language.signUpWithEmail.errorText,
  ]);

  const handleSubmit = () => {
    if (!user) {
      setFormDisabled(true);
      setFormErrors(checkForm());
      setIsSubmitted(true);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <ExitHeader
        path="/signUp"
        screenName={language.signUpWithEmail.headerText}
      />
      {loading && <LoadingModul />}
      <div className="max-w-md -mt-16 mx-auto h-screen px-4 flex items-center justify-center">
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
              {signUpError}
            </Alert>
          )}
          <Avatar
            onClick={() => avatarRef.current.click()}
            src={image}
            style={{ width: 50, height: 50 }}
            className="mb-3"
          />
          <p className="text-red-600 font-[600] text-xs">{formErrors.image}</p>
          <input
            style={{
              backgroundColor: theme.background,
              color: theme.textColor,
              outlineColor: theme.border,
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={language.signUpWithEmail.name}
            className="logInput p-1 m-1 border rounded-md w-full"
            type="text"
            disabled={formDisabled}
            maxLength={40}
          />
          <p className="text-red-600 font-[600] text-xs">
            {formErrors.username}
          </p>
          <input
            style={{
              backgroundColor: theme.background,
              color: theme.textColor,
              outlineColor: theme.border,
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={language.signUpWithEmail.email}
            className="logInput p-1 m-1 border rounded-md w-full"
            type="email"
            disabled={formDisabled}
            maxLength={50}
          />
          <p className="text-red-600 font-[600] text-xs">{formErrors.email}</p>
          <input
            style={{
              backgroundColor: theme.background,
              color: theme.textColor,
              outlineColor: theme.border,
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={language.signUpWithEmail.password}
            className="logInput p-1 m-1 border rounded-md w-full"
            type="password"
            disabled={formDisabled}
            maxLength={20}
          />
          <p className="text-red-600 font-[600] text-xs">
            {formErrors.password}
          </p>
          <input
            style={{
              backgroundColor: theme.background,
              color: theme.textColor,
              outlineColor: theme.border,
            }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={language.signUpWithEmail.rePassword}
            className="logInput p-1 m-1 border rounded-md w-full"
            type="password"
            disabled={formDisabled}
            maxLength={20}
          />
          <p className="text-red-600 font-[600] text-xs">
            {formErrors.confirmPassword}
          </p>
          <input
            type="file"
            ref={avatarRef}
            hidden
            onChange={addImage}
            disabled={formDisabled}
            accept="image/*"
          />
          <button
            disabled={formDisabled}
            onClick={handleSubmit}
            className="logButton border border-white mb-3 mt-4 bg-black py-1 rounded-md text-sm text-white w-[60%]"
          >
            {language.signUpWithEmail.submitBtn}
          </button>
          <p className="text-xs">
            {language.signUpWithEmail.question}
            <Link to="/signInwithEmail" className="text-blue-400 ml-1">
              {language.signUpWithEmail.navigateBtn}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignUpwithEmail;
