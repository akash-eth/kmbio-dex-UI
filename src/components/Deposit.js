import React, { useState } from "react";
import dropdown from "../assets/dropdown.png";
import down from "../assets/down.png";
import TokenModal from "./TokenDialog";

const Deposit = () => {
  const [openBuy, setOpenBuy] = useState(false);
  const [selectedBuy, setSelectedBuy] = useState("BASE");
  return (
    <div className="max-w-[524px] mx-3 sm:mx-auto mt-6 flex gap-2 items-center flex-col p-5 rounded-xl bg-[#ffffff80]">
      <div className="rounded-[16px] overflow-hidden border w-full border-[#d5d5d5]">
        <div className="bg-white text-[#000000ae] flex justify-between text-[14px] sm:text-[16px] font-normal px-6 py-2 border-b border-[#d5d5d5]">
          <h6>
            From :<b> kmbio</b>
          </h6>
          <p>
            Balance :<b> 0 ETH</b>
          </p>
        </div>
        <div className="bg-[#f7f7f7] text-[#000000ae] flex items-center flex-col justify-between text-[14px] sm:text-[16px] font-normal px-6 py-6 gap-3">
          <div className="flex items-center justify-between w-full rounded-md overflow-hidden bg-white border border-[#d5d5d5]">
            <div
              onClick={() => setOpenBuy(!openBuy)}
              className="flex items-center justify-center w-auto px-[6px] py-[9px] border-r border-[#d5d5d5] gap-1 sm:gap-3 bg-transparent cursor-pointer"
            >
              <h5 className="font-semibold text-[14px] sm:text-[18px] text-[#102C57]">
                {selectedBuy}
              </h5>
              <img
                src={dropdown}
                alt=""
                className="size-[14px] sm:size-[16px]"
              />
            </div>{" "}
            <input placeholder="Enter Amount" className="p-2 py-[9px]" />
          </div>
          <div className=" flex justify-between w-full">
            <h6 className="text-[#3C486B] text-[13px] font-normal">
              Kmbio gas fee
            </h6>
            <p className="text-[#102C57] text-[13px] font-medium">0.0001 ETH</p>
          </div>
        </div>
      </div>
      <img src={down} className="my-[-21px] z-50" />
      <div className="rounded-[16px] overflow-hidden border w-full border-[#d5d5d5] bg-[#fa58b610] py-[18px] px-[12px]">
        <div className="flex items-center justify-between p-2 w-full rounded-md overflow-hidden bg-white border border-[#d5d5d5]">
          <h6 className="text-[#102C57] text-[16px] font-medium">
            To : <b>Holesky</b>
          </h6>
          <p className="text-[#102C57] text-[13px] font-medium">
            Balance : <b> 0 ETH</b>
          </p>
        </div>
      </div>
      <button className="bg-gradient-to-r mt-2 from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[16px] px-[4px] text-[#fff] text-[18px] font-semibold ">
        Move funds to Holesky
      </button>
      <div className=" flex justify-start w-full">
        <h6 className="text-[#3C486B] text-[13px] font-medium">Summary:</h6>
      </div>
      <div className=" flex justify-between w-full">
        <h6 className="text-[#848484] text-[13px] font-normal">
          You will pay in gas fees:
        </h6>
        <p className="text-[#102C57] text-[13px] font-medium">0.0001 ETH</p>
      </div>
      <div className=" flex justify-between w-full">
        <h6 className="text-[#848484] text-[13px] font-normal">
          You will receive on Holesky:
        </h6>
        <p className="text-[#102C57] text-[13px] font-medium">0 ETH</p>
      </div>
      <TokenModal
        open={openBuy}
        setOpen={setOpenBuy}
        onClick={setSelectedBuy}
      />
    </div>
  );
};

export default Deposit;
