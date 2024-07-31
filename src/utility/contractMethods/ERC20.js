

export const tokenBalance = (userAddress, tokenContract) => {
    //@ts-ignore

    return new Promise((resolve, reject) => {
        try {
            tokenContract
                .balanceOf(userAddress)
                .then((result) => {
                    console.log(
                        "%c 🍥 result: ",
                        "font-size:20px;background-color: #FCA650;color:#fff;",
                        result,
                    );
                    resolve(result);
                })
                .catch((error) => reject(error));
        } catch (error) {
            reject(error);
        }
    });
};

export const allowance = (
    address,
    tokenContract,
    mainContract,
) => {
    //@ts-ignore

    return new Promise((resolve, reject) => {
        try {
            tokenContract
                .allowance(address, mainContract)
                .then((data) => {
                    let approveToken = data;//web3.utils.fromWei(`${data}`, "ether");
                    resolve(Number(approveToken));
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) { }
    });
};

export const approveAllowance = (
    address,
    value,
    tokenContract,
    mainContract,
) => {
    //@ts-ignore

    return new Promise((resolve, reject) => {
        try {

            tokenContract
                .approve(
                    mainContract,
                    '100000000000',
                )
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
};

export const getTokenDetails = (
    tokenContract,
    account,
) => {
    //@ts-ignore

    return new Promise(async (resolve, reject) => {
        try {
            const tokenSymbol = await tokenContract.symbol();
            const decimalPlace = await tokenContract.decimals();
            const tokenName = await tokenContract.name();
            let balance = 0;
            if (account) {
                balance = await tokenContract.balanceOf(account);
            }
            resolve({
                symbol: tokenSymbol,
                balance: balance / 10 ** decimalPlace,
                decimalPlace: Number(decimalPlace),
                name: tokenName,
                icon: "",
            });

        } catch (error) {
            reject(error);
        }
    });
};