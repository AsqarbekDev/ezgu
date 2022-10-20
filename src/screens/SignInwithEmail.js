import { Alert } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const checkForm = () => {
    const errors = {};
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!email || email.replace(/\s/g, "").length <= 0) {
      errors.email = "Emailingizni kiriting!";
    } else if (!regex.test(email)) {
      errors.email = "Emailingizni to'g'ri kiriting!";
    }
    if (!password || password.replace(/\s/g, "").length <= 0) {
      errors.password = "Parol kiriting!";
    } else if (password.replace(/\s/g, "").length < 6) {
      errors.password = "Parol kamida 6ta belgidan iborat bo'lishi kerak!";
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
            setLoginError("Emailingiz tizimda yo'q! Qayta urinib ko'ring!");
            setShowError(true);
          } else {
            setLoginError("Xatolik yuz berdi! Qayta urinib ko'ring!");
            setShowError(true);
          }

          setIsSubmitted(false);
          setFormDisabled(false);
        });
    } else {
      setFormDisabled(false);
    }
  }, [formErrors, isSubmitted, email, password, navigate]);

  const handleSubmit = () => {
    setFormDisabled(true);
    setFormErrors(checkForm());
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-md -mt-11 mx-auto bg-gray-50 h-screen px-4 flex items-center justify-center">
      <div className="shadow-lg w-full bg-white flex flex-col items-center justify-center py-4 px-6 rounded-lg">
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
          Tizimga kirish uchun Email va Parolingizni kiriting!
        </h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Emailingizni kiriting!"
          className="logInput p-1 m-1 border outline-black rounded-md w-full"
          type="email"
          disabled={formDisabled}
          maxLength={50}
        />
        <p className="text-red-600 font-[600] text-xs">{formErrors.email}</p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parol kiriting!"
          className="logInput p-1 m-1 border outline-black rounded-md w-full"
          type="password"
          disabled={formDisabled}
          maxLength={20}
        />
        <p className="text-red-600 font-[600] text-xs">{formErrors.password}</p>
        <button
          disabled={formDisabled}
          onClick={handleSubmit}
          className="logButton mb-3 mt-4 bg-black py-1 rounded-md text-sm text-white w-[60%]"
        >
          Kirish
        </button>
        <p className="text-xs">
          Xali ro'yxatdan o'tmaganmisiz?
          <Link to="/signUpwithEmail" className="text-blue-400 ml-1">
            Ro'yxatdan o'tish
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignInwithEmail;
