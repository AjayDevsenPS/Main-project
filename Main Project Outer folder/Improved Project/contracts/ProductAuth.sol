// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductAuth {
    struct Product {
        uint256 productId;
        string productName;
        string manufacturer;
        address currentOwner;
        bool isAuthentic;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => address[]) public ownershipHistory;

    event ProductRegistered(uint256 productId, string productName, address manufacturer);
    event OwnershipTransferred(uint256 productId, address newOwner);

    function registerProduct(uint256 _productId, string memory _productName, string memory _manufacturer) public {
        require(products[_productId].productId == 0, "Product already exists");
        products[_productId] = Product(_productId, _productName, _manufacturer, msg.sender, true);
        ownershipHistory[_productId].push(msg.sender);

        emit ProductRegistered(_productId, _productName, msg.sender);
    }

    function transferOwnership(uint256 _productId, address _newOwner) public {
        require(products[_productId].productId != 0, "Product does not exist");
        require(products[_productId].currentOwner == msg.sender, "Not the current owner");

        products[_productId].currentOwner = _newOwner;
        ownershipHistory[_productId].push(_newOwner);

        emit OwnershipTransferred(_productId, _newOwner);
    }

    function verifyProduct(uint256 _productId) public view returns (bool, string memory, address) {
        require(products[_productId].productId != 0, "Product does not exist");
        Product memory product = products[_productId];
        return (product.isAuthentic, product.productName, product.currentOwner);
    }

    function getOwnershipHistory(uint256 _productId) public view returns (address[] memory) {
        return ownershipHistory[_productId];
    }
}
