import React, { useState } from "react";
import Uik from "@reef-chain/ui-kit";

import {
  web3Enable,
  web3Accounts,
  web3FromAddress,
} from "@reef-defi/extension-dapp";
import { Provider } from "@reef-chain/evm-provider";
import { WsProvider } from "@polkadot/api";
import { u8aToBn } from "@polkadot/util";

const ReefWalletConnect = () => {
  const { Button, ReefLogo } = Uik;
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  // Function to connect with Reef Wallet and get all accounts
  const connectWallet = async () => {
    // Enable Reef Wallet
    const allInjected = await web3Enable("Reef Wallet Integration");

    // If no extension is found, prompt the user to install it
    if (allInjected.length === 0) {
      alert("Please install the Reef Wallet extension");
      return;
    }

    // Retrieve accounts injected by Reef Wallet
    const accounts = await web3Accounts();
    setAccounts(accounts);

    // If no accounts are found, prompt the user to unlock the wallet
    if (accounts.length === 0) {
      alert("No accounts found. Please unlock your Reef Wallet");
      return;
    }
  };

  // Function to select an account and show its balance
  const selectAccount = async (account) => {
    setSelectedAccount(account);

    const wsProvider = new WsProvider("wss://rpc.reefscan.com/ws");
    const provider = new Provider({ provider: wsProvider });
    await provider.api.isReady;

    // Get the balance of the selected account
    const balance = await provider.api.query.system.account(account.address);
    const freeBalance = u8aToBn(balance.data.free.toU8a()).toString();
    const freeBalanceREEF = (
      parseFloat(freeBalance) / Math.pow(10, 18)
    ).toFixed(4);

    setBalance(freeBalanceREEF);

    // Get the EVM address
    const evmAddress = await provider.api.query.evmAccounts.evmAddresses(
      account.address
    );
    // evmAddress is a Bytes object, convert to hex string
    const evmHex = evmAddress.toHex();
    // You can now display or use evmHex as the EVM address
    console.log("EVM Address:", evmHex);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <button
          onClick={connectWallet}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Connect to Reef Wallet
        </button>
      </div>

      <div className="mb-4 flex justify-center">
        <ReefLogo />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Accounts:</h3>
        {accounts.length > 0 ? (
          <ul className="space-y-2">
            {accounts.map((acc) => (
              <li
                key={acc.address}
                onClick={() => selectAccount(acc)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer transition-colors"
              >
                <span className="text-sm font-mono break-all">
                  {acc.address}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No accounts found.</p>
        )}
      </div>

      {selectedAccount && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Selected Account:</h3>
          <p className="text-sm mb-2">
            <span className="font-semibold">Address:</span>
            <span className="font-mono break-all ml-1">
              {selectedAccount.address}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-semibold">Balance:</span>
            <span className="ml-1 text-green-600 font-bold">
              {balance ? `${balance} REEF` : "Loading..."}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ReefWalletConnect;
