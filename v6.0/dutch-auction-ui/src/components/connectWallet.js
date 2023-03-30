import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Alert } from 'react-bootstrap';

function ConnectMetamask() {
  const [walletAddress, setWalletAddress] = useState('');

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(signer);
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Please install MetaMask!');
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
  {walletAddress ? (
    <Alert variant="success" className="text-center">
      Connected with wallet address: {walletAddress}
    </Alert>
  ) : (
    <Button variant="primary" style={{marginTop: "30px", marginBottom:"30px"}} onClick={connectWallet}>
      Connect Wallet
    </Button>
  )}
</div>
  );
}

export default ConnectMetamask;
