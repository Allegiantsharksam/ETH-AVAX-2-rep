// Ensure you are using the right web3 provider (e.g., MetaMask)
if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
} else {
    console.log('No Ethereum browser extension detected.');
}

const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = [
    // Add your contract's ABI here
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

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

    await contract.methods.transfer(recipient, amount).send({ from: accounts[0] });
    load(); // Refresh the balance after transfer
}

window.onload = load;
