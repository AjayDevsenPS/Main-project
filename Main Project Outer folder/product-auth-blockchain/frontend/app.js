let contract;
let account;
const contractAddress = "0x6F049B8B880aB034e50A29D6363815ED212cBE5F"; // Replace with deployed address

const checkWalletConnection = () => {
    if (!account) {
        alert("Please connect your wallet first!");
        return false;
    }
    return true;
};

async function connectWallet() {
    try {
        if (!window.ethereum) throw new Error("MetaMask not detected!");
        
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];

        const contractABI = [
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "productName",
                "type": "string"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "manufacturer",
                "type": "address"
              }
            ],
            "name": "ProductRegistered",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "ownershipHistory",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "products",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "productName",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "manufacturer",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "currentOwner",
                "type": "address"
              },
              {
                "internalType": "bool",
                "name": "isAuthentic",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_productId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "_productName",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "_manufacturer",
                "type": "string"
              }
            ],
            "name": "registerProduct",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_productId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_newOwner",
                "type": "address"
              }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_productId",
                "type": "uint256"
              }
            ],
            "name": "verifyProduct",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              },
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_productId",
                "type": "uint256"
              }
            ],
            "name": "getOwnershipHistory",
            "outputs": [
              {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          }
        ];

        contract = new web3.eth.Contract(contractABI, contractAddress);
        alert("Wallet Connected: " + account);
    } catch (error) {
        console.error(error);
        alert("Connection Error: " + error.message);
    }
}

async function addProduct() {
    try {
        if (!checkWalletConnection()) return;
        
        const productId = parseInt(document.getElementById("productId").value);
        const productName = document.getElementById("productName").value;
        const manufacturer = document.getElementById("manufacturer").value;

        if (!productId || !productName || !manufacturer) {
            alert("Please fill all fields");
            return;
        }

        await contract.methods.registerProduct(productId, productName, manufacturer)
            .send({ from: account });
        
        alert("Product Registered Successfully!");
        generateQRCode(productId);
    } catch (error) {
        console.error(error);
        alert("Registration Failed: " + error.message);
    }
}

function generateQRCode(productId) {
    document.getElementById("qrcode").innerHTML = "";
    const verificationUrl = `${window.location.origin}/verify.html?productId=${productId}`;
    new QRCode(document.getElementById("qrcode"), {
        text: verificationUrl,
        width: 128,
        height: 128
    });
}

async function verifyProduct() {
    try {
        if (!checkWalletConnection()) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const scannedProductId = urlParams.get("productId");
        const productId = scannedProductId || parseInt(document.getElementById("verifyProductId").value);
        
        if (!productId) {
            alert("Please enter or scan a Product ID");
            return;
        }
        
        const result = await contract.methods.verifyProduct(productId).call();
        
        document.getElementById("productDetails").innerHTML = 
            `Product Name: ${result[1]}<br>
             Current Owner: ${result[2]}<br>
             Authentic: ${result[0] ? '✅ Yes' : '❌ No'}`;
    } catch (error) {
        console.error(error);
        document.getElementById("productDetails").innerText = "Product not found or error in verification";
        alert("Verification Error: " + error.message);
    }
}
