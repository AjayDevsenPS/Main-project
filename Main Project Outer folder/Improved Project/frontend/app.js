let contract;
let account;
const contractAddress = "0xC523100003EB3A68B0B71875FE70Fb18FfD3d198"; // Replace with your deployed contract address

// Check if the wallet is already connected
const isWalletConnected = () => {
    return !!account;
};

const checkWalletConnection = () => {
    if (!account) {
        alert("Please connect your wallet first!");
        return false;
    }
    return true;
};

async function connectWallet() {
    // If already connected, don't reconnect
    if (isWalletConnected()) {
        console.log("Wallet already connected:", account);
        return;
    }
    
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
        
        // Store connection in sessionStorage to remember across pages
        sessionStorage.setItem("walletConnected", "true");
        sessionStorage.setItem("walletAccount", account);
        
        // Only show alert when manually connecting
        const connectButton = document.getElementById("connectWalletBtn");
        if (connectButton && document.activeElement === connectButton) {
            alert("Wallet Connected: " + account);
        }
    } catch (error) {
        console.error(error);
        // Only show alert when manually connecting
        const connectButton = document.getElementById("connectWalletBtn");
        if (connectButton && document.activeElement === connectButton) {
            alert("Connection Error: " + error.message);
        } else {
            console.warn("Silent connection error:", error.message);
        }
    }
}

// Check for existing connection on page load
window.addEventListener("load", async () => {
    // Try to restore session if previously connected
    if (sessionStorage.getItem("walletConnected") === "true") {
        account = sessionStorage.getItem("walletAccount");
        console.log("Restored wallet connection:", account);
        
        // Still need to initialize contract
        if (window.ethereum) {
            try {
                window.web3 = new Web3(window.ethereum);
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
            } catch (error) {
                console.warn("Contract initialization failed:", error.message);
            }
        }
    } 
    // Only attempt auto-connect on main page
    else if (window.ethereum && isMainPage()) {
        try {
            await connectWallet();
        } catch (error) {
            console.warn("Wallet auto-connection failed:", error.message);
        }
    }
    
    // Run page-specific initialization
    initCurrentPage();
});

// Helper function to determine if we're on the main page
function isMainPage() {
    const path = window.location.pathname;
    return path === "/" || path.endsWith("index.html") || path === "/index.html";
}

// Page-specific initialization
function initCurrentPage() {
    const path = window.location.pathname;
    
    if (path.includes("verify.html")) {
        // Instead of automatically calling verifyProduct(),
        // let's check if there's productData in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const scannedData = urlParams.get("productData");
        
        // Only auto-verify if we have scanned data
        if (scannedData) {
            verifyProduct();
        }
    }
}

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
        const tx = await contract.methods.registerProduct(productId, productName, manufacturer)
            .send({ from: account });

        const transactionHash = tx.transactionHash; // Capture the transaction hash

        alert("Product Registered Successfully!");
        console.log("Transaction Hash:", transactionHash);

        // Store transaction hash and generate QR Code
        localStorage.setItem(`txHash_${productId}`, transactionHash);
        generateQRCode(productId, productName, manufacturer, transactionHash);
    } catch (error) {
        console.error(error);
        alert("Registration Failed: " + error.message);
    }
}

async function generateQRCode(productId, productName, manufacturer, transactionHash) {
    const qrCodeDiv = document.getElementById("qrcode");
    if (!qrCodeDiv) return;

    try {
        const result = await contract.methods.verifyProduct(productId).call();
        const authenticity = result[0] ? "Yes" : "No";
        const owner = result[2];

        // Use Sepolia Etherscan for block verification
        const etherscanLink = `https://sepolia.etherscan.io/tx/${transactionHash}`;
        const metamaskLink = `https://metamask.app.link/dapp/sepolia.etherscan.io/tx/${transactionHash}`;
        
        const qrData = JSON.stringify({
            productId,
            productName,
            manufacturer,
            authenticity,
            owner,
            contractAddress,
            transactionHash,
            metamaskLink,
            etherscanLink
        });

        qrCodeDiv.innerHTML = "";
        new QRCode(qrCodeDiv, {
            text: etherscanLink, // QR Code links to Sepolia Etherscan transaction page
            width: 128,
            height: 128
        });

        console.log("Transaction Hash Stored:", transactionHash);
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

    // Check if this is a user-initiated verification action
    const isVerifyAction = document.activeElement && 
                          (document.activeElement.id === "verifyButton" || 
                           document.activeElement.classList.contains("verify-btn"));

    let productId;
    if (scannedData) {
        const parsedData = JSON.parse(decodeURIComponent(scannedData));
        productId = parsedData.productId;
    } else {
        productId = verifyProductIdInput ? parseInt(verifyProductIdInput.value) : null;
    }

    // Only show the alert if this is a user action AND there's no product ID
    if (isVerifyAction && !productId) {
        alert("Please enter or scan a Product ID.");
        return;
    }

    // If we have a product ID, proceed with verification
    if (productId) {
        try {
            const result = await contract.methods.verifyProduct(productId).call();
            const transactionHash = localStorage.getItem(`txHash_${productId}`); // Retrieve stored transaction hash

            productDetailsDiv.innerHTML = `
                <strong>Product Name:</strong> ${result[1]}<br>
                <strong>Current Owner:</strong> ${result[2]}<br>
                <strong>Authentic:</strong> ${result[0] ? '✅ Yes' : '❌ No'}<br>
                ${transactionHash ? `<a href="https://sepolia.etherscan.io/tx/${transactionHash}" target="_blank">View on Etherscan</a>` : ''}
            `;
        } catch (error) {
            console.error(error);
            productDetailsDiv.innerText = "Product not found or error in verification.";
            alert("Verification Error: " + error.message);
        }
    }
}

async function generateProductQRCode() {
  if (!checkWalletConnection()) return;

  const qrProductIdInput = document.getElementById("qrProductId");
  if (!qrProductIdInput) return;

  const productId = parseInt(qrProductIdInput.value);
  if (!productId) {
      alert("Please enter a valid Product ID.");
      return;
  }

  try {
      const result = await contract.methods.verifyProduct(productId).call();
      const transactionHash = localStorage.getItem(`txHash_${productId}`); // Retrieve stored transaction hash

      if (!result || !transactionHash) {
          alert("Product not found or missing transaction hash.");
          return;
      }

      const authenticity = result[0] ? "Yes" : "No";
      const productName = result[1];
      const owner = result[2];

      // Generate Etherscan & MetaMask links
      const etherscanLink = `https://sepolia.etherscan.io/tx/${transactionHash}`;
      const metamaskLink = `https://metamask.app.link/dapp/sepolia.etherscan.io/tx/${transactionHash}`;

      const qrData = JSON.stringify({
          productId,
          productName,
          authenticity,
          owner,
          contractAddress,
          transactionHash,
          metamaskLink,
          etherscanLink
      });

      // Generate QR Code
      const qrCodeDiv = document.getElementById("qrcode");
      qrCodeDiv.innerHTML = "";
      new QRCode(qrCodeDiv, {
          text: etherscanLink,  // QR Code links to the Etherscan transaction page
          width: 128,
          height: 128
      });

      console.log("QR Code Generated for Product ID:", productId);
  } catch (error) {
      console.error("QR Code Generation Error:", error);
      alert("Failed to generate QR Code: " + error.message);
  }
}