import React, { useEffect, useState } from "react";
import dropdown from "../assets/dropdown.png";
import poolBox from "../assets/poolBox.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { getLpPairAddress } from "../services/apiService";
import { balanceOf, getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { getErc20Contract } from "../contexts/thirdWebClient";
import { readContract } from "thirdweb";
import { ethers } from "ethers";

const Pool = () => {
    const navigate = useNavigate();

    const add = useActiveAccount();
    const [address, setAddress] = useState("");
    const chain = useActiveWalletChain();

    useEffect(() => {
        if (add && add.address && chain) {
            setAddress(add.address);
            getLpListOfUser(add.address, chain);
        }
    }, [add, chain]);

    const [lpAddress, setLpAddress] = useState([]);

    const getLpListOfUser = async (address, chain) => {
        const trxData = await getLpPairAddress(address);
        //console.log(trxData,'data')
        if (trxData.status) {
            console.log("%c Line:14 🍯 trxData", "color:#4fff4B", trxData);
            setLpAddress(trxData.data);
            fetchLpDetails(trxData.data, address, chain);
        }
    };

    const [lpDetails, setLpDetails] = useState([]);

    const fetchLpDetails = async (trxData, address, chain) => {
        let myLp = [];
        for (const element of trxData) {
            try {
                const contract = getErc20Contract(element.pairAddress, chain);
                let currencyMetadata = await getCurrencyMetadata({ contract });
                let pairTotalSupply = await readContract({
                    contract,
                    method: "function totalSupply() view returns (uint256)",
                    params: [],
                });
                let userBalance = await balanceOf({
                    contract,
                    address: address,
                });

                const Token0contract = getErc20Contract(
                    element?.liquiditypairs?.token0Address,
                    chain,
                );

                let tokenOMetaData = await getCurrencyMetadata({
                    contract: Token0contract,
                });
                let tokenOUserBalance = await balanceOf({
                    contract: Token0contract,
                    address: element.pairAddress,
                });

                const Token1contract = getErc20Contract(
                    element?.liquiditypairs?.token1Address,
                    chain,
                );
                let token1MetaData = await getCurrencyMetadata({
                    contract: Token1contract,
                });
                let token1UserBalance = await balanceOf({
                    contract: Token1contract,
                    address: element.pairAddress,
                });

                let userShare =
                    (Number(
                        ethers.formatUnits(
                            userBalance,
                            currencyMetadata?.decimals,
                        ),
                    ) *
                        100) /
                    Number(
                        ethers.formatUnits(
                            pairTotalSupply,
                            currencyMetadata?.decimals,
                        ),
                    );

                let pairData = {
                    pairAddress: element.pairAddress,
                    token0Address: element?.liquiditypairs?.token0Address,
                    token1Address: element?.liquiditypairs?.token1Address,
                    lpName:
                        tokenOMetaData?.symbol +
                        "-" +
                        token1MetaData?.symbol +
                        " LP",
                    lpTotalSupply: Number(
                        ethers.formatUnits(
                            pairTotalSupply,
                            currencyMetadata?.decimals,
                        ),
                    ),
                    lpUserBalance: Number(
                        ethers.formatUnits(
                            userBalance,
                            currencyMetadata?.decimals,
                        ),
                    ),
                    userShare: userShare,
                    token0Name: tokenOMetaData?.name,
                    token0Symbol: tokenOMetaData?.symbol,
                    token0UserBalance:
                        (userShare *
                            Number(
                                ethers.formatUnits(
                                    tokenOUserBalance,
                                    tokenOMetaData?.decimals,
                                ),
                            )) /
                        100,
                    token1Name: token1MetaData?.name,
                    token1Symbol: token1MetaData?.symbol,
                    token1UserBalance:
                        (userShare *
                            Number(
                                ethers.formatUnits(
                                    token1UserBalance,
                                    token1MetaData?.decimals,
                                ),
                            )) /
                        100,
                };
                console.log(
                    "%c Line:85 🍰 pairData",
                    "color:#6ec1c2",
                    pairData,
                );
                myLp.push(pairData);
            } catch (error) {
                console.log("%c Line:47 🍉 error", "color:#42b983", error);
            }
        }
        console.log("%c Line:148 🍒 myLp", "color:#ea7e5c", myLp);
        setLpDetails(myLp);
    };

    return (
        <div className="max-w-[724px] mx-3 sm:mx-auto mt-6 flex gap-2 items-center justify-center my-12 flex-col p-5 rounded-xl bg-[#ffffff80]">
            <div className=" flex items-center justify-between w-full">
                <h6 className="text-[#102C57] text-[22px] sm:text-[26px] font-semibold">
                    Positions
                </h6>
                <div className="flex justify-center items-center gap-2">
                    {/* <div className="flex items-center justify-center gap-1 sm:gap-3 bg-tranparent border border-[#3c486b10] rounded-[48px] py-[6px] px-[18px] cursor-pointer">
                        <h5 className="font-semibold text-[14px] sm:text-[16px] text-[#102C57]">
                            More
                        </h5>
                        <img
                            src={dropdown}
                            alt=""
                            className="size-[18px] sm:size-[20px]"
                        />
                    </div> */}
                    <button
                        onClick={() => navigate("/pool/addliquidity/0x/0x")}
                        className="bg-gradient-to-r from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[6px] px-[12px] text-[#fff] text-[14x] sm:text-[16px] font-semibold "
                    >
                        New Position
                    </button>
                </div>
            </div>
            {lpDetails && lpDetails.length > 0 ? (
                lpDetails.map((ele) => (
                    <div className="rounded-[16px] overflow-hidden border w-full border-[#d5d5d5]">
                        <div className="bg-white text-[#000000ae] font-semibold flex justify-start text-[14px] sm:text-[20px] font-normal px-4 py-2 border-b border-[#d5d5d5]">
                            <h3>{ele?.lpName}</h3>
                            <button
                                onClick={() =>
                                    navigate(
                                        `/pool/addliquidity/${ele?.token0Address}/${ele?.token1Address}`,
                                    )
                                }
                                style={{
                                    width: "20%",
                                    "margin-left": "auto",
                                }}
                                className="bg-gradient-to-r from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[6px] px-[12px] text-[#fff] text-[14x] sm:text-[16px] font-semibold "
                            >
                                Add
                            </button>
                            <button
                                onClick={() =>
                                    navigate(
                                        `/remove/liquidity/${ele?.pairAddress}`,
                                    )
                                }
                                style={{
                                    width: "20%",
                                    "margin-left": "auto",
                                }}
                                className="bg-gradient-to-r from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[6px] px-[12px] text-[#fff] text-[14x] sm:text-[16px] font-semibold "
                            >
                                Remove
                            </button>
                        </div>
                        <div className="bg-[#f7f7f7] flex items-center justify-evenly py-3 gap-2">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="font-semibold text-[18px] text-[#102C57]">
                                    {(ele?.token0UserBalance).toFixed(3)}{" "}
                                    {ele?.token0Symbol}
                                </p>
                                <p className="font-medium text-[15px] text-[#3C486B99]">
                                    {ele?.token0Name}
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="font-semibold text-[18px] text-[#102C57]">
                                    {(ele?.token1UserBalance).toFixed(3)}{" "}
                                    {ele?.token1Symbol}
                                </p>
                                <p className="font-medium text-[15px] text-[#3C486B99]">
                                    {ele?.token1Name}
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="font-semibold text-[18px] text-[#102C57]">
                                    {ele?.userShare.toFixed(2)}%
                                </p>
                                <p className="font-medium text-[15px] text-[#3C486B99]">
                                    Share of Pool
                                </p>
                            </div>
                        </div>
                        {/* <div className="bg-[#f7f7f7] flex items-center justify-evenly py-6 gap-3">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="font-semibold text-[18px] text-[#102C57]">
                                    3376.51
                                </p>
                                <p className="font-medium text-[15px] text-[#3C486B99]">
                                    USDT per ETH
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="font-semibold text-[18px] text-[#102C57]">
                                    0.000338823
                                </p>
                                <p className="font-medium text-[15px] text-[#3C486B99]">
                                    ETH per USDT
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="font-semibold text-[18px] text-[#102C57]">
                                    99.65%
                                </p>
                                <p className="font-medium text-[15px] text-[#3C486B99]">
                                    Share of Pool
                                </p>
                            </div>
                        </div> */}
                    </div>
                ))
            ) : (
                <div className="rounded-[16px] flex flex-col items-center bg-white gap-4 justify-center overflow-hidden border w-full border-[#a3a3a3] m-auto min-h-[260px]">
                    <img src={poolBox} alt="" />
                    <h5 className="font-medium text-[14px] sm:text-[16px] text-[#a3a3a3]">
                        Your active liquidity positions will appear here
                    </h5>
                </div>
            )}
        </div>
    );
};

export default Pool;
