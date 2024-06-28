if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
} else {
    console.log('No Ethereum browser extension detected.');
}

const contractAddress = '0x9dd23a28128A1a0F2D677A3768F317Bf2f909E2B'; //My current Contract Address of Remix 
const contractABI = [//extracted from remix ide
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function load() {
    const accounts = await web3.eth.getAccounts();
    const totalSupply = await contract.methods.totalSupply().call();
    const balance = await contract.methods.balanceOf(accounts[0]).call();
    const lastTransactionTime = await contract.methods.getLastTransactionTime().call();

    document.getElementById('totalSupply').innerText = totalSupply;
    document.getElementById('balance').innerText = balance;
    document.getElementById('lastTransactionTime').innerText = new Date(lastTransactionTime * 1000).toLocaleString(); // Convert Unix timestamp to human-readable date
}

async function deposit() {
    const amount = document.getElementById('depositAmount').value;

    const amountWei = web3.utils.toWei(amount, 'ether');

    await contract.methods.deposit(amountWei).send({ from: web3.eth.defaultAccount });

    load(); 
}

async function withdraw() {
    const amount = document.getElementById('withdrawAmount').value;

    await contract.methods.withdraw(amount).send({ from: web3.eth.defaultAccount });

    load(); 
}

window.onload = load;
