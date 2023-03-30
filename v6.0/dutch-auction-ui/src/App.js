import logo from './logo.svg';
import './App.css';
import ConnectMetamask from './components/connectWallet';
import ContractDeployer from './components/deployContract';
import AuctionInfo from './components/auctionDetails';
import BidAuction from './components/bidFunction';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <ConnectMetamask></ConnectMetamask>
      <ContractDeployer></ContractDeployer>
      <BidAuction></BidAuction>
      <AuctionInfo></AuctionInfo>
    </div>
  );
}

export default App;
