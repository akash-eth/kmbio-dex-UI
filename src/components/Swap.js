import React, { useEffect, useState } from "react";
import dropdown from "../assets/dropdown.png";
import base from "../assets/base.png";
import polygon from "../assets/polygon.png";
import down from "../assets/down.png";
import eth from "../assets/eth.png";
import gas from "../assets/gas.png";
import TokenModal from "./TokenDialog";
import coin from "../assets/kmbio.png";
import {
    getErc20Contract,
    getFactoryContract,
    getRouterContract,
    getWalletBalanceContract,
} from "../contexts/thirdWebClient";
import { allowance, approve, balanceOf } from "thirdweb/extensions/erc20";
import { routerAddress, WETHAddress } from "../contexts/config";
import {
    useActiveAccount,
    useActiveWalletChain,
    useSendTransaction,
} from "thirdweb/react";
import {
    prepareContractCall,
    readContract,
    sendTransaction as sendTx,
} from "thirdweb";
import { toast } from "react-toastify";
import { createPool } from "thirdweb/extensions/uniswap";
import { ethers } from "ethers";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { getWalletBalance } from "thirdweb/wallets";

const Swap = () => {
    const [open, setOpen] = useState(false);
    const [openBuy, setOpenBuy] = useState(false);
    const [selected, setSelected] = useState({});
    const [selectedBuy, setSelectedBuy] = useState({});
    const [loading, setLoading] = useState(false);
    const [checkData, setCheckData] = useState(false);

    const add = useActiveAccount();
    const [address, setAddress] = useState("");
    const chain = useActiveWalletChain();
    useEffect(() => {
        if (add && add.address) {
            console.log("%c Line:41 🍅 add", "color:#7f2b82", add);
            setAddress(add.address);
        }
    }, [add, chain]);

    const [token1Details, setToken1Details] = useState({});
    const [token2Details, setToken2Details] = useState({});

    const [token1value, setToken1value] = useState(0);
    const [token2value, setToken2value] = useState(0);
    const [swapType, setSwapType] = useState(1);

    useEffect(() => {
        const getData = async () => {
            if (
                selected &&
                selected !== "" &&
                selected?.address &&
                address &&
                selectedBuy?.address != selected?.address &&
                selected?.address !=
                    "0x0000000000000000000000000000000000000000"
            ) {
                let tokenDetails = selected;
                const contract = getErc20Contract(selected.address, chain);
                let approvedAmount = await allowance({
                    contract,
                    owner: address,
                    spender: routerAddress,
                });
                tokenDetails.approvedBalance = Number(approvedAmount) * 1;
                let tokenBalance = await balanceOf({
                    contract,
                    address: address,
                });
                tokenDetails.balance =
                    Number(
                        ethers.formatUnits(
                            tokenBalance,
                            tokenDetails?.decimals,
                        ),
                    ) * 1;
                setToken1Details(tokenDetails);
            }
            if (
                selected &&
                selected !== "" &&
                selectedBuy?.address != selected?.address &&
                selected?.address ==
                    "0x0000000000000000000000000000000000000000"
            ) {
                let tokenDetails = selected;

                tokenDetails.approvedBalance = Number(100000000000) * 1;
                let tokenBalance = await getWalletBalanceContract(
                    address,
                    chain,
                );

                tokenDetails.balance =
                    Number(ethers.formatUnits(tokenBalance, 18)) * 1;

                setToken1Details(tokenDetails);
            }
            if (
                selectedBuy &&
                selectedBuy !== "" &&
                selectedBuy?.address &&
                selectedBuy?.address !=
                    "0x0000000000000000000000000000000000000000" &&
                selectedBuy?.address != selected?.address &&
                address
            ) {
                let tokenDetails = selectedBuy;
                const contract = getErc20Contract(selectedBuy.address, chain);
                let approvedAmount = await allowance({
                    contract,
                    owner: address,
                    spender: routerAddress,
                });
                tokenDetails.approvedBalance = Number(approvedAmount) * 1;

                let tokenBalance = await balanceOf({
                    contract,
                    address: address,
                });
                tokenDetails.balance =
                    Number(
                        ethers.formatUnits(
                            tokenBalance,
                            tokenDetails?.decimals,
                        ),
                    ) * 1;
                setToken2Details(tokenDetails);
            }
            if (
                selectedBuy &&
                selectedBuy !== "" &&
                selectedBuy?.address != selected?.address &&
                selectedBuy?.address ==
                    "0x0000000000000000000000000000000000000000"
            ) {
                let tokenDetails = selectedBuy;

                tokenDetails.approvedBalance = Number(100000000000) * 1;
                let tokenBalance = await getWalletBalanceContract(
                    address,
                    chain,
                );
                tokenDetails.balance =
                    Number(ethers.formatUnits(tokenBalance, 18)) * 1;
                setToken2Details(tokenDetails);
            }
        };
        getData();
    }, [selected, selectedBuy, loading]);

    useEffect(() => {
        if (token1Details.address && token2Details.address) {
            fetchLpDetails();
        }
    });

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

    const [price, setPrice] = useState(0);
    const [lpAddress, setLpAddress] = useState("");
    const [token1LpBalance, setToken1LpBalance] = useState(0);
    const [token2LpBalance, setToken2LpBalance] = useState(0);

    const fetchLpDetails = async () => {
        try {
            const routerContract = await getRouterContract(chain);
            const factoryContract = await getFactoryContract(chain);

            let pairAddress = await readContract({
                contract: factoryContract,
                method: "function getPair(address, address) view returns (address)",
                params: [
                    token1Details?.address ==
                    "0x0000000000000000000000000000000000000000"
                        ? WETHAddress
                        : token1Details?.address,
                    token2Details?.address ==
                    "0x0000000000000000000000000000000000000000"
                        ? WETHAddress
                        : token2Details?.address,
                ],
            });

            setLpAddress(pairAddress);
            console.log(
                "%c Line:224 🍧 pairAddress",
                "color:#7f2b82",
                pairAddress,
            );

            const Token0contract = getErc20Contract(
                token1Details?.address ==
                    "0x0000000000000000000000000000000000000000"
                    ? WETHAddress
                    : token1Details?.address,
                chain,
            );
            let tokenOUserBalance = await balanceOf({
                contract: Token0contract,
                address: pairAddress,
            });
            setToken1LpBalance(tokenOUserBalance);

            const Token1contract = getErc20Contract(
                token2Details?.address ==
                    "0x0000000000000000000000000000000000000000"
                    ? WETHAddress
                    : token2Details?.address,
                chain,
            );

            let token1UserBalance = await balanceOf({
                contract: Token1contract,
                address: pairAddress,
            });
            setToken2LpBalance(token1UserBalance);

            let tokenPrice = await readContract({
                contract: routerContract,
                method: "function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) pure returns (uint256 amountB)",
                params: [
                    ethers.parseUnits("1", selected?.decimals),
                    tokenOUserBalance,
                    token1UserBalance,
                ],
            });

            setPrice(
                Number(
                    ethers.formatUnits(tokenPrice, selectedBuy?.decimals),
                ).toFixed(5),
            );
        } catch (error) {
            console.log("%c Line:47 🍉 error", "color:#42b983", error);
        }
    };

    const fetchPriceDetails = async (value) => {
        try {
            const routerContract = await getRouterContract(chain);

            let token0Price = await readContract({
                contract: routerContract,
                method: "function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) pure returns (uint256 amountB)",
                params: [
                    ethers.parseUnits(value, selected?.decimals),
                    token1LpBalance,
                    token2LpBalance,
                ],
            });

            setToken2value(
                Number(
                    ethers.formatUnits(token0Price, selectedBuy?.decimals),
                ).toFixed(5),
            );
            setSwapType(1);
        } catch (error) {
            console.log("%c Line:47 🍉 error", "color:#42b983", error);
        }
    };

    const fetchPrice2Details = async (value) => {
        try {
            const routerContract = await getRouterContract(chain);

            let token0Price = await readContract({
                contract: routerContract,
                method: "function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) pure returns (uint256 amountB)",
                params: [
                    ethers.parseUnits(value, selectedBuy?.decimals),
                    token2LpBalance,
                    token1LpBalance,
                ],
            });
            setToken1value(
                Number(
                    ethers.formatUnits(token0Price, selected?.decimals),
                ).toFixed(5),
            );
            setSwapType(2);
        } catch (error) {
            console.log("%c Line:47 🍉 error", "color:#42b983", error);
        }
    };

    const swapToken = async () => {
        try {
            const contract = getRouterContract(chain);

            let token1amount = ethers.parseUnits(
                token1value,
                token1Details?.decimals,
            );

            let token2amount = ethers.parseUnits(
                token2value,
                token2Details?.decimals,
            );

            let transaction;
            if (swapType == 1) {
                if (
                    token1Details?.address ==
                        "0x0000000000000000000000000000000000000000" ||
                    token2Details?.address ==
                        "0x0000000000000000000000000000000000000000"
                ) {
                    transaction = prepareContractCall({
                        contract,
                        method: "function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
                        params: [
                            token1amount,
                            "1",
                            [
                                token1Details?.address ==
                                "0x0000000000000000000000000000000000000000"
                                    ? WETHAddress
                                    : token1Details?.address,
                                token2Details?.address ==
                                "0x0000000000000000000000000000000000000000"
                                    ? WETHAddress
                                    : token2Details?.address,
                            ],
                            address,
                            Math.floor(new Date().getTime() / 1000) + 900,
                        ],
                        value:
                            token1Details?.address ==
                            "0x0000000000000000000000000000000000000000"
                                ? token1amount
                                : 0,
                    });
                } else {
                    transaction = prepareContractCall({
                        contract,
                        method: "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
                        params: [
                            token1amount,
                            "1",
                            [token1Details?.address, token2Details?.address],
                            address,
                            Math.floor(new Date().getTime() / 1000) + 900,
                        ],
                    });
                }
            } else {
                if (
                    token1Details?.address ==
                        "0x0000000000000000000000000000000000000000" ||
                    token2Details?.address ==
                        "0x0000000000000000000000000000000000000000"
                ) {
                    transaction = prepareContractCall({
                        contract,
                        method: "function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
                        params: [
                            token2amount,
                            "1",
                            [
                                token1Details?.address ==
                                "0x0000000000000000000000000000000000000000"
                                    ? WETHAddress
                                    : token1Details?.address,
                                token2Details?.address ==
                                "0x0000000000000000000000000000000000000000"
                                    ? WETHAddress
                                    : token2Details?.address,
                            ],
                            address,
                            Math.floor(new Date().getTime() / 1000) + 900,
                        ],
                        value:
                            token1Details?.address ==
                            "0x0000000000000000000000000000000000000000"
                                ? token1amount
                                : 0,
                    });
                } else {
                    transaction = prepareContractCall({
                        contract,
                        method: "function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
                        params: [
                            token2amount,
                            "1",
                            [token1Details?.address, token2Details?.address],
                            address,
                            Math.floor(new Date().getTime() / 1000) + 900,
                        ],
                    });
                }
            }
            const txData = await sendTx({ transaction, account: add });
            console.log("%c Line:173 🥐 txData", "color:#3f7cff", txData);
            toast.success("Token Swap");
            setLoading(false);
        } catch (error) {
            toast.error(error?.message);
            setLoading(false);
            console.log("%c Line:166 🍕 error", "color:#f5ce50", error);
        }
    };

    return (
        <div className="max-w-[524px] mx-3 sm:mx-auto mt-6 flex gap-2 items-center flex-col p-5 rounded-xl bg-[#ffffff80]">
            <div className="rounded-[16px] overflow-hidden border w-full border-[#d5d5d5]">
                <div className="bg-white text-[#000000ae] flex justify-between text-[14px] sm:text-[16px] font-normal px-6 py-2 border-b border-[#d5d5d5]">
                    <h6>Sell</h6>
                    <p>
                        Balance:
                        <b>
                            {token1Details?.balance
                                ? token1Details?.balance
                                : 0}
                        </b>
                    </p>
                </div>
                <div className="bg-[#f7f7f7] text-[#000000ae] flex items-center justify-between text-[14px] sm:text-[16px] font-normal px-6 py-2">
                    <div className="text-left">
                        {/* <h6 className="text-[30px] sm:text-[38px] font-semibold text-[#102C57]">
                            1
                        </h6> */}
                        <input
                            className="text-[30px] sm:text-[38px] font-semibold text-[#102C57]"
                            style={{ width: "80%" }}
                            type="number"
                            value={token1value}
                            onChange={(e) => {
                                setToken1value(e.target.value);
                                fetchPriceDetails(e.target.value);
                            }}
                        />
                        {/* <p className="text-[12px] sm:text-[14px] font-semibold text-[#3C486B] mt-1">
                            $3,380.62{" "}
                        </p> */}
                    </div>
                    <div
                        onClick={() => setOpen(!open)}
                        style={{ width: "70%" }}
                        className="flex items-center justify-center gap-1 sm:gap-3 bg-white rounded-[48px] border-2 border-[#a3a3a3] px-[9px] py-[4px] cursor-pointer"
                    >
                        {selected && selected?.symbol ? (
                            <>
                                <img
                                    src={coin}
                                    alt=""
                                    className="size-[20px] sm:size-[26px] rounded-full"
                                />
                                <h5 className="font-semibold text-[18px] sm:text-[22px] text-[#102C57]">
                                    {selected?.symbol}
                                </h5>
                                <img
                                    src={dropdown}
                                    alt=""
                                    className="size-[18px] sm:size-[20px]"
                                />
                            </>
                        ) : (
                            <>
                                <h5 className="font-semibold text-[18px] sm:text-[20px] text-[#102C57]">
                                    Select Token
                                </h5>
                                <img
                                    src={dropdown}
                                    alt=""
                                    className="size-[18px] sm:size-[20px]"
                                />
                            </>
                        )}
                        {/* <img
              src={
                selected === "ETH" ? eth : selected === "BASE" ? base : polygon
              }
              alt=""
              className="size-[20px] sm:size-[26px] rounded-full"
            />
            <h5 className="font-semibold text-[18px] sm:text-[22px] text-[#102C57]">
              {selected}
            </h5>
            <img src={dropdown} alt="" className="size-[18px] sm:size-[20px]" /> */}
                    </div>
                </div>
            </div>
            <img src={down} className="my-[-21px] z-50" />
            <div className="rounded-[16px] overflow-hidden border w-full border-[#d5d5d5]">
                <div className="bg-[#f7f7f7] text-[#000000ae] flex items-center justify-between text-[16px] font-normal px-6 py-2 border-b border-[#d5d5d5]">
                    <div className="text-left">
                        <input
                            className="text-[30px] sm:text-[38px] font-semibold text-[#102C57]"
                            style={{ width: "80%" }}
                            value={token2value}
                            onChange={(e) => {
                                setToken2value(e.target.value);
                                fetchPrice2Details(e.target.value);
                            }}
                        />
                        {/* <p className="text-[12px] sm:text-[14px] font-semibold text-[#3C486B] mt-1">
                            $3,380.62{" "}
                        </p> */}
                    </div>
                    <div
                        onClick={() => setOpenBuy(!openBuy)}
                        style={{ width: "70%" }}
                        className="flex items-center justify-center gap-1 sm:gap-3 bg-white border-2 border-[#a3a3a3] rounded-[48px] px-[9px] py-[4px] cursor-pointer"
                    >
                        {selectedBuy && selectedBuy?.symbol ? (
                            <>
                                <img
                                    src={coin}
                                    alt=""
                                    className="size-[20px] sm:size-[26px] rounded-full"
                                />
                                <h5 className="font-semibold text-[18px] sm:text-[22px] text-[#102C57]">
                                    {selectedBuy?.symbol}
                                </h5>
                                <img
                                    src={dropdown}
                                    alt=""
                                    className="size-[18px] sm:size-[20px]"
                                />
                            </>
                        ) : (
                            <>
                                <h5 className="font-semibold text-[18px] sm:text-[20px] text-[#102C57]">
                                    Select Token
                                </h5>
                                <img
                                    src={dropdown}
                                    alt=""
                                    className="size-[18px] sm:size-[20px]"
                                />
                            </>
                        )}
                        {/* <img
              src={
                selectedBuy === "ETH"
                  ? eth
                  : selectedBuy === "BASE"
                  ? base
                  : polygon
              }
              alt=""
              className="size-[20px] sm:size-[26px] rounded-full"
            />
            <h5 className="font-semibold text-[18px] sm:text-[22px] text-[#102C57]">
              {selectedBuy}
            </h5>
            <img src={dropdown} alt="" className="size-[18px] sm:size-[20px]" /> */}
                    </div>
                </div>
                <div className="bg-white text-[#000000ae] flex justify-between text-[14px] sm:text-[16px] font-normal px-6 py-2">
                    <h6>Buy</h6>
                    <p>
                        Balance:
                        <b>
                            {token2Details?.balance
                                ? token2Details?.balance
                                : 0}
                        </b>
                    </p>
                </div>
            </div>
            {loading ? (
                <button
                    className="bg-gradient-to-r mt-2 from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[16px] px-[4px] text-[#fff] text-[18px] font-semibold "
                    disabled
                >
                    Loading..
                </button>
            ) : (
                <button
                    className="bg-gradient-to-r mt-2 from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[16px] px-[4px] text-[#fff] text-[18px] font-semibold "
                    onClick={swapToken}
                >
                    Swap Now
                </button>
            )}
            <div className="bg-white w-full text-[#000000ae] flex justify-between text-[16px] sm:text-[18px] rounded-[14px] font-medium px-2 py-2">
                <h6>
                    1 {token1Details.symbol} = {price} {token2Details?.symbol}{" "}
                    ($0.999)
                </h6>
                {/* <div className="flex justify-center items-center gap-2">
                    <img src={gas} />
                    <b className="text-[16px] sm:text-[18px] font-medium">
                        $2.00
                    </b>
                </div> */}
            </div>
            <TokenModal open={open} setOpen={setOpen} onClick={setSelected} />
            <TokenModal
                open={openBuy}
                setOpen={setOpenBuy}
                onClick={setSelectedBuy}
            />
        </div>
    );
};

export default Swap;
