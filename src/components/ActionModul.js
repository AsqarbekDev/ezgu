import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";
import { ListItemButton } from "@mui/material";
import { useEffect } from "react";
import { setDisableScroll } from "../features/disableScrollSlice";

function ActionModul({
  text,
  cancelFunction,
  confirmFunction,
  errorModul,
  errorModulExit,
  exitFunction,
  buttonName,
  inner,
}) {
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDisableScroll(true));
    return () => {
      dispatch(setDisableScroll(false));
    };
  }, [dispatch]);

  return (
    <>
      <div
        style={{ borderColor: theme.border }}
        className={`${
          theme.type === "dark" && "border-2"
        } fixed z-[100] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-xl bg-black text-white text-lg p-6 w-[90%] max-w-xs text-center`}
      >
        <p>{text}</p>
        <div className="flex items-center justify-around mt-6 space-x-4">
          {errorModulExit && (
            <div
              onClick={() => exitFunction()}
              className="border border-white rounded-lg overflow-hidden"
            >
              <ListItemButton>
                <p className="w-full text-center -my-2">{buttonName}</p>
              </ListItemButton>
            </div>
          )}
          {!errorModulExit && (
            <div
              onClick={() => cancelFunction(false)}
              className={`border border-white ${
                errorModul ? "" : "w-20"
              } rounded-lg overflow-hidden`}
            >
              <ListItemButton>
                <p className="w-full text-center -my-2">
                  {errorModul
                    ? language.actionModul.exitBtn
                    : language.actionModul.noBtn}
                </p>
              </ListItemButton>
            </div>
          )}
          {!errorModul && !errorModulExit && (
            <div
              onClick={confirmFunction}
              className="border border-white w-20 rounded-lg overflow-hidden"
            >
              <ListItemButton>
                <p className="w-full text-center -my-2">
                  {language.actionModul.yesBtn}
                </p>
              </ListItemButton>
            </div>
          )}
        </div>
      </div>
      <div
        onClick={() => cancelFunction(false)}
        className={`${
          inner && "-ml-4"
        } fixed z-[98] max-w-2xl top-0 bottom-0 w-full`}
      ></div>
    </>
  );
}

export default ActionModul;
