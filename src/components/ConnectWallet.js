import React from "react";
import { Button } from 'antd';

import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-12 text-center">
          {/* Metamask network should be set to Localhost:8545. */}
          {networkError && (
            <NetworkErrorMessage 
              message={networkError} 
              dismiss={dismiss} 
            />
          )}
        </div>
        <div className="col-6 p-4 text-center">
          {/* <p>Please connect to your wallet.</p> */}
          <Button
            type="primary"
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}
