// TokenModal.jsx
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Button,
    Avatar,
    Typography,
    IconButton,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import base from "../assets/base.png";
import polygon from "../assets/polygon.png";
import eth from "../assets/eth.png";
import { list } from "../contexts/SelectTokenDATA";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { getContract } from "thirdweb";
import { getErc20Contract, ThirdWebClient } from "../contexts/thirdWebClient";
import { ERC20ABI } from "../utility/ABI/ERC20";
import {
    useActiveAccount,
    useActiveWalletChain,
    useReadContract,
} from "thirdweb/react";
import { getTokenDetails } from "../utility/contractMethods/ERC20";
import { ethers } from "ethers";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import coin from "../assets/kmbio.png";
import { toast } from "react-toastify";

const TokenModal = ({ open, setOpen, onClick }) => {
    const tokens = list;
    // [
    //   { name: "Eth", value: "ETH", img: eth },
    //   { name: "Polygon", value: "POLYGON", img: polygon },
    //   { name: "Base", value: "BASE", img: base },
    // ];
    const [contractAddress, setContractAddress] = useState("");
    const [tokenDetals, setToknDetails] = useState({});

    const add = useActiveAccount();
    const [address, setAddress] = useState("");

    const chain = useActiveWalletChain();
    useEffect(() => {
        if (add && add.address) {
            setAddress(add.address);
        }
    }, [add, chain]);

    const tokenDetails = async (value) => {
        try {
            if (value && value !== "" && chain && chain?.id && chain?.rpc) {
                const contract = getErc20Contract(value, chain);
                let currencyMetadata = await getCurrencyMetadata({ contract });
                currencyMetadata.address = value;
                setToknDetails(currencyMetadata);
            } else {
                setToknDetails({});
            }
        } catch (error) {
            toast.error(error?.message);
            console.log("%c Line:53 🍎 error", "color:#6ec1c2", error);
        }
    };

    const selectToken = () => {
        onClick(tokenDetals);
        setOpen(false);
        setContractAddress("");
        setToknDetails({});
    };

    const selectNativeToken = (data) => {
        onClick(data);
        setOpen(false);
        setContractAddress("");
        setToknDetails({});
    };

    return (
        <Dialog open={open} onClose={() => setOpen(!open)}>
            <DialogTitle>
                Select a token
                <IconButton
                    aria-label="close"
                    onClick={() => setOpen(!open)}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <IoClose />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <input
                    value={contractAddress}
                    onChange={(e) => {
                        setContractAddress(e.target.value);
                        tokenDetails(e.target.value);
                    }}
                    id="search"
                    placeholder="Search name or paste address"
                    type="text"
                    className="w-full rounded-xl py-2 px-2 outline-none border border-grey bg-[#f9f9f9]"
                />
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        {contractAddress &&
                        tokenDetals &&
                        tokenDetals?.address ? (
                            <>
                                <Typography variant="subtitle1">
                                    Tokens
                                </Typography>
                                <Grid container spacing={1} sx={{ mt: 1 }}>
                                    {/* {tokens.map((token, index) => ( */}
                                    <div
                                        onClick={() => {
                                            selectToken();
                                        }}
                                        // key={index}
                                        className="flex items-center mx-2 justify-center gap-2 bg-[#3c486b10] rounded-[48px] p-[9px] cursor-pointer"
                                    >
                                        <img
                                            src={coin}
                                            alt=""
                                            className="size-[35px] rounded-full"
                                        />
                                        <h3>
                                            {tokenDetals?.name} - (
                                            {tokenDetals?.symbol})
                                        </h3>
                                        <br />
                                    </div>
                                    {/* ))} */}
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Typography variant="subtitle1">
                                    Popular tokens
                                </Typography>
                                <Grid container spacing={1} sx={{ mt: 1 }}>
                                    {tokens.map((token, index) => (
                                        <div
                                            onClick={() => {
                                                selectNativeToken(token);
                                                setOpen(false);
                                            }}
                                            key={index}
                                            className="flex items-center mx-2 justify-center gap-2 bg-[#3c486b10] rounded-[48px] p-[9px] cursor-pointer"
                                        >
                                            <img
                                                src={token?.img}
                                                alt=""
                                                className="size-[22px] rounded-full"
                                            />
                                            <p>{token?.name}</p>
                                        </div>
                                    ))}
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default TokenModal;
