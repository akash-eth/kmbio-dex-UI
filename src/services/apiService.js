import request from "./request";

export const getLpPairAddress = (address) => {
    return new Promise(async (resolve, reject) => {
        await request
            .get(`/api/user/liquidity?address=${address}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((e) => {
                resolve(false);
            });
    });
};
