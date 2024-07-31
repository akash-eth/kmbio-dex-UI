import React, { useEffect, useState } from "react";
import dropdown from "../assets/dropdown.png";
import base from "../assets/base.png";
import polygon from "../assets/polygon.png";
import down from "../assets/down.png";
import eth from "../assets/eth.png";
import gas from "../assets/gas.png";
import TokenModal from "./TokenDialog";
import { useParams, useNavigate } from "react-router-dom";
import coin from "../assets/kmbio.png";
import {
    getErc20Contract,
    getRouterContract,
    getWalletBalanceContract,
} from "../contexts/thirdWebClient";
import { allowance, approve, balanceOf } from "thirdweb/extensions/erc20";
import { routerAddress } from "../contexts/config";
import {
    useActiveAccount,
    useActiveWalletChain,
    useSendTransaction,
} from "thirdweb/react";
import { prepareContractCall, sendTransaction as sendTx } from "thirdweb";
import { toast } from "react-toastify";
import { createPool } from "thirdweb/extensions/uniswap";
import { ethers } from "ethers";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { getWalletBalance } from "thirdweb/wallets";

const AddLiquidity = () => {
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
    let navigate = useNavigate();
    const { address1, address2 } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (address1) {
                const tokenData = await tokenDetails(address1);
                setSelected(tokenData);
            }
            if (address2) {
                const tokenData = await tokenDetails(address2);
                setSelectedBuy(tokenData);
            }
            setCheckData(true);
        };
        fetchData();
    }, [address1, address2, add, chain]);

    const [token1Details, setToken1Details] = useState({});
    const [token2Details, setToken2Details] = useState({});

    const [token1value, setToken1value] = useState(0);
    const [token2value, setToken2value] = useState(0);

    const [price, setPrice] = useState(1);

    const tokenDetails = async (value) => {
        try {
            if (value && value !== "" && chain && chain?.id && chain?.rpc) {
                const contract = getErc20Contract(value, chain);
                let currencyMetadata = await getCurrencyMetadata({ contract });
                currencyMetadata.address = value;
                return currencyMetadata;
                // setToknDetails(currencyMetadata)
            } else {
                return false;
                // setToknDetails({})
            }
        } catch (error) {
            return false;

            //   toast.error(error?.message)
            //   console.log("%c Line:53 🍎 error", "color:#6ec1c2", error);
        }
    };

    useEffect(() => {
        if (checkData) {
            let route = `/pool/addliquidity/`;
            if (selected && selected !== "" && selected.address !== address1) {
                route += selected.address + "/";
            } else {
                route += address1 + "/";
            }
            if (
                selectedBuy &&
                selectedBuy !== "" &&
                selectedBuy.address !== address2
            ) {
                route += selectedBuy.address;
            } else {
                route += address2;
            }
            navigate(route);
        }
    }, [selected, selectedBuy]);

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
                // const contract = getErc20Contract(selected.address, chain);
                // let approvedAmount = await allowance({
                //     contract,
                //     owner: address,
                //     spender: routerAddress,
                // });
                tokenDetails.approvedBalance = Number(100000000000) * 1;
                let tokenBalance = await getWalletBalanceContract(
                    address,
                    chain,
                );
                console.log(
                    "%c Line:153 🥒 tokenBalance",
                    "color:#e41a6a",
                    tokenBalance,
                );
                tokenDetails.balance =
                    Number(ethers.formatUnits(tokenBalance, 18)) * 1;
                console.log(
                    "%c Line:171 🍎 tokenDetails",
                    "color:#33a5ff",
                    tokenDetails,
                );
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
                // const contract = getErc20Contract(selected.address, chain);
                // let approvedAmount = await allowance({
                //     contract,
                //     owner: address,
                //     spender: routerAddress,
                // });
                tokenDetails.approvedBalance = Number(100000000000) * 1;
                let tokenBalance = await getWalletBalanceContract(
                    address,
                    chain,
                );
                console.log(
                    "%c Line:153 🥒 tokenBalance",
                    "color:#e41a6a",
                    tokenBalance,
                );
                tokenDetails.balance =
                    Number(ethers.formatUnits(tokenBalance, 18)) * 1;
                setToken2Details(tokenDetails);
            }
        };
        getData();
    }, [selected, selectedBuy, loading]);

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

    const { mutate: sendTransaction } = useSendTransaction();

    const addLiquidity = async () => {
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
            if (
                token1Details?.address ==
                    "0x0000000000000000000000000000000000000000" ||
                token2Details?.address ==
                    "0x0000000000000000000000000000000000000000"
            ) {
                transaction = prepareContractCall({
                    contract,
                    method: "function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)",
                    params: [
                        token1Details?.address ==
                        "0x0000000000000000000000000000000000000000"
                            ? token2Details?.address
                            : token1Details?.address,
                        token1Details?.address ==
                        "0x0000000000000000000000000000000000000000"
                            ? token2amount
                            : token1amount,
                        "1",
                        "1",
                        address,
                        Math.floor(new Date().getTime() / 1000) + 900,
                    ],
                    value:
                        token1Details?.address ==
                        "0x0000000000000000000000000000000000000000"
                            ? token1amount
                            : token2amount,
                });
            } else {
                transaction = prepareContractCall({
                    contract,
                    method: `function addLiquidity(address tokenA, address tokenB, uint256 amountADesired,uint256 amountBDesired,uint256 amountAMin,uint256 amountBMin,address to,uint256 deadline)`,
                    params: [
                        token1Details?.address,
                        token2Details?.address,
                        token1amount,
                        token2amount,
                        token1amount,
                        token2amount,
                        address,
                        Math.floor(new Date().getTime() / 1000) + 900,
                    ],
                });
            }
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
        <div className="max-w-[524px] mx-3 sm:mx-auto mt-20 flex gap-6 items-center flex-col">
            <div className="rounded-[16px] overflow-hidden border w-full border-[#d5d5d5]">
                <div className="bg-[#f7f7f7] text-[#000000ae] flex items-center justify-between text-[14px] sm:text-[16px] font-normal px-6 py-5">
                    <div className="text-left">
                        <input
                            className="text-[30px] sm:text-[38px] font-semibold text-[#102C57]"
                            style={{ width: "80%" }}
                            type="number"
                            value={token1value}
                            onChange={(e) => {
                                setToken1value(e.target.value);
                            }}
                        />
                        {token1Details && token1Details?.symbol && (
                            <p className="text-[12px] sm:text-[14px] font-semibold text-[#3C486B] mt-1">
                                Balance :{" "}
                                {token1Details?.balance
                                    ? token1Details?.balance
                                    : 0}{" "}
                                {token1Details?.symbol}{" "}
                            </p>
                        )}
                    </div>
                    <div
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-center gap-1 sm:gap-3 bg-white rounded-[48px] border-2 border-[#a3a3a3] px-[9px] py-[4px] cursor-pointer"
                        style={{ width: "70%" }}
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
                    </div>
                </div>
            </div>
            <img src={down} className="my-[-21px] z-50" />
            <div className="rounded-[16px] overflow-hidden border w-full border-[#d5d5d5]">
                <div className="bg-[#f7f7f7] text-[#000000ae] flex items-center justify-between text-[16px] font-normal px-6 py-5 border-b border-[#d5d5d5]">
                    <div className="text-left">
                        <input
                            className="text-[30px] sm:text-[38px] font-semibold text-[#102C57]"
                            style={{ width: "80%" }}
                            value={token2value}
                            onChange={(e) => {
                                setToken2value(e.target.value);
                            }}
                        />

                        {token2Details && token2Details?.symbol && (
                            <p className="text-[12px] sm:text-[14px] font-semibold text-[#3C486B] mt-1">
                                Balance :{" "}
                                {token2Details?.balance
                                    ? token2Details?.balance
                                    : 0}{" "}
                                {token2Details?.symbol}{" "}
                            </p>
                        )}
                    </div>
                    <div
                        onClick={() => setOpenBuy(!openBuy)}
                        className="flex items-center justify-center gap-1 sm:gap-3 bg-white border-2 border-[#a3a3a3] rounded-[48px] px-[9px] py-[4px] cursor-pointer"
                        style={{ width: "70%" }}
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
                    </div>
                </div>
            </div>
            {token1Details && token1Details?.approvedBalance <= 0 ? (
                loading ? (
                    <button
                        className="bg-gradient-to-r mt-2 from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[16px] px-[4px] text-[#fff] text-[18px] font-semibold "
                        disabled
                    >
                        Loading ..
                    </button>
                ) : (
                    <button
                        className="bg-gradient-to-r mt-2 from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[16px] px-[4px] text-[#fff] text-[18px] font-semibold "
                        onClick={() => approveTokenFun(token1Details?.address)}
                    >
                        approve {token1Details?.symbol}
                    </button>
                )
            ) : (
                ""
            )}
            {token2Details && token2Details?.approvedBalance <= 0 ? (
                loading ? (
                    <button
                        className="bg-gradient-to-r mt-2 from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[16px] px-[4px] text-[#fff] text-[18px] font-semibold "
                        disabled
                    >
                        Loading ..
                    </button>
                ) : (
                    <button
                        className="bg-gradient-to-r mt-2 from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[16px] px-[4px] text-[#fff] text-[18px] font-semibold "
                        onClick={() => approveTokenFun(token2Details?.address)}
                    >
                        approve {token2Details?.symbol}
                    </button>
                )
            ) : (
                ""
            )}
            <button
                className="bg-gradient-to-r mt-2 from-[#F970BF] to-[#C40272] w-full rounded-[64px] py-[16px] px-[4px] text-[#fff] text-[18px] font-semibold "
                disabled={
                    (token2Details && token2Details?.approvedBalance <= 0) ||
                    (token1Details && token1Details?.approvedBalance <= 0)
                        ? true
                        : false
                }
                onClick={addLiquidity}
            >
                Add Liquidity
            </button>{" "}
            <div className="bg-white w-full text-[#000000ae] flex justify-between text-[16px] sm:text-[18px] font-medium px-2 py-2">
                <h6>1 USDT = 0.0003 WETH ($0.999)</h6>
                {/* <div className="flex justify-center items-center gap-2">
          <img src={gas} />
          <b className="text-[16px] sm:text-[18px] font-medium">$2.00</b>
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

export default AddLiquidity;
