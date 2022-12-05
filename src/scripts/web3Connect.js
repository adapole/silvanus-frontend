window.onload = function () {
	if (window.ethereum !== 'undefined') {
		this.ethereum.on('accountsChanged', handleAccountsChanged);
		this.ethereum.on('chainChanged', handleChainChanged);
		//this.ethereum.on("connect", handleConnect);

		window.ethereum
			.request({ method: 'eth_accounts' })
			.then(handleAccountsChanged)
			.catch((err) => {
				console.log(err);
			});

		window.ethereum
			.request({ method: 'eth_chainId' })
			.then(chainSelected)
			.catch((err) => {
				console.log(err);
			});

		provider = new ethers.providers.Web3Provider(window.ethereum);
	}
	// Else Install metamask extension prompt
};

let currentAccount = null;
let H2OcontractAddress = '0x9cdb3ba26ba8067F6DcFBe76cBf7f91dC251cf76';
let tokenId = 1;
let SLVcontractAddress = '0xcCc859d2120DD47d60D5eCBFe5354bc4eDa58F83';
let MGKcontractAddress = '0xF60f41d77eFFBcEA2B5F9Ab55907456393E5892a';
//H2O_oldContactAddress = '0xc6ea7540FAf2790d614e48F6215ec8F2b5baEDD8';
let to = '0x109Bf5E11140772a1427162bb51e23c244d13b88';
let provider;
let WaterTokenABI;
let SilvanusTreeABI;
let MagicPotionABI;
/**********************************************************/
/* Handle chain (network) and chainChanged (per EIP-1193) */
/**********************************************************/

function chainSelected(_chainId) {
	if (_chainId.toString() != 420) {
		console.log('Change chain to optimism goerli: chainId 420');
	}
	console.log(_chainId);
}

function handleChainChanged(_chainId) {
	// We recommend reloading the page, unless you must do otherwise
	//window.location.reload();
	// make a popup button to request chain change.
	console.log('Show chain changed ', _chainId);
}

async function changeChain() {
	window.ethereum
		.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x1a4' }],
		})
		.then(chainSelected)
		.catch((err) => {
			if (err.code === 4902) {
				// add network to metamask
				addNetwork();
			}
			console.log(err);
		});
}

const handleAccountsChanged = (accounts) => {
	const button = document.getElementById('connect-to-metamask');
	const tooltip = document.getElementById('connect-to-metamask-tooltip');

	if (accounts.length === 0) {
		// MetaMask is locked or the user has not connected any accounts
		console.log('Please connect to MetaMask.');
		let txt = 'Connect';
		let tooltipTxt = 'Click to Connect to optimism goerli';

		button.children[0].innerText = txt;
		if (tooltip) tooltip.innerText = tooltipTxt;
	} else if (accounts[0] !== currentAccount) {
		currentAccount = accounts[0];

		console.log('Using account: ', currentAccount);
		const text = '🟢 Connected';
		button.children[0].innerText = text;
		if (tooltip) {
			tooltip.innerHTML =
				"<p>Click to copy Address!<br/><span class='room_name'>" +
				currentAccount.substring(0, 5) +
				'...' +
				currentAccount.substring(38);
			'</span>' + '</p>';

			tooltip.onclick = navigator.clipboard.writeText(currentAccount);
		}
	}
};
async function connectWallet() {
	const chainId = await window.ethereum
		.request({ method: 'eth_chainId' })
		.catch((err) => {
			console.log(err);
		});
	if (chainId != '0x1a4') {
		await window.ethereum
			.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x1a4' }],
			})
			.then(chainSelected)
			.catch((err) => {
				console.log('Failed to switch', err.code);
				if (err.code === 4902) {
					// add network to metamask
					try {
						addNetwork();
					} catch {
						console.error('Failed to ADD');
					}
				}
				console.log(err);
			});
	}

	currentAccount = await window.ethereum
		.request({ method: 'eth_requestAccounts' })
		.then(handleAccountsChanged)
		.catch((err) => {
			if (err.code === 4001) {
				// EIP-1193 userRejectedRequest error
				// If this happens, the user rejected the connection request.
				console.log('Request rejected by user.');
			} else {
				console.error(err);
			}
		});
}

async function addNetwork() {
	await window.ethereum
		.request({
			method: 'wallet_addEthereumChain',
			params: [
				{
					chainId: '0x1a4',
					chainName: 'Optimism Goerli Testnet',
					rpcUrls: ['https://goerli.optimism.io/'],
					blockExplorerUrls: ['https://goerli-optimism.etherscan.io/'],
					nativeCurrency: {
						symbol: 'ETH',
						decimals: 18,
					},
				},
			],
		})
		.catch((err) => console.error(err));
}

window.addTokens = async function () {
	await window.ethereum
		.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20',
				options: {
					address: H2OcontractAddress,
					symbol: 'H2O',
					decimals: 18,
					image:
						'https://ipfs.io/ipfs/QmecA7Fv2C3zJBxea22c7yh4fMvrPtEWA1uGKfDb6fSumd',
				},
			},
		})
		.then((success) => {
			if (success) {
				console.log('H2O successfully added to wallet!');
			} else {
				throw new Error('Something went wrong.');
			}
		})
		.catch(console.error);
};
window.mintTree = async function () {
	let SLVcontract = new ethers.Contract(
		SLVcontractAddress,
		SilvanusTreeABI,
		provider.getSigner()
	);
	let _name = 'Pine';
	tokenId = await SLVcontract.createRandomTree(_name);
};

window.walletConn = async function (evt) {
	evt.preventDefault();
	const button = document.getElementById('connect-to-metamask');
	if (!button) {
		return;
	}

	await connectWallet();
};
const handleConnect = (connectInfo) => {
	const button = document.getElementById('connect-to-metamask');
	const tooltip = document.getElementById('connect-to-metamask-tooltip');
	//if(connectInfo.chainId != '0x1a4') console.log('Change chain')

	const text = '🟢 Connected';
	button.children[0].innerText = text;
	// button.disabled = true;

	if (tooltip) {
		tooltip.innerHTML =
			"<p>Click to copy Address!<br/><span class='room_name'>" +
			currentAccount +
			'</span>' +
			'</p>';

		// tooltip.onclick = navigator.clipboard.writeText(currentAccount);
	}
};
let ERC20abi;

fetch('../../include/erc20abi.json')
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		ERC20abi = data;
	});

fetch('../../include/waterToken.abi.json')
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		WaterTokenABI = data;
	});

fetch('../../include/silvanusTree.abi.json')
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		SilvanusTreeABI = data;
	});

fetch('../../include/magicPotion.abi.json')
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		MagicPotionABI = data;
	});

// Part-1: Watering Tree
export function waterTree(_volume) {
	return new Promise(async (resolve, reject) => {
		// Whose tree to water
		let _any = true;
		// Volume of water
		//let _volume = '222';

		let volume = ethers.utils.parseUnits(_volume, 18);
		let H2Ocontract = new ethers.Contract(
			H2OcontractAddress,
			WaterTokenABI,
			provider.getSigner()
		);
		let txn_;

		try {
			await H2Ocontract.increaseAllowance(SLVcontractAddress, volume);

			let _treeNFT = await getTokenId(_any);
			console.log('Watering tree: ', _treeNFT);
			let SLVcontract = new ethers.Contract(
				SLVcontractAddress,
				SilvanusTreeABI,
				provider.getSigner()
			);
			txn_ = await SLVcontract.waterTree(_treeNFT, volume);
			console.log('Txn hash: ', txn_.hash);

			resolve(txn_.hash);
		} catch (error) {
			reject(error);
		}
	});
}

async function getTokenId(_any) {
	if (_any) {
		return tokenId;
	}
	let SLVcontract = new ethers.Contract(
		SLVcontractAddress,
		SilvanusTreeABI,
		provider
	);
	let trees = await SLVcontract.getOwnerTrees(currentAccount);
	console.log('trees: ', trees);
	console.log('trees num: ', trees.length);
	tokenId = trees[0].id.toString(); // Brute force select the first NFT user minted.
	let _len = trees.length;
	for (i = 0; i < _len; i++) {
		console.log('tokenId: ', trees[i].id.toString());
		showTree(trees[i].id.toString());
	}
	return tokenId;
}

async function showTree(_tokenId) {
	let SLVcontract = new ethers.Contract(
		SLVcontractAddress,
		SilvanusTreeABI,
		provider
	);
	let uri = await SLVcontract.tokenURI(_tokenId);
	//console.log('Image: ', uri);
}

// Part-2: Praying
export function signData() {
	return new Promise(async (resolve, reject) => {
		const signer = provider.getSigner();

		let msg = 'praying';
		let signature;
		try {
			signature = await signer.signMessage(msg);

			let address = ethers.utils.verifyMessage(msg, signature);

			console.log('signed by: ', address);
			resolve(address);
		} catch (error) {
			reject(error);
		}
	});
}

// Part-3: Magic applied
async function applyMagic() {
	// Whose tree to water
	let _any = true;
	// Which potion to use
	let _id = 0;
	let MGKcontract = new ethers.Contract(
		MGKcontractAddress,
		MagicPotionABI,
		provider.getSigner()
	);
	let _potionIds = await MGKcontract.walletOfOwner(currentAccount);
	let _usePower = 1;
	let _treeNFT = await getTokenId(true);
	if (_potionIds.length > 0) {
		await MGKcontract.applyPower(_potionIds[_id], _usePower, _treeNFT);
	}
}

async function checkBalanceFromContract(_contractAddress, _abi) {
	let contract = new ethers.Contract(_contractAddress, _abi, provider);

	let balance = await contract.balanceOf(currentAccount);

	console.log('H2O: ', balance.toString() / Math.pow(10, 18));
}

async function sendH2O(h2oamount) {
	let H2Ocontract = new ethers.Contract(
		H2OcontractAddress,
		ERC20abi,
		provider.getSigner()
	);

	let amount = ethers.utils.parseUnits(h2oamount, 18);
	let txn = await H2Ocontract.transfer(to, amount);

	console.log('Txn hash: ', txn.hash);
	checkEvents();
}
export default function getEmployee(id, name) {
	return { id, name };
}
export function H2OSend(h2amount) {
	return new Promise(async (resolve, reject) => {
		//let total = h2amount * 1.2;
		let H2Ocontract = new ethers.Contract(
			H2OcontractAddress,
			ERC20abi,
			provider.getSigner()
		);

		let amount = ethers.utils.parseUnits(h2amount, 18);
		let txn;
		try {
			txn = await H2Ocontract.transfer(to, amount);

			console.log('Txn hash: ', txn.hash);
			checkEvents();
			resolve(txn.hash);
		} catch (error) {
			reject(error);
		}

		/*
		H2Ocontract.transfer(to,amount).then(
			txn => resolve(txn)
		).catch(err =>{
			reject(err)
		})

		 if (total > 145) {
			reject('bad vibe');
		} else {
			resolve(total);
		} */
	});
}

const checkEvents = async () => {
	let H2Ocontract = new ethers.Contract(H2OcontractAddress, ERC20abi, provider);
	H2Ocontract.on('Transfer', (from, to, amount) => {
		console.log('transfer event emmited');
		console.log(
			'from:',
			JSON.stringify(from),
			'\nto:',
			JSON.stringify(to),
			'\namount:',
			JSON.stringify(amount.toString() / Math.pow(10, 18))
		);
	});
};
