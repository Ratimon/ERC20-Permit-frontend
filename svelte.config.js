import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

function loadJSON(filepath) {
	try {
	  return JSON.parse(fs.readFileSync(filepath).toString());
	} catch (e) {
	  return {};
	}
  }
  const pkg = loadJSON('./package.json');
  
  let VERSION = `timestamp_${Date.now()}`;
//   try {
// 	VERSION = execSync('git rev-parse --short HEAD', {stdio: ['ignore', 'pipe', 'ignore']})
// 	  .toString()
// 	  .trim();
//   } catch (e) {
// 	console.error(e);
//   }
  console.log(`VERSION: ${VERSION}`);
  
  if (!process.env.VITE_CHAIN_ID) {
	try {
	  const contractsInfo = JSON.parse(fs.readFileSync('./src/lib/blockchain/data/contracts.json'));
	  process.env.VITE_CHAIN_ID = contractsInfo.chainId;
	} catch (e) {
	  console.error(e);
	}
  }

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	},
	vite: {
		build: {
		  sourcemap: true,
		},
		define: {
		  __VERSION__: JSON.stringify(VERSION),
		}
	  }
};

export default config;
