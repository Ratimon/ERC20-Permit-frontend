import _contractsInfos from '$lib/blockchain/data/contracts';

import { readable } from 'svelte/store';

export const initialContractsInfos = _contractsInfos;

let _set: any;
export const contractsInfos = readable(_contractsInfos, (set) => {
	_set = set;
});

if (import.meta.hot) {
	import.meta.hot.accept((newModule: any) => {
		_set(newModule.initialContractsInfos);
	});
}