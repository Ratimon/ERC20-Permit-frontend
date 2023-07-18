import type {BigNumber} from '@ethersproject/bignumber';



export type PermitSigning = {
    contractAddress: string,
    currentAccount: string,
    currentAllowanceInWei: BigNumber,
}


// export type PermitSigning = {
//     currentAccount: string,
//     contractAddress: string,
//     approveAmountInWei: BigNumber,
//     deadline: Number,
//     nonce: Number,
//     currentAllowanceInWei: BigNumber,
// }

