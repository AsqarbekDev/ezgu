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
      errors.image = "Iltimos rasm joylang!";
    }
    if (!username || username.replace(/\s/g, "").length <= 0) {
      errors.username = "Ismingizni kiriting!";
    }
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
    if (confirmPassword !== password) {
      errors.confirmPassword = "Parolingizni to'g'ri kiriting!";
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
            setSignUpError("Email allaqchon ro'yxatdan o'tgan!");
            setLoading(false);
            setShowError(true);
          } else {
            setSignUpError("Xatolik yuz berdi! Qayta urinib ko'ring!");
            setLoading(false);
            setShowError(true);
          }

          setFormDisabled(false);
        });
    } else {
      setFormDisabled(false);
    }
  }, [formErrors, isSubmitted, email, image, password, username, navigate]);

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
      {loading && <LoadingModul />}
      <div className="max-w-md -mt-11 mx-auto bg-gray-50 h-screen px-4 flex items-center justify-center">
        <div className="shadow-lg w-full bg-white flex flex-col items-center justify-center py-4 px-6 rounded-lg">
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
            className="mb-3 cursor-pointer"
          />
          <p className="text-red-600 font-[600] text-xs">{formErrors.image}</p>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ismingizni kiriting!"
            className="logInput p-1 m-1 border outline-black rounded-md w-full"
            type="text"
            disabled={formDisabled}
            maxLength={40}
          />
          <p className="text-red-600 font-[600] text-xs">
            {formErrors.username}
          </p>
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
          <p className="text-red-600 font-[600] text-xs">
            {formErrors.password}
          </p>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Parolni qayta kiriting!"
            className="logInput p-1 m-1 border outline-black rounded-md w-full"
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
          />
          <button
            disabled={formDisabled}
            onClick={handleSubmit}
            className="logButton mb-3 mt-4 bg-black py-1 rounded-md text-sm text-white w-[60%]"
          >
            Ro'yxatdan o'tish
          </button>
          <p className="text-xs">
            Akkauntingiz allaqachon bormi?
            <Link to="/signInwithEmail" className="text-blue-400 ml-1">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignUpwithEmail;
