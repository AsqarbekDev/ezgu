import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";
import { ListItemButton } from "@mui/material";

function ActionModul({
  text,
  cancelFunction,
  confirmFunction,
  errorModul,
  errorModulExit,
  exitFunction,
  buttonName,
}) {
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  return (
    <div className="fixed z-[98] max-w-2xl flex items-center top-0 bottom-0 justify-center w-full">
      <div
        style={{ borderColor: theme.border }}
        className={`${
          theme.type === "dark" && "border-2"
        } rounded-xl bg-black text-white text-lg p-6 mx-10 text-center`}
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
    </div>
  );
}

export default ActionModul;
