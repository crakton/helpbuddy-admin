"use client"
import { FC, ReactNode, useState } from "react";
import MainHeader from "./(routes)/_components/MainHeader";
import SideBar from "./(routes)/_components/SideBar";

interface layoutProps {
  children: ReactNode;
  //   ReactElement
}


const RoutesLayout: FC<layoutProps> = ({ children }) => {
const [sideNavOpen, setSideNavOpen] = useState<boolean>(false);
  return (
    <div className="min-h-screen h-full">
      <MainHeader sideNavOpen={sideNavOpen} setSideNavOpen={setSideNavOpen} />
      <div className=" min-h-full h-full flex w-full bg-[#F7F7FF]">
        <SideBar sideNavOpen={sideNavOpen} setSideNavOpen={setSideNavOpen}/>
        <main className=" sm:ml-[11rem] w-full">{children}</main>
      </div>
    </div>
  );
};

export default RoutesLayout;
