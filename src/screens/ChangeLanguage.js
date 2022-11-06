import { Divider, ListItemButton } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import ExitHeader from "../components/ExitHeader";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";
import { useCookies } from "react-cookie";
import CheckIcon from "@mui/icons-material/Check";

function ChangeLanguage() {
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);
  const [, setCookie] = useCookies(["language"]);

  return (
    <div style={{ backgroundColor: theme.background, color: theme.textColor }}>
      <ExitHeader screenName={language.changeLanguage.headerText} />
      <ListItemButton
        onClick={() => setCookie("language", "eng", { path: "/" })}
        className="h-14"
      >
        <p className="text-2xl font-[600] ml-6 flex-1">English</p>
        {language.type === "eng" && <CheckIcon style={{ fontSize: 30 }} />}
      </ListItemButton>
      <Divider
        light
        sx={{
          bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
        }}
      />
      <ListItemButton
        onClick={() => setCookie("language", "ru", { path: "/" })}
        className="h-14"
      >
        <p className="text-2xl font-[600] ml-6 flex-1">Русский</p>
        {language.type === "ru" && <CheckIcon style={{ fontSize: 30 }} />}
      </ListItemButton>
      <Divider
        light
        sx={{
          bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
        }}
      />
      <ListItemButton
        onClick={() => setCookie("language", "uz", { path: "/" })}
        className="h-14"
      >
        <p className="text-2xl font-[600] ml-6 flex-1">O'zbekcha</p>
        {language.type === "uz" && <CheckIcon style={{ fontSize: 30 }} />}
      </ListItemButton>
    </div>
  );
}

export default ChangeLanguage;
