import React, { useEffect, useRef, useState } from "react";
import addImageIcon from "../assets/addImage.png";
import closeGreen from "../assets/close_green.webp";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PinDropIcon from "@mui/icons-material/PinDrop";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import PublicIcon from "@mui/icons-material/Public";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { moscowMetroList } from "../assets/moscowMetroList";
import { Avatar, MenuItem, TextField } from "@mui/material";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import LoadingModul from "../components/LoadingModul";
import dayjs from "dayjs";
import ExitHeader from "../components/ExitHeader";
import ActionModul from "../components/ActionModul";

function AddNewHome() {
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);
  const image4Ref = useRef(null);

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [salary, setSalary] = useState("");
  const [workingPlace, setWorkingPlace] = useState("");
  const [comment, setComment] = useState("");
  const [line, setLine] = useState(moscowMetroList[0].line);
  const [station, setStation] = useState(moscowMetroList[0].stations[0]);
  const [lineIndex, setLineIndex] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [formDisabled, setFormDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModul, setShowErrorModul] = useState("");
  const [addedHomes, setAddedHomes] = useState([]);

  const user = useSelector(selectUser);

  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [country, setCountry] = useState(user.country || "");
  const [region, setRegion] = useState("");
  const [currency, setCurrency] = useState("RUB");

  const navigate = useNavigate();

  const currencies = [
    {
      value: "USD",
      label: "$",
    },
    {
      value: "EUR",
      label: "€",
    },
    {
      value: "RUB",
      label: "₽",
    },
    {
      value: "UZS",
      label: "so'm",
    },
  ];

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  useEffect(() => {
    const checkLimit = async () => {
      const q = query(
        collection(db, "homes"),
        where("userID", "==", user.uid),
        where("uploadedTime", ">", dayjs().unix() - 86400)
      );
      const querySnapshot = await getDocs(q);
      const allHomes = [];
      querySnapshot.forEach((doc) => {
        allHomes.push(doc.id);
      });
      setAddedHomes(allHomes);
    };
    checkLimit();
  }, [user.uid]);

  useEffect(() => {
    setLine(moscowMetroList[lineIndex].line);
    setStation(moscowMetroList[lineIndex].stations[0]);
  }, [lineIndex]);

  const checkForm = () => {
    const errors = {};

    if (image1 || image2 || image3 || image4) {
    } else {
      errors.images = "Iltimos rasm joylang!";
    }

    if (!salary || salary.replace(/\s/g, "").length <= 0) {
      errors.salary = "Oylik to'lov narxini kiriting!";
    }

    if (!workingPlace || workingPlace.replace(/\s/g, "").length <= 0) {
      errors.workingPlace = "Uy manzilini kiriting!";
    }
    if (!comment || comment.replace(/\s/g, "").length <= 0) {
      errors.comment = "Kommentariya kiriting!";
    }
    if (!country || !region) {
      errors.country = "Davlat va Regionni kiriting!";
    }
    if (country === "Russian Federation" && region === "Moscow") {
      if (line === moscowMetroList[0].line) {
        errors.metro = "Uyga yaqin metroni kiriting!";
      }
    }
    if (!phoneNumber || phoneNumber?.length < 10 || phoneNumber?.length > 20) {
      errors.number = "Telefon raqamingizni kiriting!";
    }

    if (Object.keys(errors).length === 0) {
      setFormDisabled(true);
      uploadToDB();
    }
    return errors;
  };

  const handleSubmit = () => {
    setFormErrors(checkForm());
  };

  const uploadToDB = () => {
    if (addedHomes.length < 4) {
      setLoading(true);
      addDoc(collection(db, "homes"), {
        rent: salary,
        currency,
        location: workingPlace,
        comment,
        line,
        station,
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        userID: user.uid,
        userName: user.username,
        userImage: user.image,
        userEmail: user.email,
        userPhoneNumber: phoneNumber,
        userRegion: user.region,
        country,
        region,
        uploadedTime: dayjs().unix(),
        disabled: false,
        deleted: false,
      })
        .then(async (docRef) => {
          await updateDoc(doc(db, "users", user.uid), {
            phoneNumber,
            country,
            region,
            homeAdds: user.homeAdds + 1,
          });
          if (image1) {
            const storageRef = ref(
              storage,
              `homes/${docRef.id}/${Date.now()}-${Math.floor(
                Math.random() * 100
              )}`
            );
            const uploadTask = uploadBytesResumable(
              storageRef,
              image1Ref.current.files[0]
            );
            uploadTask.on(
              "state_changed",
              (snapshot) => {},
              (error) => {
                console.log(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                  async (downloadURL) => {
                    await updateDoc(doc(db, "homes", docRef.id), {
                      image1: downloadURL,
                    });
                  }
                );
              }
            );
          }
          if (image2) {
            const storageRef = ref(
              storage,
              `homes/${docRef.id}/${Date.now()}-${Math.floor(
                Math.random() * 100
              )}`
            );
            const uploadTask = uploadBytesResumable(
              storageRef,
              image2Ref.current.files[0]
            );
            uploadTask.on(
              "state_changed",
              (snapshot) => {},
              (error) => {
                console.log(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                  async (downloadURL) => {
                    await updateDoc(doc(db, "homes", docRef.id), {
                      image2: downloadURL,
                    });
                  }
                );
              }
            );
          }
          if (image3) {
            const storageRef = ref(
              storage,
              `homes/${docRef.id}/${Date.now()}-${Math.floor(
                Math.random() * 100
              )}`
            );
            const uploadTask = uploadBytesResumable(
              storageRef,
              image3Ref.current.files[0]
            );
            uploadTask.on(
              "state_changed",
              (snapshot) => {},
              (error) => {
                console.log(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                  async (downloadURL) => {
                    await updateDoc(doc(db, "homes", docRef.id), {
                      image3: downloadURL,
                    });
                  }
                );
              }
            );
          }
          if (image4) {
            const storageRef = ref(
              storage,
              `homes/${docRef.id}/${Date.now()}-${Math.floor(
                Math.random() * 100
              )}`
            );
            const uploadTask = uploadBytesResumable(
              storageRef,
              image4Ref.current.files[0]
            );
            uploadTask.on(
              "state_changed",
              (snapshot) => {},
              (error) => {
                console.log(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                  async (downloadURL) => {
                    await updateDoc(doc(db, "homes", docRef.id), {
                      image4: downloadURL,
                    });
                  }
                );
              }
            );
          }

          setLoading(false);
          navigate("/add");
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    } else {
      setShowErrorModul("Kuniga faqat 4ta e'lon berishingiz mumkin!");
    }
  };

  const addImage1 = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImage1(readerEvent.target.result);
    };
  };

  const addImage2 = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImage2(readerEvent.target.result);
    };
  };

  const addImage3 = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImage3(readerEvent.target.result);
    };
  };

  const addImage4 = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImage4(readerEvent.target.result);
    };
  };

  const removeImage1 = () => {
    setImage1(null);
  };
  const removeImage2 = () => {
    setImage2(null);
  };
  const removeImage3 = () => {
    setImage3(null);
  };
  const removeImage4 = () => {
    setImage4(null);
  };

  return (
    <div>
      <ExitHeader screenName="E'lonni to'ldiring" />
      {loading && <LoadingModul />}
      {showErrorModul && (
        <ActionModul
          text={showErrorModul}
          exitFunction={() => navigate("/homes")}
          errorModulExit
          buttonName={"Chiqish"}
        />
      )}
      <div className="p-2">
        <div className="bg-white shadow-xl rounded-lg px-2 py-4">
          <div className="flex flex-col items-center">
            <Avatar
              style={{
                height: 60,
                width: 60,
                borderWidth: 3,
                borderColor: "black",
              }}
              alt={user.username}
              src={user.image}
            />
          </div>
          <h2 className="font-bold truncate text-center">{user.username}</h2>
          <div className="flex items-center mt-3 justify-between mx-1">
            <div className="relative">
              <div
                onClick={() => !image1 && image1Ref.current.click()}
                className={`rounded-lg overflow-hidden h-14 w-18 ${
                  !image1 && "cursor-pointer"
                }`}
              >
                {image1 ? (
                  <img className="object-cover h-14 w-18" src={image1} alt="" />
                ) : (
                  <img
                    className="object-cover h-14 w-18"
                    src={addImageIcon}
                    alt=""
                  />
                )}
              </div>
              {image1 && (
                <img
                  onClick={() => !formDisabled && removeImage1()}
                  className="absolute z-10 top-7 left-8 h-10 w-10 cursor-pointer"
                  src={closeGreen}
                  alt=""
                />
              )}
            </div>
            <div className="relative">
              <div
                onClick={() => !image2 && image2Ref.current.click()}
                className={`rounded-lg overflow-hidden h-14 w-18 ${
                  !image2 && "cursor-pointer"
                }`}
              >
                {image2 ? (
                  <img className="object-cover h-14 w-18" src={image2} alt="" />
                ) : (
                  <img
                    className="object-cover h-14 w-18"
                    src={addImageIcon}
                    alt=""
                  />
                )}
              </div>
              {image2 && (
                <img
                  onClick={() => !formDisabled && removeImage2()}
                  className="absolute z-10 top-7 left-8 h-10 w-10 cursor-pointer"
                  src={closeGreen}
                  alt=""
                />
              )}
            </div>
            <div className="relative">
              <div
                onClick={() => !image3 && image3Ref.current.click()}
                className={`rounded-lg overflow-hidden h-14 w-18 ${
                  !image3 && "cursor-pointer"
                }`}
              >
                {image3 ? (
                  <img className="object-cover h-14 w-18" src={image3} alt="" />
                ) : (
                  <img
                    className="object-cover h-14 w-18"
                    src={addImageIcon}
                    alt=""
                  />
                )}
              </div>
              {image3 && (
                <img
                  onClick={() => !formDisabled && removeImage3()}
                  className="absolute z-10 top-7 left-8 h-10 w-10 cursor-pointer"
                  src={closeGreen}
                  alt=""
                />
              )}
            </div>
            <div className="relative">
              <div
                onClick={() => !image4 && image4Ref.current.click()}
                className={`rounded-lg overflow-hidden h-14 w-18 ${
                  !image4 && "cursor-pointer"
                }`}
              >
                {image4 ? (
                  <img className="object-cover h-14 w-18" src={image4} alt="" />
                ) : (
                  <img
                    className="object-cover h-14 w-18"
                    src={addImageIcon}
                    alt=""
                  />
                )}
              </div>
              {image4 && (
                <img
                  onClick={() => !formDisabled && removeImage4()}
                  className="absolute z-10 top-7 left-8 h-10 w-10 cursor-pointer"
                  src={closeGreen}
                  alt=""
                />
              )}
            </div>
            <input
              type="file"
              ref={image1Ref}
              hidden
              onChange={addImage1}
              disabled={formDisabled}
              accept="image/*"
            />
            <input
              type="file"
              ref={image2Ref}
              hidden
              onChange={addImage2}
              disabled={formDisabled}
              accept="image/*"
            />
            <input
              type="file"
              ref={image3Ref}
              hidden
              onChange={addImage3}
              disabled={formDisabled}
              accept="image/*"
            />
            <input
              type="file"
              ref={image4Ref}
              hidden
              onChange={addImage4}
              disabled={formDisabled}
              accept="image/*"
            />
          </div>
          <p className="ml-3 text-red-600 font-[600] text-sm">
            {formErrors.images}
          </p>
          <div className="flex items-center mt-4">
            <LocalAtmIcon style={{ fontSize: 20 }} />
            <input
              className="ml-2 border border-black outline-[#0fdbff]  rounded-lg py-1 px-2 w-full"
              placeholder="Oylik to'lov narxini kiriting..."
              type="number"
              value={salary}
              onChange={(e) => {
                e.target.value.length < 8 && setSalary(e.target.value);
              }}
              disabled={formDisabled}
            />
            <div className="ml-2 -mt-4">
              <TextField
                id="outlined-select-currency"
                select
                value={currency}
                onChange={handleChange}
                className="w-20 h-10"
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.salary}
          </p>
          <div className="flex items-center mt-4">
            <PinDropIcon style={{ fontSize: 20 }} />
            <input
              className="ml-2 border border-black outline-[#0fdbff]  rounded-lg py-1 px-2 w-full"
              placeholder="Uy manzilini kiriting..."
              type="text"
              maxLength={100}
              value={workingPlace}
              onChange={(e) => setWorkingPlace(e.target.value)}
              disabled={formDisabled}
            />
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.workingPlace}
          </p>
          <div className="flex items-center mt-4">
            <MessageOutlinedIcon style={{ fontSize: 18 }} />
            <textarea
              className="ml-2 text-sm border border-black outline-[#0fdbff]  rounded-lg py-1 px-2 w-full"
              placeholder="Kommentariya qoldiring..."
              type="text"
              maxLength={300}
              rows="6"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={formDisabled}
            />
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.comment}
          </p>
          <div className="flex items-center mt-4">
            <PhoneAndroidIcon style={{ fontSize: 18 }} />
            <PhoneInput
              defaultCountry="UZ"
              className="ml-2 border border-black p-2 rounded-lg w-full"
              value={phoneNumber}
              onChange={setPhoneNumber}
              international
              limitMaxLength
              disabled={formDisabled}
            />
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.number}
          </p>
          <div className="flex items-center mt-4">
            <PublicIcon style={{ fontSize: 20 }} />
            <div className="flex flex-col ml-5 space-y-4 text-sm font-[700] text-right">
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
                disabled={formDisabled}
              />
              <RegionDropdown
                country={country}
                value={region}
                onChange={(val) => setRegion(val)}
                defaultOptionLabel="Qaysi regiondasiz?"
                disabled={formDisabled}
              />
            </div>
          </div>
          <p className="ml-9 text-red-600 font-[600] text-sm">
            {formErrors.country}
          </p>
          {country === "Russian Federation" && region === "Moscow" && (
            <>
              <div className="flex items-center space-x-3 mt-4">
                <DirectionsTransitIcon style={{ fontSize: 20 }} />
                <div className="flex flex-col space-y-4 text-sm font-[700] text-right">
                  <p>Liniya:</p>
                  <p>Stansiya:</p>
                </div>
                <div className="flex flex-col space-y-4">
                  <select
                    disabled={formDisabled}
                    onChange={(e) => {
                      setLineIndex(e.target.value);
                    }}
                    name="Liniya"
                    id="Liniya"
                  >
                    {moscowMetroList.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item.line}
                        </option>
                      );
                    })}
                  </select>

                  <select
                    disabled={formDisabled}
                    onChange={(e) => {
                      setStation(e.target.value);
                    }}
                    name="Stansiya"
                    id="Stansiya"
                  >
                    {moscowMetroList[lineIndex].stations.map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <p className="ml-9 text-red-600 font-[600] text-sm">
                {formErrors.metro}
              </p>
            </>
          )}
          <div className="flex justify-center mt-6 mb-2">
            <button
              onClick={handleSubmit}
              className="bg-black text-white my-2 text-sm py-1 rounded-lg w-[60%]"
              disabled={formDisabled}
            >
              SAQLASH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewHome;
