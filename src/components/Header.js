import { useState } from "react";
import logo from "../assets/kmbio.png";
import dropdown from "../assets/dropdown.png";
import base from "../assets/base.png";
import polygon from "../assets/polygon.png";
import eth from "../assets/eth.png";
import kmbio from "../assets/kmbio.png";
import { useLocation, useNavigate } from "react-router-dom";
import TokenDialog from "./TokenDialog";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { lightTheme } from "thirdweb/react";
import coin from "../assets/kmbio.png";
import coin3 from "../assets/eth.png";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("ETH");

  const client = createThirdwebClient({
    clientId: process.env.REACT_APP_THIRD_WEB_CLIENT,
  });

  const customTheme = lightTheme({
    colors: {
      primaryButtonBg: "#10479B",
    },
  });

  return (
    <div className="flex bg-white px-1 sm:px-4 lg:px-8 lg:mx-auto w-full h-[62px] justify-between">
      <div className="flex gap-1 sm:gap-4 justify-start sm:justify-center">
        <img src={logo} className="w-[180px] sm:w-full" />
        <div className="hidden md:flex gap-6 justify-center items-center">
          <p
            onClick={() => navigate("/")}
            className={`w-[94px] h-fit rounded-[48px] px-[20px] py-[10px] ${
              pathname === "/"
                ? "bg-gradient-to-r from-[#fa58b61f] to-[#ffffff1f] text-[#FA58B6] font-semibold "
                : "text-[#3C486B] font-medium"
            } text-[20px] cursor-pointer`}
          >
            Swap
          </p>
          <p
            onClick={() => navigate("/pool")}
            className={`w-[94px] h-fit rounded-[48px] px-[20px] py-[10px] ${
              pathname === "/pool"
                ? "bg-gradient-to-r from-[#fa58b61f] to-[#ffffff1f] text-[#FA58B6] font-semibold "
                : "text-[#3C486B] font-medium"
            } text-[20px] cursor-pointer`}
          >
            Pool
          </p>
          {/* <p
            onClick={() => navigate("/deposit")}
            className={`w-[94px] h-fit rounded-[48px] px-[20px] py-[10px] ${
              pathname === "/deposit"
                ? "bg-gradient-to-r from-[#fa58b61f] to-[#ffffff1f] text-[#FA58B6] font-semibold "
                : "text-[#3C486B] font-medium"
            } text-[20px] cursor-pointer`}
          >
            Deposit
          </p> */}
        </div>
      </div>
      <div className="flex gap-2 sm:gap-6 justify-center items-center">
        <div
          // onClick={() => setOpen(!open)}
          className="flex items-center justify-center gap-1 sm:gap-3 bg-[#3c486b10] rounded-[48px] p-[9px] cursor-pointer"
        >
          {/* <img
            // src={
            //   selected === "ETH" ? eth : selected === "BASE" ? base : polygon
            // }
            src={coin}
            alt=""
            className="size-[20px] sm:size-[26px] rounded-full"
          /> */}
          {/* <img src={dropdown} alt="" className="size-[18px] sm:size-[20px]" /> */}
        </div>

        <ConnectButton
          connectButton={{
            label: "Connect",
            style: {
              borderRadius: "64px",
              backgroundImage:
                "linear-gradient(to right, #041A3B 0% , #10479B 100%)",
            },
          }}
          connectModal={{
            title: "Sign in with Kmbio",
            welcomeScreen: {
              img: {
                src: kmbio,
                height: 270,
                width: 540,
              },
            },
          }}
          client={client}
          theme={customTheme}
          autoConnect={true}
          chain={{
            id: 5918836757,
            name: "BruFinance",
            rpc: "https://testnet-rpc.kmbio.xyz",
            icon: coin,
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            testnet: true,
          }}
        />
        <TokenDialog open={open} setOpen={setOpen} onClick={setSelected} />
      </div>
    </div>
  );
};

export default Header;
