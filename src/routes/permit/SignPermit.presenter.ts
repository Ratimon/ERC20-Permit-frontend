import {BigNumber} from '@ethersproject/bignumber';

import permitRepository from "./Permit.repository";

export default class SignPermitPresenter {

    // permit = async (owner: string, spender: string, valueToApproveInETH: BigNumber |Number )  => {
    permit = async ( spender: string, valueToApproveInETH: BigNumber |Number )  => {

         // permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)

        const valueToApproveInWEI = BigNumber.from(`${valueToApproveInETH}`).mul('1000000000000000000');

        await permitRepository.permit(
            {spender: spender, valueToApproveInWEI: valueToApproveInWEI}
        );
    };

}

