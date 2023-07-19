import {formatUnits} from '@ethersproject/units';
import {BigNumber} from '@ethersproject/bignumber';

import permitRepository from "./Permit.repository";

export default class GetPermitPresenter {

    load = async (callback: any)  => {
        await permitRepository.getPermitData( getPermitPm => {
    
           let {contractAddress, currentAccount}=  getPermitPm;
    
          const getPermitVm = {
                contractAddress: contractAddress,
                currentAccount: currentAccount              
            };
    
          callback(getPermitVm);
        });
      };

}