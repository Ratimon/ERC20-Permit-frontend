export const chainNames: {[chainId: string]: string} = {
    '1': 'mainnet',
    '3': 'ropsten',
    '4': 'rinkeby',
    '5': 'goerli',
    '42': 'kovan',
    '1337': 'localhost',
    '31337': 'localhost',
  };
  
  export function nameForChainId(chainId: string): string {
    const name = chainNames[chainId];
    if (name) {
      return name;
    }
    return `chain with id ${chainId}`;
  }
  