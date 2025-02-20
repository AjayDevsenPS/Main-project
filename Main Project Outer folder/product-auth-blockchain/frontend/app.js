let contract;
let account;
const contractAddress = "0x6F049B8B880aB034e50A29D6363815ED212cBE5F"; // Replace with your deployed contract address

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
        console.log("Wallet Connected:", account);

        alert("Wallet Connected: " + account);
    } catch (error) {
        console.error(error);
        alert("Connection Error: " + error.message);
    }
}

// Auto-connect wallet on page load
window.addEventListener("load", async () => {
    if (window.ethereum) {
        try {
            await connectWallet();
        } catch (error) {
            console.warn("Wallet connection failed:", error.message);
        }
    }
});

async function addProduct() {
    if (!checkWalletConnection()) return;

    const productIdInput = document.getElementById("productId");
    const productNameInput = document.getElementById("productName");
    const manufacturerInput = document.getElementById("manufacturer");

    if (!productIdInput || !productNameInput || !manufacturerInput) return;

    const productId = parseInt(productIdInput.value);
    const productName = productNameInput.value;
    const manufacturer = manufacturerInput.value;

    if (!productId || !productName || !manufacturer) {
        alert("Please fill all fields.");
        return;
    }

    try {
        await contract.methods.registerProduct(productId, productName, manufacturer)
            .send({ from: account });

        alert("Product Registered Successfully!");
        generateQRCode(productId);
    } catch (error) {
        console.error(error);
        alert("Registration Failed: " + error.message);
    }
}

async function generateQRCode(productId, productName, manufacturer) {
    const qrCodeDiv = document.getElementById("qrcode");
    if (!qrCodeDiv) return;

    try {
        const result = await contract.methods.verifyProduct(productId).call();
        const authenticity = result[0] ? "Yes" : "No";
        const owner = result[2];

        const qrData = JSON.stringify({
            productId,
            productName,
            manufacturer,
            authenticity,
            owner,
            contractAddress
        });

        qrCodeDiv.innerHTML = "";
        new QRCode(qrCodeDiv, {
            text: qrData,
            width: 128,
            height: 128
        });
    } catch (error) {
        console.error("QR Code Generation Error:", error);
        alert("Failed to generate QR Code: " + error.message);
    }
}

async function verifyProduct() {
    if (!checkWalletConnection()) return;

    const verifyProductIdInput = document.getElementById("verifyProductId");
    const productDetailsDiv = document.getElementById("productDetails");
    if (!productDetailsDiv) return;

    const urlParams = new URLSearchParams(window.location.search);
    const scannedData = urlParams.get("productData");

    let productId;
    if (scannedData) {
        const parsedData = JSON.parse(decodeURIComponent(scannedData));
        productId = parsedData.productId;
    } else {
        productId = verifyProductIdInput ? parseInt(verifyProductIdInput.value) : null;
    }

    if (!productId) {
        alert("Please enter or scan a Product ID.");
        return;
    }

    try {
        const result = await contract.methods.verifyProduct(productId).call();
        productDetailsDiv.innerHTML = `
            <strong>Product Name:</strong> ${result[1]}<br>
            <strong>Current Owner:</strong> ${result[2]}<br>
            <strong>Authentic:</strong> ${result[0] ? '✅ Yes' : '❌ No'}
        `;
    } catch (error) {
        console.error(error);
        productDetailsDiv.innerText = "Product not found or error in verification.";
        alert("Verification Error: " + error.message);
    }
}

// Auto-run verifyProduct if on the verify.html page with a scanned QR code
window.addEventListener("load", () => {
    if (window.location.pathname.includes("verify.html")) {
        verifyProduct();
    }
});
