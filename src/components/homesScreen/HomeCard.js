import { Avatar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CurrencyRubleIcon from "@mui/icons-material/CurrencyRuble";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import MessageIcon from "@mui/icons-material/Message";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./HomeCard.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

function HomeCard({
  id,
  userImage,
  userName,
  userID,
  image1,
  image2,
  image3,
  image4,
  rent,
  location,
  line,
  station,
  comment,
  uploadedTime,
  userPhoneNumber,
  history,
}) {
  const target = useRef(null);

  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showRemoveHomeModul, setShowRemoveHomeModul] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    const newImages = [];

    if (image1) {
      newImages.push({
        image: image1,
        id: id,
      });
    }
    if (image2) {
      newImages.push({
        image: image2,
        id: id,
      });
    }
    if (image3) {
      newImages.push({
        image: image3,
        id: id,
      });
    }
    if (image4) {
      newImages.push({
        image: image4,
        id: id,
      });
    }

    setImages(newImages);
  }, [image1, image2, image3, image4, id]);

  // const scrollImage = (index, id) => {
  //   document
  //     .querySelector(`#slide-${index > 3 ? 0 : index}-${id}`)
  //     .scrollIntoView();
  // };

  const scrollListener = () => {
    if (!target.current) {
      return;
    }

    const element = target.current;
    const windowScroll = element.scrollLeft;
    const totalWidth = element.scrollWidth - element.clientWidth;
    if (windowScroll >= 0 && windowScroll <= totalWidth / images.length) {
      setCurrent(0);
    }
    if (
      windowScroll > totalWidth / images.length &&
      windowScroll <= (totalWidth / images.length) * 2
    ) {
      setCurrent(1);
    }
    if (
      windowScroll > (totalWidth / images.length) * 2 &&
      windowScroll <= (totalWidth / images.length) * 3
    ) {
      setCurrent(2);
    }
    if (
      windowScroll > (totalWidth / images.length) * 3 &&
      windowScroll <= (totalWidth / images.length) * 4
    ) {
      setCurrent(3);
    }
  };

  useEffect(() => {
    const element = target.current;
    element.addEventListener("scroll", scrollListener);
    return () =>
      element && element.removeEventListener("scroll", scrollListener);
  });

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(userPhoneNumber)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteHome = async () => {
    setShowRemoveHomeModul(false);
    setLoading(true);
    await updateDoc(doc(db, "homes", id), {
      disabled: true,
      deleted: true,
    });
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <>
          <div
            role="status"
            className="fixed z-[100] flex items-center -mt-[41px] justify-center -top-2 bottom-0 left-0 right-0"
          >
            <div className="w-40 h-40 rounded-3xl pl-2 bg-black flex flex-col items-center justify-center">
              <svg
                aria-hidden="true"
                className="mr-2 w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-black"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <p className="text-white text-sm -ml-1 mt-3">Yuklanyabdi...</p>
            </div>
          </div>
          <div className="fixed z-[99] flex items-center -mt-[41px] justify-center -top-2 bottom-0 left-0 right-0 bg-black opacity-20"></div>
        </>
      )}
      {showRemoveHomeModul && (
        <div className="fixed z-[98] flex items-center -mt-[41px] justify-center top-0 bottom-0 left-0 right-0">
          <div className="rounded-xl bg-black text-white text-lg p-6">
            <p>E'lonni o'chirishni xoxlaysizmi?</p>
            <div className="flex items-center justify-around mt-6">
              <button
                onClick={() => setShowRemoveHomeModul(false)}
                className="border border-white w-16 rounded-lg"
              >
                YO'Q
              </button>
              <button
                onClick={deleteHome}
                className="border border-white w-16 rounded-lg"
              >
                HA
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative bg-white m-2 rounded-lg shadow-lg pb-3">
        <div className="flex items-center p-2">
          <Avatar
            style={{ height: 32, width: 32 }}
            alt={userName}
            src={userImage}
          />
          <h2 className="font-bold mx-2 flex-1 truncate">{userName}</h2>
          {userID === user?.uid && !history ? (
            <DeleteForeverIcon
              onClick={() => setShowRemoveHomeModul(true)}
              style={{ fontSize: 28, cursor: "pointer" }}
            />
          ) : !history ? (
            <EmailIcon
              onClick={() =>
                user ? navigate(`/chats/${userID}`) : navigate("/signUp")
              }
              style={{ fontSize: 30, cursor: "pointer" }}
            />
          ) : null}
        </div>
        <div
          style={{ scrollSnapType: "x mandatory" }}
          className="imageContainer flex items-center overflow-x-scroll"
          ref={target}
        >
          {images.map(({ image, id }, index) => {
            return (
              <img
                key={index}
                id={`slide-${index}-${id}`}
                style={{ scrollSnapAlign: "start" }}
                className="homeImage"
                src={image}
                alt=""
              />
            );
          })}
        </div>
        <div className="absolute z-10 top-[288px] w-full flex items-center justify-center space-x-2">
          {images.map(({ image, id }, index) => {
            return (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-white flex items-center justify-center"
                // onClick={() => {
                //   scrollImage(index, id);
                // }}
              >
                <div
                  className={`${
                    current === index && "bg-white"
                  } w-3 h-3 rounded-full`}
                >
                  {current !== index && (
                    <img
                      className="w-3 h-3 rounded-full object-cover"
                      src={image}
                      alt=""
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center font-bold text-lg">
              <p className="text-[#34b804]">{rent}</p>
              <CurrencyRubleIcon
                style={{ fontSize: 16, marginTop: -1, color: "#c7a10a" }}
              />
            </div>
            <div className="flex items-center font-bold text-sm">
              <WatchLaterIcon
                style={{ fontSize: 16, marginTop: -1, color: "#4a4847" }}
              />
              <p className="text-[#4a4847] ml-1">
                {dayjs.unix(uploadedTime).format("HH:mm")}
              </p>
              <p className="text-[#4a4847] ml-3">
                {dayjs.unix(uploadedTime).format("D/M/YYYY")}
              </p>
            </div>
          </div>
          <div className="flex items-start text-sm font-[600]">
            <PhoneAndroidIcon
              style={{
                fontSize: 14,
                marginLeft: -2,
                marginTop: 2,
                marginRight: 3,
              }}
            />
            <p className="-mt-[0.5px]">{userPhoneNumber}</p>
            <button
              onClick={handleCopyClick}
              className={`${
                isCopied ? "bg-gray-300" : "bg-white"
              } ml-2 border ${
                !isCopied && "hover:bg-gray-200"
              } border-black rounded-lg px-2 text-xs`}
            >
              {isCopied ? "Nusxalandi!" : "Nusxalash"}
            </button>
          </div>
          <div className="flex items-start text-sm font-[600] mt-[2px]">
            <PlaceIcon
              style={{
                fontSize: 16,
                marginLeft: -3,
                marginTop: 2,
                marginRight: 3,
              }}
            />
            <p className="overflow-hidden">{location}</p>
          </div>
          {line !== "Неизвестный" && (
            <div className="flex items-start text-sm font-[600] mt-[2px]">
              <DirectionsTransitIcon
                style={{
                  fontSize: 16,
                  marginTop: 2,
                  marginLeft: -3,
                  marginRight: 3,
                }}
              />
              <p className="overflow-hidden">
                {line} {station}
              </p>
            </div>
          )}
          <div
            onClick={() => setShowComments(!showComments)}
            className="flex relative items-start text-xs font-[500] mt-1 cursor-pointer"
          >
            <MessageIcon
              style={{
                fontSize: 13,
                marginTop: 3.6,
                marginLeft: -1,
                marginRight: 4,
              }}
            />
            <p
              className={
                !showComments
                  ? "line-clamp-2 overflow-hidden"
                  : "overflow-hidden"
              }
            >
              {comment}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeCard;
