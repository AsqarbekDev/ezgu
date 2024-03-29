import React, { useRef } from "react";
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
import { Avatar, Divider, ListItemButton, Switch } from "@mui/material";
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
import { useCookies } from "react-cookie";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";
import ActionModul from "../components/ActionModul";
import { setDisableScroll } from "../features/disableScrollSlice";

function Profile() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  const bImageRef = useRef(null);
  const userImageRef = useRef(null);
  const usernameRef = useRef(null);
  const phoneNumberRef = useRef(null);

  const [, setCookie] = useCookies(["theme"]);
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
      errors.username = language.profile.enterNameError;
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setShowUsernameModul(false);
      dispatch(setDisableScroll(false));
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
      errors.number = language.profile.enterNumberError;
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setShowNumberModul(false);
      dispatch(setDisableScroll(false));
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
      errors.country = language.profile.enterRegionError;
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setShowRegionModul(false);
      dispatch(setDisableScroll(false));
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
    <div
      style={{ backgroundColor: theme.background, color: theme.textColor }}
      className="pb-[50px] xl:pb-1"
    >
      {loading && <LoadingModul />}
      {showErrorModul && (
        <ActionModul
          text={language.profile.errorModulText}
          cancelFunction={(value) => setShowErrorModul(value)}
          errorModul
        />
      )}
      {showUsernameModul && (
        <div>
          <div
            style={{
              backgroundColor: theme.background,
              color: theme.textColor,
              borderColor: theme.border,
            }}
            className="fixed z-[100] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md border-2 text-lg p-6 w-[90%] max-w-xs"
          >
            <p className="text-red-600 font-[700] text-xs ml-2">
              {formErrors.username}
            </p>
            <input
              style={{
                borderColor: theme.border,
                outlineColor: theme.border,
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={language.profile.enterName}
              className="p-1 m-1 bg-white text-black border rounded-md w-full"
              type="text"
              maxLength={40}
              ref={usernameRef}
            />
            <div className="flex items-center justify-around mt-6">
              <div
                style={{ borderColor: theme.border }}
                onClick={() => {
                  setShowUsernameModul(false);
                  dispatch(setDisableScroll(false));
                  setUsername(user.username);
                  setFormErrors({});
                }}
                className={`${
                  theme.type === "dark" && "border"
                } text-sm bg-black text-white w-24 rounded-lg overflow-hidden`}
              >
                <ListItemButton>
                  <p className="w-full text-center -my-1">
                    {language.profile.cancel}
                  </p>
                </ListItemButton>
              </div>
              <div
                style={{ borderColor: theme.border }}
                onClick={changeUsername}
                className={`${
                  theme.type === "dark" && "border"
                } text-sm bg-black text-white w-24 rounded-lg overflow-hidden`}
              >
                <ListItemButton>
                  <p className="w-full text-center -my-1">
                    {language.profile.save}
                  </p>
                </ListItemButton>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              setShowUsernameModul(false);
              dispatch(setDisableScroll(false));
              setUsername(user.username);
              setFormErrors({});
            }}
            className="fixed z-[98] max-w-2xl top-0 w-full h-screen"
          ></div>
        </div>
      )}
      {showNumberModul && (
        <div>
          <div
            style={{
              backgroundColor: theme.background,
              borderColor: theme.border,
              color: "black",
            }}
            className="fixed z-[100] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md border-2 text-lg p-6 w-[90%] max-w-xs"
          >
            <p className="text-red-600 font-[700] text-xs ml-2">
              {formErrors.number}
            </p>
            <div className="flex items-center mt-1">
              <PhoneInput
                defaultCountry="UZ"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                }}
                className="border p-2 rounded-lg w-full"
                value={phoneNumber}
                onChange={setPhoneNumber}
                international
                limitMaxLength
                ref={phoneNumberRef}
              />
            </div>
            <div className="flex items-center justify-around mt-6">
              <div
                style={{ borderColor: theme.border }}
                onClick={() => {
                  setShowNumberModul(false);
                  dispatch(setDisableScroll(false));
                  setPhoneNumber(user.phoneNumber || "");
                  setFormErrors({});
                }}
                className={`${
                  theme.type === "dark" && "border"
                } text-sm text-white w-24 bg-black rounded-lg overflow-hidden`}
              >
                <ListItemButton>
                  <p className="w-full text-center -my-1">
                    {language.profile.cancel}
                  </p>
                </ListItemButton>
              </div>
              <div
                style={{ borderColor: theme.border }}
                onClick={changePhoneNumber}
                className={`${
                  theme.type === "dark" && "border"
                } text-sm text-white bg-black w-24 rounded-lg overflow-hidden`}
              >
                <ListItemButton>
                  <p className="w-full text-center -my-1">
                    {language.profile.save}
                  </p>
                </ListItemButton>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              setShowNumberModul(false);
              dispatch(setDisableScroll(false));
              setPhoneNumber(user.phoneNumber || "");
              setFormErrors({});
            }}
            className="fixed z-[98] max-w-2xl top-0 w-full h-screen"
          ></div>
        </div>
      )}
      {showRegionModul && (
        <div>
          <div
            style={{
              backgroundColor: theme.background,
              borderColor: theme.border,
              color: theme.textColor,
            }}
            className="fixed z-[100] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md border-2 text-lg p-6 w-[90%] max-w-xs"
          >
            <p className="text-red-600 font-[700] text-xs ml-1">
              {formErrors.country}
            </p>
            <div className="flex items-center mt-1">
              <div className="flex flex-col space-y-4 text-sm font-[700] text-right">
                <p>{language.profile.country}</p>
                <p>{language.profile.region}</p>
              </div>
              <div className="flex text-black flex-col ml-[11px] space-y-4 w-[70%]">
                <CountryDropdown
                  value={country}
                  onChange={(val) => {
                    setCountry(val);
                    setRegion("");
                  }}
                  defaultOptionLabel={language.profile.countryDefault}
                />
                <RegionDropdown
                  country={country}
                  value={region}
                  onChange={(val) => setRegion(val)}
                  defaultOptionLabel={language.profile.regionDefault}
                />
              </div>
            </div>
            <div className="flex items-center justify-around mt-6">
              <div
                onClick={() => {
                  setShowRegionModul(false);
                  dispatch(setDisableScroll(false));
                  setCountry(user.country || "");
                  setRegion(user.region || "");
                  setFormErrors({});
                }}
                className="border text-sm text-white w-24 bg-black rounded-lg overflow-hidden"
              >
                <ListItemButton>
                  <p className="w-full text-center -my-1">
                    {language.profile.cancel}
                  </p>
                </ListItemButton>
              </div>
              <div
                onClick={changeRegion}
                className="border text-sm text-white bg-black w-24 rounded-lg overflow-hidden"
              >
                <ListItemButton>
                  <p className="w-full text-center -my-1">
                    {language.profile.save}
                  </p>
                </ListItemButton>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              setShowRegionModul(false);
              dispatch(setDisableScroll(false));
              setCountry(user.country || "");
              setRegion(user.region || "");
              setFormErrors({});
            }}
            className="fixed z-[98] max-w-2xl top-0 w-full h-screen"
          ></div>
        </div>
      )}
      {showLogOutModul && (
        <ActionModul
          text={language.profile.logoutModulText}
          cancelFunction={(value) => setShowLogOutModul(value)}
          confirmFunction={signOutUser}
        />
      )}
      <div className="relative flex items-center justify-center py-6">
        {backgroundImage || user.bgImage ? (
          <img
            onClick={() => bImageRef.current.click()}
            className="absolute z-10 w-full h-full object-cover cursor-pointer"
            src={backgroundImage ? backgroundImage : user.bgImage}
            alt=""
          />
        ) : (
          <div
            onClick={() => bImageRef.current.click()}
            className="absolute z-10 w-full h-full cursor-pointer bg-gradient-to-b from-indigo-600"
          ></div>
        )}
        <Avatar
          onClick={() => userImageRef.current.click()}
          src={uImage ? uImage : user.image}
          style={{
            height: 120,
            width: 120,
          }}
          className="absolute z-20 overflow-hidden"
        />
        {showSaveImageBtn && (
          <div
            onClick={addImagesToDB}
            className="bottom-2 absolute z-20 right-2 bg-black text-white opacity-80 rounded-lg overflow-hidden"
          >
            <ListItemButton>
              <p className="w-full text-center -my-1">
                {language.profile.save}
              </p>
            </ListItemButton>
          </div>
        )}
        {showSaveImageBtn && (
          <div
            onClick={deleteImage}
            className="bottom-2 absolute z-20 left-2 bg-black text-white opacity-80 rounded-lg overflow-hidden"
          >
            <ListItemButton>
              <p className="w-full text-center -my-1">
                {language.profile.cancel}
              </p>
            </ListItemButton>
          </div>
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
          onClick={() => {
            setShowUsernameModul(true);
            dispatch(setDisableScroll(true));
          }}
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
        <Divider
          variant="middle"
          sx={{
            bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
          }}
        />
        <ListItemButton
          onClick={() => {
            setShowNumberModul(true);
            dispatch(setDisableScroll(true));
          }}
          component="a"
        >
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
            <p className="text-xs -mt-[4px]">{language.profile.phone}</p>
          </div>
        </ListItemButton>
        <Divider
          variant="middle"
          sx={{
            bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
          }}
        />
        <ListItemButton
          onClick={() => {
            setShowRegionModul(true);
            dispatch(setDisableScroll(true));
          }}
          component="a"
        >
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
        <Divider
          variant="middle"
          sx={{
            bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
          }}
        />
        <div className="py-2 px-2 mx-4 border-b border-x border-gray-300 font-[600]">
          <div className="flex items-center">
            <PersonAddAlt1Icon style={{ fontSize: 20, color: "green" }} />
            <p className="ml-2 text-green-700">
              {user.workedWith} {language.profile.gaveJobs}
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
              {user.homeAdds} {language.profile.addedHomeAds}
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
              {user.jobAdds} {language.profile.addedJobAds}
            </p>
          </div>
          <div className="flex items-center">
            <EngineeringIcon
              style={{ fontSize: 20, color: "maroon", marginRight: -1 }}
            />
            <p className="ml-2 text-red-900">
              {user.workedJobs} {language.profile.takenJobs}
            </p>
          </div>
        </div>
        <p className="font-bold ml-5 pt-3">{language.profile.settings}</p>
        <ListItemButton
          onClick={() =>
            theme.type === "light"
              ? setCookie("theme", "dark", { path: "/" })
              : setCookie("theme", "light", { path: "/" })
          }
          component="a"
        >
          <Switch
            color={theme.type === "light" ? "default" : "primary"}
            size="small"
            style={{
              color: theme.type === "dark" ? "white" : "black",
            }}
            checked={theme.type === "dark"}
            inputProps={{ "aria-label": "controlled" }}
            className="-ml-[3px]"
          />
          <p className="text-lg font-[600] ml-3">{language.profile.theme}</p>
        </ListItemButton>
        <Divider
          sx={{
            bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
          }}
        />
        <ListItemButton
          onClick={() => navigate("/profile/jobsHistory")}
          component="a"
        >
          <WorkHistoryIcon style={{ fontSize: 24, marginLeft: 4 }} />
          <p className="text-lg font-[600] ml-5">
            {language.profile.jobsHistory}
          </p>
        </ListItemButton>
        <Divider
          sx={{
            bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
          }}
        />
        <ListItemButton
          onClick={() => navigate("/profile/homesHistory")}
          component="a"
        >
          <DomainAddIcon style={{ fontSize: 24, marginLeft: 4 }} />
          <p className="text-lg font-[600] ml-5">
            {language.profile.homesHistory}
          </p>
        </ListItemButton>
        <Divider
          sx={{
            bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
          }}
        />
        <ListItemButton
          onClick={() => navigate("/profile/changeLanguage")}
          component="a"
        >
          <LanguageIcon style={{ fontSize: 24, marginTop: 1, marginLeft: 4 }} />
          <p className="text-lg font-[600] ml-5">
            {language.profile.changeLanguage}
          </p>
        </ListItemButton>
        <Divider
          sx={{
            bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
          }}
        />
        <ListItemButton
          onClick={() => navigate("/chats/vqd01tM0yxQZrtck92vHNafMvgg1")}
          component="a"
        >
          <HeadsetMicIcon
            style={{ fontSize: 24, marginTop: 1, marginLeft: 4 }}
          />
          <p className="text-lg font-[600] ml-5">{language.profile.help}</p>
        </ListItemButton>
        <Divider
          sx={{
            bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
          }}
        />
        <ListItemButton
          onClick={() => navigate("/profile/privacyAndPolicy")}
          component="a"
        >
          <PrivacyTipIcon
            style={{ fontSize: 24, marginTop: 1, marginLeft: 4 }}
          />
          <p className="text-lg font-[600] ml-5">{language.profile.rules}</p>
        </ListItemButton>
        <Divider
          sx={{
            bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
          }}
        />
        <ListItemButton onClick={() => setShowLogOutModul(true)} component="a">
          <LogoutIcon style={{ fontSize: 24, marginTop: 1, marginLeft: 5 }} />
          <p className="text-lg font-[600] ml-5">{language.profile.logout}</p>
        </ListItemButton>
        <Divider
          sx={{
            bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
          }}
        />
      </div>
    </div>
  );
}

export default Profile;
