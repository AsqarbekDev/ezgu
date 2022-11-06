import React from "react";
import AddNewWidget from "../components/addScreen/AddNewWidget";
import addjobicon from "../assets/addjobicon.jpg";
import addhomeicon from "../assets/addhomeicon.jpg";
import MyJobAddsCard from "../components/addScreen/MyJobAddsCard";
import MyHomeAddsCard from "../components/addScreen/MyHomeAddsCard";
import { useSelector } from "react-redux";
import { selectLanguage } from "../features/languageSlice";

function Add() {
  const language = useSelector(selectLanguage);

  return (
    <div className="pb-14 xl:pb-1">
      <div className="mb-2">
        <AddNewWidget
          logo={addjobicon}
          text={language.add.addJobText}
          path="/add/newjob"
        />
        <AddNewWidget
          logo={addhomeicon}
          text={language.add.addHomeText}
          path="/add/newhome"
        />
      </div>
      <MyJobAddsCard />
      <MyHomeAddsCard />
    </div>
  );
}

export default Add;
