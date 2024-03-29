import { Alert, ListItemButton } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ExitHeader from "../components/ExitHeader";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";
import { auth } from "../firebase";

function SignInwithEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  const checkForm = () => {
    const errors = {};
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!email || email.replace(/\s/g, "").length <= 0) {
      errors.email = language.signIn.errorEmail;
    } else if (!regex.test(email)) {
      errors.email = language.signIn.errorEmailConfirm;
    }
    if (!password || password.replace(/\s/g, "").length <= 0) {
      errors.password = language.signIn.errorPassword;
    } else if (password.replace(/\s/g, "").length < 6) {
      errors.password = language.signIn.errorPasswordConfirm;
    }

    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitted) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          if (userCredential.user) {
            navigate("/");
          }
        })
        .catch((error) => {
          const errorCode = error.code;

          if (errorCode === "auth/user-not-found") {
            setLoginError(language.signIn.emailNoError);
            setShowError(true);
          } else {
            setLoginError(language.signIn.errorText);
            setShowError(true);
          }

          setIsSubmitted(false);
          setFormDisabled(false);
        });
    } else {
      setFormDisabled(false);
    }
  }, [
    formErrors,
    isSubmitted,
    email,
    password,
    navigate,
    language.signIn.emailNoError,
    language.signIn.errorText,
  ]);

  const handleSubmit = () => {
    setFormDisabled(true);
    setFormErrors(checkForm());
    setIsSubmitted(true);
  };

  return (
    <div>
      <ExitHeader path="/signUp" screenName={language.signIn.headerText} />
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
              {loginError}
            </Alert>
          )}
          <h2 className="mb-6 text-center font-bold tracking-tight leading-5">
            {language.signIn.headerInfo}
          </h2>
          <input
            style={{
              backgroundColor: theme.background,
              color: theme.textColor,
              outlineColor: theme.border,
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={language.signIn.email}
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
            placeholder={language.signIn.password}
            className="logInput p-1 m-1 border rounded-md w-full"
            type="password"
            disabled={formDisabled}
            maxLength={20}
          />
          <p className="text-red-600 font-[600] text-xs">
            {formErrors.password}
          </p>
          <div className="logButton border border-white mb-3 mt-4 bg-black rounded-md text-sm text-white w-[60%] overflow-hidden">
            <ListItemButton onClick={handleSubmit} disabled={formDisabled}>
              <p className="w-full text-center -my-1">
                {language.signIn.enterBtn}
              </p>
            </ListItemButton>
          </div>
          <p className="text-xs">
            {language.signIn.question}
            <Link to="/signUpwithEmail" className="text-blue-400 ml-1">
              {language.signIn.navigateBtn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInwithEmail;
