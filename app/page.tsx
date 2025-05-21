"use client";
import { NextPage } from "next";

import { MainStage } from "@/components/MainStage";
import { Toolbar } from "@/components/Toolbar";

const Home: NextPage = () => {
  return (
    <>
      <MainStage />
      <Toolbar />
    </>
  );
};

export default Home;
