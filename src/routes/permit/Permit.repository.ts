import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

import { ethers } from "ethers";
import { Contract } from '@ethersproject/contracts';
import {BigNumber} from '@ethersproject/bignumber';
import type {Provider} from '@ethersproject/providers';
import {JsonRpcProvider} from '@ethersproject/providers';


import {wallet, flow, chain, fallback} from '$lib/blockchain/wallet';
import { chainId, chainName, fallbackProviderOrUrl, webWalletURL } from '$lib/config';

// import { contractsInfos } from '$lib/blockchain/contracts';
// import _contractsInfos from '$lib/contracts.json';
import _contractsInfos from '$lib/blockchain/data/contracts';

import type { PermitSigning } from './Permit.model';


export class PermitRepository {

    provider: Provider;
    contract: Contract;
    getPermit: Writable<PermitSigning>;

    constructor() {
        console.log('chainId',chainId);
        console.log('fallbackProviderOrUrl',fallbackProviderOrUrl);
        // console.log('fallbackProviderOrUrl.connection',fallbackProviderOrUrl.connection);
        // this.provider = new JsonRpcProvider("HTTP://localhost:8545",1337);
        this.provider = new JsonRpcProvider(import.meta.env.VITE_ETH_NODE_URI_LOCALHOST,1337);
        // this.provider = new JsonRpcProvider("http://127.0.0.1:8545",1337);
    
    
        console.log('this.provider',this.provider);
        this.contract = new Contract(
          _contractsInfos.contracts.TestToken.address,
          _contractsInfos.contracts.TestToken.abi,
          this.provider
        );
    
        this.getPermit = writable({
            contractAddress: this.contract.address,
            currentAccount: "",
            currentAllowanceInWei: BigNumber.from("0")
        })
      }

      async refresh() {
        let provider: Provider| JsonRpcProvider = wallet.provider || fallback.provider || wallet.fallbackProvider;
    
        console.log('refreshing...');
        console.log('_contractsInfos',_contractsInfos);
    

        console.log(`being connected`);
        // console.log(`provider`,await provider.getNetwork());
    
        if(!(await this.isNetworkConnected(provider)) && chainId=='1337'){
          console.log("set new provider")
          provider = this.provider
        } 
    
        this.contract = await this.contract.connect(provider);
    
        console.log(`connected`);
    
        this.getPermit.set({
            contractAddress: this.contract.address,
            currentAccount: wallet.address || '',
            currentAllowanceInWei: BigNumber.from("0")
        })
    
      }

      isNetworkConnected = async (provider) => {
        let result;
        try {
          result = await provider.getNetwork()
          console.log(`network ok`)
        } catch (err) {
          console.log(`network error`)
          return false
        }
        return true;
      }

      getPermitData = async (callback: any) => {
        this.getPermit.subscribe(callback);
        await this.refresh();
      };
    

      permit = async (programmersModel: any) => {
        // let {owner, spender, valueToApproveInWEI }=  programmersModel;
        let {spender, valueToApproveInWEI }=  programmersModel;

        const owner =  wallet.address;
        const deadline = +new Date() + 60 * 60;

        console.log("deadline: " + deadline);
        console.log("chain Id:", chainId);

        const nonce = (await this.contract.callStatic.nonces(owner)).toNumber();
        console.log("nonce:", nonce);

        const typedData = {
            types: {
              EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" },
              ],
              Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" }
              ],
            },
            primaryType: "Permit",
            domain: {
              name: "Test",
              version: "1",
              chainId: chainId,
              verifyingContract: this.contract.address
            },
            message: {
              owner: owner,
              spender: spender,
              value: valueToApproveInWEI,
              nonce: nonce,
              deadline: deadline
            }
          };

        let signature = await (this.provider as JsonRpcProvider).send("eth_signTypedData_v4",
          [owner, JSON.stringify(typedData)]
        );

        const split = (ethers as any).utils.splitSignature(signature);

        console.log("r: ", split.r);
        console.log("s: ", split.s);
        console.log("v: ", split.v);
    

        // permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
        let allowance = (await this.contract.callStatic.allowance(owner, spender));
        console.log("ALLOWANCE BEFORE:", allowance);
    
        if (wallet.contracts) {
          wallet.contracts.TestToken.permit(
            owner,
            spender,
            valueToApproveInWEI,
            deadline,
            split.r,
            split.s,
            split.v
          );
        } else {
    
          await flow.execute(async (contracts) => {
            contracts.TestToken.permit(
                owner,
                spender,
                valueToApproveInWEI,
                deadline,
                split.r,
                split.s,
                split.v
            );
          });
        }

        allowance = (await this.contract.callStatic.allowance(owner, spender));
        console.log("ALLOWANCE After:", allowance);


      };

      


}

const permitRepository = new PermitRepository();
export default permitRepository;