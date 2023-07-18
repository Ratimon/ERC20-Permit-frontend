import { sveltekit } from '@sveltejs/kit/vite';
// import type { UserConfig } from 'vite';
import { execSync } from 'child_process';
import fs from 'fs';

let VERSION = `timestamp_${Date.now()}`;
// try {
// 	VERSION = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
// 		.toString()
// 		.trim();
// } catch (e) {
// 	console.error(e);
// }
console.log(`VERSION: ${VERSION}`);

if (!process.env.VITE_CHAIN_ID) {
	try {
		const contractsInfo = JSON.parse(fs.readFileSync('./src/lib/blockchain/data/contracts.json', 'utf-8'));
		process.env.VITE_CHAIN_ID = contractsInfo.chainId;
	} catch (e) {
		console.error(e);
	}
}

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	define: {
		__VERSION__: JSON.stringify(VERSION)
	},
	build: {
		commonjsOptions: {
			transformMixedEsModules: false
			// exclude: ['node_modules/lodash-es/**', 'node_modules/@types/lodash-es/**']
		}
	}
};

export default config;