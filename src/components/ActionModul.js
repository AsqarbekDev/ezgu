import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";

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
            <button
              onClick={() => exitFunction()}
              className="border border-white px-4 rounded-lg"
            >
              {buttonName}
            </button>
          )}
          {!errorModulExit && (
            <button
              onClick={() => cancelFunction(false)}
              className={`border border-white ${
                errorModul ? "px-4" : "w-16"
              } rounded-lg`}
            >
              {errorModul
                ? language.actionModul.exitBtn
                : language.actionModul.noBtn}
            </button>
          )}
          {!errorModul && !errorModulExit && (
            <button
              onClick={confirmFunction}
              className="border border-white w-16 rounded-lg"
            >
              {language.actionModul.yesBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActionModul;
