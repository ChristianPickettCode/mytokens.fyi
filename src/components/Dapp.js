import React from "react";

import { ethers } from "ethers";

import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";

import { TokenList } from "./TokenList";

const ETHEREUM_NETWORK_ID = '1';

export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {

      selectedAddress: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>
              mytokens.fyi
            </h1>
            <p>Easy way to add your tokens to metamask.</p>
            <p>
              {this.state.selectedAddress ? <b>{this.state.selectedAddress}</b> : ""}
            </p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">

            
            {this.state.selectedAddress ? 
              <TokenList selectedAddress={this.state.selectedAddress} /> : 
              <ConnectWallet 
                connectWallet={() => this._connectWallet()} 
                networkError={this.state.networkError}
                dismiss={() => this._dismissNetworkError()}
              />}

          </div>
        </div>
      </div>
    );
  }

  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.enable();

    if (!this._checkNetwork()) {
      return;
    }
    
    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
      this._resetState();
    });
  }

  _initialize(userAddress) {
    this.setState({
      selectedAddress: userAddress,
    });

    this._intializeEthers();
  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // This method checks if Metamask selected network is Localhost:8545 
  _checkNetwork() {
    if (window.ethereum.networkVersion === ETHEREUM_NETWORK_ID) {
      return true;
    }

    this.setState({ 
      networkError: 'Please connect Metamask to Ethereum Mainnet'
    });

    return false;
  }
}
