import { useState } from 'react';
import { ethers } from 'ethers';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const contractAbi = [
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

function AuctionInfo() {
  const [contractAddress, setContractAddress] = useState("");
  const [winnerAddress, setWinner] = useState("");
  const [curPrice, setCurrentPrice] = useState("");
  const [sellerAddress, setSeller] = useState("");
  const [reserveP, setReservePrice] = useState(0);
  const [numBLock, setNumBlock] = useState(0);
  const [oDecrement, setOdecrement] = useState(0);
//   const [auctionInfo, setAuctionInfo] = useState([]);

  const showInfo = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);

      console.log(contract);
    
      const reservePrice = await contract.reservePrice();
      setReservePrice(parseInt(reservePrice));
      const numBlockOpen = await contract.numBlockAuctionOpen();
      setNumBlock(parseInt(numBlockOpen));
      const offerPriceDecrement = await contract.offerPriceDecrement();
      setOdecrement(parseInt(offerPriceDecrement));
      const winner = await contract.highestBidder();
      setWinner(winner);
      const currentPrice = await contract.currentPrice();
      setCurrentPrice(parseInt(currentPrice, 10));
      const seller = await contract.seller();
      setSeller(seller);

      console.log(winner + "   " + currentPrice + "   "+ seller);

    //   setAuctionInfo([
    //     winner,
    //     reservePrice,
    //     seller,
    //   ]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form>
            <Form.Group controlId="contractAddress">
              <Form.Label>Contract Address</Form.Label>
              <Form.Control type="text" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={showInfo}>Show Info</Button>
          </Form>
          <div className="mt-4 p-3 border border-primary rounded">
            <p>Reserve Price: {reserveP}</p>
            <p>Number of Block Auction Open: {numBLock}</p>
            <p>Offer Price Decrement: {oDecrement}</p>
            {winnerAddress === "0x0000000000000000000000000000000000000000" ? (
      <p>Winner: winner not yet decided</p>
    ) : (
      <p>Winner: {winnerAddress}</p>
    )}
            <p>Current Price: {curPrice}</p>
            <p>Seller: {sellerAddress}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AuctionInfo;
