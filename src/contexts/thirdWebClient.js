import {
    createThirdwebClient,
    eth_getBalance,
    getContract,
    getRpcClient,
} from "thirdweb";
import { ERC20ABI } from "../utility/ABI/ERC20";
import { factoryAddress, routerAddress } from "./config";
import { ROUTERABI } from "../utility/ABI/Router";
import { LPABI } from "../utility/ABI/LPABI";
import { getWalletBalance } from "thirdweb/wallets";
import { FACTORYABI } from "../utility/ABI/FactoryABI";

export const ThirdWebClient = createThirdwebClient({
    clientId: process.env.REACT_APP_THIRD_WEB_CLIENT,
});

export const getErc20Contract = (address, chain) => {
    // console.log("%c Line:11 🍣 chain", "color:#ed9ec7", chain);
    return getContract({
        client: ThirdWebClient,
        address: address,
        abi: ERC20ABI,
        chain: chain
            ? chain
            : {
                  id: 5918836757,
                  name: "BruFinance",
                  rpc: "https://testnet-rpc.kmbio.xyz",
                  // icon: coin,
                  nativeCurrency: {
                      name: "ETH",
                      symbol: "ETH",
                      decimals: 18,
                  },
                  testnet: true,
              },
    });
};

export const getWalletBalanceContract = (address, chain) => {
    const rpcRequest = getRpcClient({ client: ThirdWebClient, chain });
    return eth_getBalance(rpcRequest, {
        address: address,
    });

    // console.log("%c Line:11 🍣 chain", "color:#ed9ec7", chain);
    // return getWalletBalance({
    //     client: ThirdWebClient,
    //     address: address,
    //     chain: chain
    //         ? chain
    //         : {
    //               id: 5918836757,
    //               name: "BruFinance",
    //               rpc: "https://testnet-rpc.kmbio.xyz",
    //               // icon: coin,
    //               nativeCurrency: {
    //                   name: "ETH",
    //                   symbol: "ETH",
    //                   decimals: 18,
    //               },
    //               testnet: true,
    //           },
    // });
};

export const getLPContract = (address, chain) => {
    // console.log("%c Line:11 🍣 chain", "color:#ed9ec7", chain);
    return getContract({
        client: ThirdWebClient,
        address: address,
        abi: LPABI,
        chain: chain
            ? chain
            : {
                  id: 5918836757,
                  name: "BruFinance",
                  rpc: "https://testnet-rpc.kmbio.xyz",
                  // icon: coin,
                  nativeCurrency: {
                      name: "ETH",
                      symbol: "ETH",
                      decimals: 18,
                  },
                  testnet: true,
              },
    });
};

export const getRouterContract = (chain) => {
    // console.log("%c Line:11 🍣 chain", "color:#ed9ec7", chain);
    return getContract({
        client: ThirdWebClient,
        address: routerAddress,
        abi: ROUTERABI,
        chain: chain
            ? chain
            : {
                  id: 5918836757,
                  name: "BruFinance",
                  rpc: "https://testnet-rpc.kmbio.xyz",
                  // icon: coin,
                  nativeCurrency: {
                      name: "ETH",
                      symbol: "ETH",
                      decimals: 18,
                  },
                  testnet: true,
              },
    });
};

export const getFactoryContract = (chain) => {
    // console.log("%c Line:11 🍣 chain", "color:#ed9ec7", chain);
    return getContract({
        client: ThirdWebClient,
        address: factoryAddress,
        abi: FACTORYABI,
        chain: chain
            ? chain
            : {
                  id: 5918836757,
                  name: "BruFinance",
                  rpc: "https://testnet-rpc.kmbio.xyz",
                  // icon: coin,
                  nativeCurrency: {
                      name: "ETH",
                      symbol: "ETH",
                      decimals: 18,
                  },
                  testnet: true,
              },
    });
};
