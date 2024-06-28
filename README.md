# Allegiant Shark Crypto Bank

Smart Contract integrated with front end, with function like Total balance, Total Supply, last withdrawl, Recipient address
and withdrawl

## Description

This smart contract is designed to illustrate various essential features of Solidity when integrated with front end, including:

1. Management of Contract
2. Use of Snowtrace testnet
3. Use of Ganache
4. Use of Scripts
5. Bridging using Metamask

The contract includes:

1. Functions to dispaly total supply of tokens.
2. A function to show last withdrawl transaction.
3. A functions to display balance.
4. A function to Transfer the tokens to recipient.
5. Custom error handling for specific constraints.


## Getting Started

### Installing

This program runs on EVM (Remix along with ".sol" as extension) and on Visual Studio Code (Html, javascript and css files for frontend). In order to run
the fron end with integration with Smart Contract we need to Bridge the metamask and the .html file

### Executing program

We need a solidity compatible virtual machine in order to run this program.

1.Create a new file with ".sol" extension
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name = "SimpleToken";
    string public symbol = "STK";
    uint8 public decimals = 18;
    uint256 private _totalSupply = 1000000 * (10 ** uint256(decimals));

    mapping(address => uint256) private _balances;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() {
        _balances[msg.sender] = _totalSupply;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Transfer to the zero address");
        require(_balances[msg.sender] >= amount, "Insufficient balance");

        _balances[msg.sender] -= amount;
        _balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }
}

```

2. Create a JavaScript file(with .js extension) on Visual studio
We need to obtain the Contract address and the ABI from Remix after deployment of the contract.


```
if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
} else {
    console.log('No Ethereum browser extension detected.');
}

const contractAddress = '0x9dd23a28128A1a0F2D677A3768F317Bf2f909E2B'; //extracted after contract deployment
const contractABI = [ //extracted from remix
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
let lastTransactionTimestamp = 0;

async function load() {
    const accounts = await web3.eth.getAccounts();
    const totalSupply = await contract.methods.totalSupply().call();
    const balance = await contract.methods.balanceOf(accounts[0]).call();

    document.getElementById('totalSupply').innerText = totalSupply;
    document.getElementById('balance').innerText = balance;
}

async function transferTokens() {
    const accounts = await web3.eth.getAccounts();
    const recipient = document.getElementById('recipient').value;
    const amount = document.getElementById('amount').value;

    const startTime = new Date().getTime();
    await contract.methods.transfer(recipient, amount).send({ from: accounts[0] });
    const endTime = new Date().getTime();

    lastTransactionTimestamp = endTime - startTime;
    document.getElementById('lastTransactionDuration').innerText = lastTransactionTimestamp + ' ms';

    load(); 
}

window.onload = load;

```

3. Create a HTML file(with .html extension on visual code studio too) in the same location as the javascript file

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Allegiant Shark Crypto Bank</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Allegiant Shark Crypto Bank</h1>
        <div>
            <h2>Total Supply: <span id="totalSupply"></span></h2>
            <h2>Your Balance: <span id="balance"></span></h2>
            <h2>Last Transaction Duration: <span id="lastTransactionDuration"></span></h2>
        </div>
        <div>
            <input type="text" id="recipient" placeholder="Recipient Address">
            <input type="number" id="amount" placeholder="Amount">
            <button onclick="transferTokens()">Transfer</button>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/web3@1.5.2/dist/web3.min.js"></script>
    <script src="app.js"></script>
</body>
</html>

```

4. Create a CSS file(with .css extension) and place it in the same location as the HTML and Javascript file.


```
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: auto;
}

h1 {
    text-align: center;
    color: #333;
}

h2, h3 {
    color: #666;
}

#totalSupply, #balance, #lastTransactionTime {
    font-weight: bold;
}

.action-section {
    margin-top: 20px;
    border-top: 1px solid #ccc;
    padding-top: 20px;
}

input {
    display: block;
    margin: 10px 0;
    padding: 10px;
    width: calc(100% - 22px);
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 10px;
    width: 100%;
    border: none;
    border-radius: 5px;
    background-color: #28a745;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background-color: #218838;
}

```
5. After creating the files do keep them on running state and link the .sol with metamask and place the Contract the address and ABI
   in the Javascript.

6. Go live in Visual Code Studio and run the program   


## Help

Common Issues:
 1. Contract Compilation Errors:
   A. Ensure your Solidity version is compatible (0.8.8 or later).
   B. Check for syntax errors or typos in the contract.

2. Function Call Errors:

   A. Ensure you are using the correct contract address and ABI.
   B. Check for access restrictions if encountering permission errors (e.g., only owner functions).

3. Script Errors:

    A. It's always adised to select a compatible script for favourable outcomes.
    B. Don't add unnecessary Scripts

4. Planing Errors:

     A. Always make the entire plan in advance and then start coding

## Authors


Contributors names and contact info


ex. Sparsh Shandil 
ex. [@Allegiantshark](https://linktr.ee/allegiantshark)


## License

This project is licensed under the Sparsh Shandil License - see the LICENSE.md file for details
