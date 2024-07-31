import React, { useEffect, useState } from "react";
import eth from "../assets/eth.png";
import { FaArrowLeft } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import {
    getErc20Contract,
    getLPContract,
    getRouterContract,
} from "../contexts/thirdWebClient";
import {
    allowance,
    approve,
    balanceOf,
    getCurrencyMetadata,
} from "thirdweb/extensions/erc20";
import {
    prepareContractCall,
    readContract,
    sendTransaction as sendTx,
} from "thirdweb";
import { ethers } from "ethers";
import { routerAddress } from "../contexts/config";
import { toast } from "react-toastify";

const RemoveLiquidity = () => {
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);

    const { pairAddress } = useParams();

    const add = useActiveAccount();
    const [address, setAddress] = useState("");
    const chain = useActiveWalletChain();

    useEffect(() => {
        if (add && add.address && chain && pairAddress) {
            setAddress(add.address);
            fetchLpDetails(pairAddress, add.address, chain);
        }
    }, [add, chain, pairAddress]);

    const [lpDetails, setLpDetails] = useState({});

    const fetchLpDetails = async (pairAddress, address, chain) => {
        try {
            const contract = getErc20Contract(pairAddress, chain);
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
            let approvedAmount = await allowance({
                contract,
                owner: address,
                spender: routerAddress,
            });

            const lpContract = getLPContract(pairAddress, chain);

            let token0Address = await readContract({
                contract: lpContract,
                method: "function token0() view returns (address)",
                params: [],
            });
            let token1Address = await readContract({
                contract: lpContract,
                method: "function token1() view returns (address)",
                params: [],
            });

            const Token0contract = getErc20Contract(token0Address, chain);

            let tokenOMetaData = await getCurrencyMetadata({
                contract: Token0contract,
            });
            let tokenOUserBalance = await balanceOf({
                contract: Token0contract,
                address: pairAddress,
            });

            const Token1contract = getErc20Contract(token1Address, chain);
            let token1MetaData = await getCurrencyMetadata({
                contract: Token1contract,
            });
            let token1UserBalance = await balanceOf({
                contract: Token1contract,
                address: pairAddress,
            });

            let userShare =
                (Number(
                    ethers.formatUnits(userBalance, currencyMetadata?.decimals),
                ) *
                    100) /
                Number(
                    ethers.formatUnits(
                        pairTotalSupply,
                        currencyMetadata?.decimals,
                    ),
                );

            const routerContract = await getRouterContract(chain);
            let token0Price = await readContract({
                contract: routerContract,
                method: "function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) pure returns (uint256 amountB)",
                params: [
                    ethers.parseUnits("1", tokenOMetaData?.decimals),
                    tokenOUserBalance,
                    token1UserBalance,
                ],
            });
            let token1Price = await readContract({
                contract: routerContract,
                method: "function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) pure returns (uint256 amountB)",
                params: [
                    ethers.parseUnits("1", token1MetaData?.decimals),
                    token1UserBalance,
                    tokenOUserBalance,
                ],
            });

            let pairData = {
                pairAddress: pairAddress,
                token0Address,
                token1Address,
                currencyMetadata,
                token0Price: Number(
                    ethers.formatUnits(token0Price, token1MetaData?.decimals),
                ),
                token1Price: Number(
                    ethers.formatUnits(token1Price, tokenOMetaData?.decimals),
                ),
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
                approvedBalance: Number(
                    ethers.formatUnits(
                        approvedAmount,
                        currencyMetadata?.decimals,
                    ),
                ),
                lpUserBalance: Number(
                    ethers.formatUnits(userBalance, currencyMetadata?.decimals),
                ),
                userShare: userShare,
                tokenOMetaData,
                token1MetaData,
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
            console.log("%c Line:85 🍰 pairData", "color:#6ec1c2", pairData);
            setLpDetails(pairData);
        } catch (error) {
            console.log("%c Line:47 🍉 error", "color:#42b983", error);
        }
    };

    const approveTokenFun = async (tokenAddress) => {
        try {
            setLoading(true);
            // const { mutate: sendTransaction } = useSendTransaction();
            const contract = getErc20Contract(tokenAddress, chain);
            const transaction = approve({
                contract,
                spender: routerAddress,
                amount: 1000,
            });
            console.log(
                "%c Line:117 🍢 transaction",
                "color:#ed9ec7",
                transaction,
                add,
            );
            const tx = await sendTx({ transaction, account: add });
            console.log("%c Line:118 🥔 tx", "color:#93c0a4", tx);
            toast.success("Token approved");
            setLoading(false);
        } catch (error) {
            toast.error(error?.message);
            setLoading(false);

            console.log("%c Line:111 🍫 error", "color:#ed9ec7", error);
        }
    };

    const [token0Amount, setToken0Amount] = useState(0);
    const [token1Amount, setToken1Amount] = useState(0);

    const updateValue = (value) => {
        let val = parseFloat(value);
        setValue(value);
        let tokenAmount = (val * lpDetails.token0UserBalance) / 100;
        setToken0Amount(tokenAmount);
        let tokenBAmount = (val * lpDetails.token1UserBalance) / 100;
        setToken1Amount(tokenBAmount);
    };

    const removeLiquidity = async () => {
        try {
            if (value <= 0) {
                toast.error("Please Enter Valid amount");
                return;
            }
            console.log("%c Line:236 🥕 value", "color:#b03734", value);
            const contract = getRouterContract(chain);

            let token1amount = ethers.parseUnits(
                `${token0Amount.toFixed(3)}`,
                lpDetails?.tokenOMetaData?.decimals,
            );

            let token2amount = ethers.parseUnits(
                `${token1Amount.toFixed(3)}`,
                lpDetails?.token1MetaData?.decimals,
            );

            let amount = (value * lpDetails.lpUserBalance) / 100;
            let amountPair = ethers.parseUnits(
                `${amount}`,
                lpDetails?.currencyMetadata?.decimals,
            );
            const transaction = prepareContractCall({
                contract,
                method: "function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB)",
                params: [
                    lpDetails?.token0Address,
                    lpDetails?.token1Address,
                    amountPair,
                    "1",
                    "1",
                    address,
                    Math.floor(new Date().getTime() / 1000) + 900,
                ],
            });
            console.log(
                "%c Line:280 🧀 transaction",
                "color:#465975",
                transaction,
            );
            const txData = await sendTx({ transaction, account: add });
            console.log("%c Line:173 🥐 txData", "color:#3f7cff", txData);
            toast.success("Liquidity Added");
            setLoading(false);
        } catch (error) {
            toast.error(error?.message);
            setLoading(false);
            console.log("%c Line:166 🍕 error", "color:#f5ce50", error);
        }
    };

    return (
        <div className="max-w-[424px] mx-3 sm:mx-auto my-6 flex gap-2 items-center flex-col p-5 rounded-xl bg-[#ffffff80] overflow-hidden">
            <div className="flex justify-between items-center px-2 w-full">
                <FaArrowLeft className="size-[16px] text-[#000000a1] cursor-pointer" />
                <h6 className="text-[16px] sm:text-[18px] text-[#000000a1] font-semibold">
                    Remove liquidity
                </h6>
                <IoSettings className="size-[16px] text-[#000000a1] cursor-pointer" />
            </div>
            {/* <div className="rounded-[16px] w-full bg-[#f970c059] py-1 px-2 text-[#c40273] text-left">
                <b>Tip: </b> Removing pool tokens converts your position back
                into underlying at the current rate, proportional to your share
                of the pool. Accured fees are included in the amounts you
                receive.
            </div> */}
            <div className="rounded-[16px] w-full bg-[#e4e4e48f] p-2 ">
                <div className="flex justify-between items-center px-2 w-full">
                    <h6 className="text-[14px] sm:text-[16px] text-[#000000a1] font-semibold">
                        Remove Amount
                    </h6>
                    <h6 className="text-[14px] sm:text-[16px] text-[#c40273] font-medium">
                        Detailed
                    </h6>
                </div>
                <p className="text-[76px] text-left text-black font-bold">
                    {value}%
                </p>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={value}
                    className="w-full outline-none slider"
                    onChange={(e) => updateValue(e.target.value)}
                />
                <div className="flex justify-between items-center px-2 w-full mt-4">
                    <h6
                        onClick={() => updateValue("25")}
                        className={`text-[14px] sm:text-[16px] text-[#000000a1] font-semibold py-2 px-3 bg-[#ffffff91] cursor-pointer rounded-[10px] text-[#c40273] border ${
                            value === "25"
                                ? "border-[#c40273]"
                                : "border-transparent"
                        }`}
                    >
                        25%
                    </h6>
                    <h6
                        onClick={() => updateValue("50")}
                        className={`text-[14px] sm:text-[16px] text-[#000000a1] font-semibold py-2 px-3 bg-[#ffffff91] cursor-pointer rounded-[10px] text-[#c40273]  border ${
                            value === "50"
                                ? "border-[#c40273]"
                                : "border-transparent"
                        }`}
                    >
                        50%
                    </h6>
                    <h6
                        onClick={() => updateValue("75")}
                        className={`text-[14px] sm:text-[16px] text-[#000000a1] font-semibold py-2 px-3 bg-[#ffffff91] cursor-pointer rounded-[10px] text-[#c40273]  border ${
                            value === "75"
                                ? "border-[#c40273]"
                                : "border-transparent"
                        }`}
                    >
                        75%
                    </h6>
                    <h6
                        onClick={() => updateValue("100")}
                        className={`text-[14px] sm:text-[16px] text-[#000000a1] font-semibold py-2 px-3 bg-[#ffffff91] cursor-pointer rounded-[10px] text-[#c40273]  border ${
                            value === "100"
                                ? "border-[#c40273]"
                                : "border-transparent"
                        }`}
                    >
                        Max
                    </h6>
                </div>
            </div>
            <FaArrowLeft className="size-[16px] -rotate-90 text-[#000000a1]" />
            <div className="rounded-[16px] w-full bg-[#e4e4e48f] p-2 ">
                <div className="flex items-center justify-between p-2 w-full">
                    <h6 className="text-[#102C57] text-[18px] font-semibold">
                        {token0Amount.toFixed(3)}
                    </h6>
                    <div className="flex gap-2 items-center">
                        <img src={eth} className="size-[20px] rounded-full" />{" "}
                        <p className="text-[#102C57] text-[20px] font-semibold">
                            {lpDetails?.token0Symbol}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 w-full">
                    <h6 className="text-[#102C57] text-[18px] font-semibold">
                        {token1Amount.toFixed(3)}
                    </h6>
                    <div className="flex gap-2 items-center">
                        <img src={eth} className="size-[20px] rounded-full" />{" "}
                        <p className="text-[#102C57] text-[20px] font-semibold">
                            {lpDetails?.token1Symbol}
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full p-1 flex justify-between items-center">
                <p className="text-[#102C57] text-[18px] font-semibold">
                    Price:
                </p>
                <div className="flex flex-col items-center p-1">
                    <p className="text-[#102C57] text-[14px] font-normal">
                        1 {lpDetails?.token0Symbol} ={" "}
                        {lpDetails?.token0Price?.toFixed(3)}{" "}
                        {lpDetails?.token1Symbol}
                    </p>
                    <p className="text-[#102C57] text-[14px] font-normal">
                        1 {lpDetails?.token1Symbol} ={" "}
                        {lpDetails?.token1Price?.toFixed(3)}{" "}
                        {lpDetails?.token0Symbol}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 w-full">
                {lpDetails && lpDetails?.approvedBalance <= 0 ? (
                    loading ? (
                        <button
                            className="text-[18px] rounded-[12px] text-gray-900 border border-gray-900 w-full p-2"
                            disabled
                        >
                            Loading...
                        </button>
                    ) : (
                        <button
                            className="text-[18px] rounded-[12px] text-gray-900 border border-gray-900 w-full p-2"
                            onClick={() => {
                                approveTokenFun(lpDetails?.pairAddress);
                            }}
                        >
                            Approve
                        </button>
                    )
                ) : (
                    ""
                )}
                {loading ? (
                    <button
                        className="text-[18px] rounded-[12px] text-gray-900 border border-gray-900 w-full p-2"
                        disabled
                    >
                        Loading...
                    </button>
                ) : (
                    <button
                        className="text-[18px] rounded-[12px] text-gray-900 border border-gray-900 w-full p-2"
                        onClick={removeLiquidity}
                    >
                        Remove Liquidity
                    </button>
                )}
            </div>
        </div>
    );
};

export default RemoveLiquidity;
