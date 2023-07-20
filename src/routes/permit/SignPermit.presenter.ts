import {BigNumber} from '@ethersproject/bignumber';

import permitRepository from "./Permit.repository";

export default class SignPermitPresenter {

    permit = async ( spender: string, valueToApproveInETH: BigNumber |Number )  => {

        const valueToApproveInWEI = BigNumber.from(`${valueToApproveInETH}`).mul('1000000000000000000');

        await permitRepository.permit(
            {spender: spender, valueToApproveInWEI: valueToApproveInWEI}
        );
    };

}

