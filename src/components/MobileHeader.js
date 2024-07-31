import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MobileHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div>
      <div className="flex fixed bottom-2 left-1 right-1 md:hidden border border-[#f9f9f95c] py-[6px] rounded-3xl mx-auto w-[94%] bg-[#ffffff80] gap-6 justify-evenly items-center">
        <p
          onClick={() => navigate("/")}
          className={`w-fit h-fit rounded-[48px] px-[20px] py-[6px] font-medium text-[16px] text-[#3C486B] cursor-pointer border ${
            pathname === "/"
              ? "bg-[#f9f9f9] border-[#e5e5e5]"
              : "bg-transparent border-transparent"
          }`}
        >
          Swap
        </p>
        <p
          onClick={() => navigate("/pool")}
          className={`w-fit h-fit rounded-[48px] px-[20px] py-[6px] font-medium text-[16px] text-[#3C486B] cursor-pointer border ${
            pathname === "/pool"
              ? "bg-[#f9f9f9] border-[#e5e5e5]"
              : "bg-transparent border-transparent"
          }`}
        >
          Pool
        </p>
        {/* <p
          onClick={() => navigate("/deposit")}
          className={`w-fit h-fit rounded-[48px] px-[20px] py-[6px] font-medium text-[16px] text-[#3C486B] cursor-pointer border ${
            pathname === "/deposit"
              ? "bg-[#f9f9f9] border-[#e5e5e5]"
              : "bg-transparent border-transparent"
          }`}
        >
          Deposit
        </p> */}
      </div>
    </div>
  );
};

export default MobileHeader;
