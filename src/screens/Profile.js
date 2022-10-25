import React, { useRef } from "react";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import LanguageIcon from "@mui/icons-material/Language";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import EditIcon from "@mui/icons-material/Edit";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AddHomeIcon from "@mui/icons-material/AddHome";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/userSlice";
import {
  Avatar,
  Divider,
  ListItemButton,
  ListItemText,
  MenuItem,
  Switch,
} from "@mui/material";
import defaultBgImage from "../assets/defaultBgImage.jpg";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import LoadingModul from "../components/LoadingModul";
import { useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Profile() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bImageRef = useRef(null);
  const userImageRef = useRef(null);
  const usernameRef = useRef(null);
  const phoneNumberRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [uImage, setUImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSaveImageBtn, setShowSaveImageBtn] = useState(false);
  const [showErrorModul, setShowErrorModul] = useState(false);
  const [showUsernameModul, setShowUsernameModul] = useState(false);
  const [showNumberModul, setShowNumberModul] = useState(false);
  const [showRegionModul, setShowRegionModul] = useState(false);
  const [showLogOutModul, setShowLogOutModul] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [username, setUsername] = useState(user.username);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [country, setCountry] = useState(user.country || "");
  const [region, setRegion] = useState("");

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
    if (phoneNumberRef.current) {
      phoneNumberRef.current.focus();
    }
  }, [usernameRef, showUsernameModul, phoneNumberRef, showNumberModul]);

  const changeUsername = async () => {
    const errors = {};
    if (!username || username.replace(/\s/g, "").length <= 0) {
      errors.username = "Ismingizni kiriting!";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setShowUsernameModul(false);
      setLoading(true);
      await updateDoc(doc(db, "users", user.uid), {
        username,
      });
      setLoading(false);
    }
  };

  const changePhoneNumber = async () => {
    const errors = {};
    if (!phoneNumber || phoneNumber?.length < 10 || phoneNumber?.length > 20) {
      errors.number = "Telefon raqamingizni kiriting!";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setShowNumberModul(false);
      setLoading(true);
      await updateDoc(doc(db, "users", user.uid), {
        phoneNumber,
      });
      setLoading(false);
    }
  };

  const changeRegion = async () => {
    const errors = {};
    if (!country || !region) {
      errors.country = "Davlat va Regionni kiriting!";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setShowRegionModul(false);
      setLoading(true);
      await updateDoc(doc(db, "users", user.uid), {
        country,
        region,
      });
      setRegion("");
      setLoading(false);
    }
  };

  const uploadUserImageToStorage = (storageRef) => {
    setLoading(true);
    const uploadTask = uploadBytesResumable(
      storageRef,
      userImageRef.current.files[0]
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setUImage(null);
        setLoading(false);
        setShowErrorModul(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(db, "users", user.uid), {
            image: downloadURL,
          });
          setUImage(null);
          setLoading(false);
        });
      }
    );
  };

  const uploadUserBgImageToStorage = (storageRef) => {
    setLoading(true);
    const uploadTask = uploadBytesResumable(
      storageRef,
      bImageRef.current.files[0]
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setBackgroundImage(null);
        setLoading(false);
        setShowErrorModul(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(db, "users", user.uid), {
            bgImage: downloadURL,
          });
          setBackgroundImage(null);
          setLoading(false);
        });
      }
    );
  };

  const addBImageToState = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setBackgroundImage(readerEvent.target.result);
      setShowSaveImageBtn(true);
    };
  };

  const addUserImageToState = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setUImage(readerEvent.target.result);
      setShowSaveImageBtn(true);
    };
  };

  const addImagesToDB = () => {
    setShowSaveImageBtn(false);
    if (uImage) {
      setLoading(true);
      const storageRef = ref(storage, `users/${user.uid}/image`);
      deleteObject(storageRef)
        .then(() => {
          uploadUserImageToStorage(storageRef);
        })
        .catch((error) => {
          if (error.code === "storage/object-not-found") {
            uploadUserImageToStorage(storageRef);
          } else {
            setUImage(null);
            setLoading(false);
            setShowErrorModul(true);
          }
        });
    }
    if (backgroundImage) {
      setLoading(true);
      const storageRef = ref(storage, `users/${user.uid}/bgImage`);
      deleteObject(storageRef)
        .then(() => {
          uploadUserBgImageToStorage(storageRef);
        })
        .catch((error) => {
          if (error.code === "storage/object-not-found") {
            uploadUserBgImageToStorage(storageRef);
          } else {
            setBackgroundImage(null);
            setLoading(false);
            setShowErrorModul(true);
          }
        });
    }
  };

  const deleteImage = () => {
    setUImage(null);
    setBackgroundImage(null);
    setShowSaveImageBtn(false);
  };

  const signOutUser = () => {
    setShowLogOutModul(false);
    setLoading(true);
    signOut(auth)
      .then(() => {
        dispatch(logout());
        setLoading(false);
        window.location.href = "/";
      })
      .catch((error) => {
        setLoading(false);
        setShowErrorModul(true);
      });
  };

  return (
    <div className="pb-[50px]">
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
      {showUsernameModul && (
        <div className="fixed z-[98] flex items-center top-0 justify-center w-full h-screen">
          <div className="rounded-md bg-white border-2 border-black text-lg p-6">
            <p className="text-red-600 font-[700] text-xs ml-2">
              {formErrors.username}
            </p>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ismingizni kiriting!"
              className="p-1 m-1 border border-black outline-black bg-white rounded-md w-full"
              type="text"
              maxLength={40}
              ref={usernameRef}
            />
            <div className="flex items-center justify-around mt-6">
              <button
                onClick={() => {
                  setShowUsernameModul(false);
                  setUsername(user.username);
                  setFormErrors({});
                }}
                className="text-sm bg-black text-white px-2 py-[2px] rounded-lg"
              >
                Qaytish
              </button>
              <button
                onClick={changeUsername}
                className="text-sm bg-black text-white px-2 py-[2px] rounded-lg"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
      {showNumberModul && (
        <div className="fixed z-[98] flex items-center top-0 justify-center w-full h-screen">
          <div className="rounded-md bg-white border-2 border-black text-lg p-6">
            <p className="text-red-600 font-[700] text-xs ml-2">
              {formErrors.number}
            </p>
            <div className="flex items-center mt-1">
              <PhoneInput
                defaultCountry="UZ"
                className="border border-black p-2 rounded-lg w-full"
                value={phoneNumber}
                onChange={setPhoneNumber}
                international
                limitMaxLength
                ref={phoneNumberRef}
              />
            </div>
            <div className="flex items-center justify-around mt-6">
              <button
                onClick={() => {
                  setShowNumberModul(false);
                  setPhoneNumber(user.phoneNumber || "");
                  setFormErrors({});
                }}
                className="border text-sm text-white px-2 bg-black py-[2px] rounded-lg"
              >
                Qaytish
              </button>
              <button
                onClick={changePhoneNumber}
                className="border text-sm text-white bg-black px-2 py-[2px] rounded-lg"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
      {showRegionModul && (
        <div className="fixed z-[98] flex items-center top-0 justify-center w-full h-screen">
          <div className="rounded-md bg-white border-2 border-black text-lg p-6">
            <p className="text-red-600 font-[700] text-xs ml-1">
              {formErrors.country}
            </p>
            <div className="flex items-center mt-1">
              <div className="flex flex-col space-y-4 text-sm font-[700] text-right">
                <p>Davlat:</p>
                <p>Region:</p>
              </div>
              <div className="flex flex-col ml-[11px] space-y-4 w-60">
                <CountryDropdown
                  value={country}
                  onChange={(val) => {
                    setCountry(val);
                    setRegion("");
                  }}
                  defaultOptionLabel="Qaysi davlatdasiz?"
                />
                <RegionDropdown
                  country={country}
                  value={region}
                  onChange={(val) => setRegion(val)}
                  defaultOptionLabel="Qaysi regiondasiz?"
                />
              </div>
            </div>
            <div className="flex items-center justify-around mt-6">
              <button
                onClick={() => {
                  setShowRegionModul(false);
                  setCountry(user.country || "");
                  setRegion(user.region || "");
                  setFormErrors({});
                }}
                className="border text-sm text-white px-2 bg-black py-[2px] rounded-lg"
              >
                Qaytish
              </button>
              <button
                onClick={changeRegion}
                className="border text-sm text-white bg-black px-2 py-[2px] rounded-lg"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
      {showLogOutModul && (
        <div className="fixed z-[98] flex items-center top-0 justify-center w-full h-screen">
          <div className="rounded-xl bg-black text-white text-lg p-6">
            <p>Tizimdan chiqishni xoxlaysizmi?</p>
            <div className="flex items-center justify-around mt-6">
              <button
                onClick={() => setShowLogOutModul(false)}
                className="border border-white w-16 rounded-lg"
              >
                YO'Q
              </button>
              <button
                onClick={signOutUser}
                className="border border-white w-16 rounded-lg"
              >
                HA
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative flex items-center justify-center py-6">
        <img
          onClick={() => bImageRef.current.click()}
          className="absolute z-10 w-full h-full object-cover cursor-pointer"
          src={
            backgroundImage
              ? backgroundImage
              : user.bgImage
              ? user.bgImage
              : defaultBgImage
          }
          alt=""
        />
        <Avatar
          onClick={() => userImageRef.current.click()}
          src={uImage ? uImage : user.image}
          style={{
            height: 120,
            width: 120,
            cursor: "pointer",
          }}
          className="absolute z-20 overflow-hidden"
        />
        {showSaveImageBtn && (
          <button
            onClick={addImagesToDB}
            className="bottom-2 absolute z-20 right-2 bg-black text-white opacity-80 rounded-lg px-2 pb-[2px]"
          >
            Saqlash
          </button>
        )}
        {showSaveImageBtn && (
          <button
            onClick={deleteImage}
            className="bottom-2 absolute z-20 left-2 bg-black text-white opacity-80 rounded-lg px-2 pb-[2px]"
          >
            Bekor qilish
          </button>
        )}
        <input
          type="file"
          ref={bImageRef}
          hidden
          onChange={addBImageToState}
          accept="image/*"
        />
        <input
          type="file"
          ref={userImageRef}
          hidden
          onChange={addUserImageToState}
          accept="image/*"
        />
      </div>
      <div>
        <ListItemButton
          onClick={() => setShowUsernameModul(true)}
          component="a"
        >
          <div className="px-1">
            <h4 className="text-lg font-[600] truncate">
              {user.username}{" "}
              <span>
                <EditIcon
                  style={{
                    fontSize: 20,
                    marginTop: -6,
                    cursor: "pointer",
                  }}
                />
              </span>
            </h4>
            <p className="text-xs -mt-[4px] truncate">{user.email}</p>
          </div>
        </ListItemButton>
        <Divider variant="middle" />
        <ListItemButton onClick={() => setShowNumberModul(true)} component="a">
          <div className="px-1">
            <h4 className="text-lg font-[600]">
              {user.phoneNumber || "Raqamingizni kiriting!"}{" "}
              <span>
                <EditIcon
                  style={{
                    fontSize: 20,
                    marginTop: -6,
                    cursor: "pointer",
                  }}
                />
              </span>
            </h4>
            <p className="text-xs -mt-[4px]">Telefon raqamingiz</p>
          </div>
        </ListItemButton>
        <Divider variant="middle" />
        <ListItemButton onClick={() => setShowRegionModul(true)} component="a">
          <div className="px-1">
            <h4 className="text-lg font-[600] truncate">
              {user.country || "Davlat va Regioningizni belgilang!"}{" "}
              <span>
                <EditIcon
                  style={{
                    fontSize: 20,
                    marginTop: -6,
                    cursor: "pointer",
                  }}
                />
              </span>
            </h4>
            <p className="text-xs -mt-[4px] truncate">
              {user.region || "Region"}
            </p>
          </div>
        </ListItemButton>
        <Divider variant="middle" />
        <div className="py-2 px-2 mx-4 border-b border-x border-gray-300 font-[600]">
          <div className="flex items-center">
            <PersonAddAlt1Icon style={{ fontSize: 20, color: "green" }} />
            <p className="ml-2 text-green-700">
              {user.workedWith}ta odamni ish bilan ta'minlagansiz
            </p>
          </div>
          <div className="flex items-center">
            <AddHomeIcon
              style={{
                fontSize: 20,
                color: "blue",
                marginLeft: -2,
                marginRight: 2,
              }}
            />
            <p className="ml-2 text-blue-700">
              {user.homeAdds}ta uy ijarasi uchun e'lon bergansiz
            </p>
          </div>
          <div className="flex items-center">
            <ContactEmergencyIcon
              style={{
                fontSize: 16,
                color: "indigo",
                marginLeft: 1,
                marginRight: 2,
              }}
            />
            <p className="ml-2 text-purple-900">
              {user.jobAdds}ta ish uchun e'lon bergansiz
            </p>
          </div>
          <div className="flex items-center">
            <EngineeringIcon
              style={{ fontSize: 20, color: "maroon", marginRight: -1 }}
            />
            <p className="ml-2 text-red-900">
              {user.workedJobs}ta ish olgansiz
            </p>
          </div>
        </div>
        <p className="font-bold ml-5 pt-3">Sozlamalar</p>
        <ListItemButton onClick={() => setDarkMode(!darkMode)} component="a">
          <Switch
            color="default"
            size="small"
            style={{ color: darkMode ? "white" : "black" }}
            checked={darkMode}
            inputProps={{ "aria-label": "controlled" }}
            className="-ml-1"
          />
          <p className="text-lg font-[600] ml-3">Ilova Ranggi</p>
        </ListItemButton>
        <Divider />
        <ListItemButton
          onClick={() => navigate("/profile/jobsHistory")}
          component="a"
        >
          <WorkHistoryIcon style={{ fontSize: 24, marginLeft: 4 }} />
          <p className="text-lg font-[600] ml-5">Ishlar Tarixi</p>
        </ListItemButton>
        <Divider />
        <ListItemButton
          onClick={() => navigate("/profile/homesHistory")}
          component="a"
        >
          <DomainAddIcon style={{ fontSize: 24, marginLeft: 4 }} />
          <p className="text-lg font-[600] ml-5">Uy Ijaralari Tarixi</p>
        </ListItemButton>
        <Divider />
        <ListItemButton component="a">
          <LanguageIcon style={{ fontSize: 24, marginTop: 1, marginLeft: 4 }} />
          <p className="text-lg font-[600] ml-5">Tilni O'zgartirish</p>
        </ListItemButton>
        <Divider />
        <ListItemButton component="a">
          <HeadsetMicIcon
            style={{ fontSize: 24, marginTop: 1, marginLeft: 4 }}
          />
          <p className="text-lg font-[600] ml-5">Yordam</p>
        </ListItemButton>
        <Divider />
        <ListItemButton component="a">
          <PrivacyTipIcon
            style={{ fontSize: 24, marginTop: 1, marginLeft: 4 }}
          />
          <p className="text-lg font-[600] ml-5">Ilova Qoidalari</p>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => setShowLogOutModul(true)} component="a">
          <LogoutIcon style={{ fontSize: 24, marginTop: 1, marginLeft: 5 }} />
          <p className="text-lg font-[600] ml-5">Tizimdan Chiqish</p>
        </ListItemButton>
        <Divider />
      </div>
    </div>
  );
}

export default Profile;
