import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, Alert,Form } from 'react-bootstrap';

function AuctionBidder() {
    const [contractAddress, setContractAddress] = useState("");
    const [bidAmount, setBidAmount] = useState("");
    const [error, setError] = useState("");
    const [walletAddress, setWalletAddress] = useState('');
    const [signerA, setSigner] = useState("");
  
    const handleContractAddressChange = (event) => {
      setContractAddress(event.target.value);
    };
  
    const handleBidAmountChange = (event) => {
      setBidAmount(event.target.value);
    };
//   const [contractAddress, setContractAddress] = useState("");
  const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_reservePrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_numBlocksAuctionOpen",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_offerPriceDecrement",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "bid",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "buyer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentPrice",
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
      "name": "highestBidder",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "numBlockAuctionOpen",
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
      "name": "offerPriceDecrement",
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
      "name": "reservePrice",
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
      "name": "seller",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);
        console.log(signer);
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Please install MetaMask!');
    }
  };

  const handlePlaceBid = async (event) => {

    console.log(walletAddress);
    event.preventDefault();
    try {
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        signerA
      );

      const transaction = await contract.bid({
        value: bidAmount
      });
      await transaction.wait();
      alert("Bid placed successfully");
    } catch (err) {
      console.error(err.reason);
      setError(err.reason);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
      <div>
        {walletAddress ? (
          <Alert variant="success" className="text-center">
            Buyer wallet address: {walletAddress}
          </Alert>
        ) : (
          <Button variant="primary" style={{marginTop: "30px" }} onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
      </div>
    
      <div className="border rounded p-3 mt-3" style={{ width: "400px", margin: "auto", padding: "20px" }}>
        <Form onSubmit={handlePlaceBid}>
          <Form.Group>
            <Form.Label>Contract Address:</Form.Label>
            <Form.Control
              type="text"
              id="contract-address"
              value={contractAddress}
              onChange={handleContractAddressChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Bid Amount (in Ether):</Form.Label>
            <Form.Control
              type="number"
              id="bid-amount"
              value={bidAmount}
              onChange={handleBidAmountChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Place Bid
          </Button>
          {error && 
          <Alert variant="danger" className="text-center">
          {error}
          </Alert>}
          
          
        </Form>
      </div>
    </div>
    
  );
};

export default AuctionBidder;