import React from "react";
import AddNewWidget from "../components/addScreen/AddNewWidget";
import addjobicon from "../assets/addjobicon.jpg";
import addhomeicon from "../assets/addhomeicon.jpg";
import MyJobAddsCard from "../components/addScreen/MyJobAddsCard";
import MyHomeAddsCard from "../components/addScreen/MyHomeAddsCard";

function Add() {
  return (
    <div className="pb-14 xl:pb-1">
      <div className="mb-2">
        <AddNewWidget
          logo={addjobicon}
          text="Ish berish uchun e'lon qo'shish"
          path="/add/newjob"
        />
        <AddNewWidget
          logo={addhomeicon}
          text="Uy ijaraga berish uchun e'lon qo'shish"
          path="/add/newhome"
        />
      </div>
      <MyJobAddsCard />
      <MyHomeAddsCard />
    </div>
  );
}

export default Add;
