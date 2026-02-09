import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { FaCopy, FaCheck } from "react-icons/fa";
import accountimage from "../../assets/accountimage.png";
import { FiChevronDown } from "react-icons/fi";
import Reeficon from "../../assets/reef-icon-48.png";
import {
  web3Enable,
  web3Accounts,
  web3FromAddress,
} from "@reef-defi/extension-dapp";
import { Provider } from "@reef-chain/evm-provider";
import { WsProvider } from "@polkadot/api";
import { u8aToBn } from "@polkadot/util";
import { useAuth } from "../../contexts/AuthContext";
import { useRef } from "react";
import DotSpinner from "../common/DotSpinner";

export default function SettingsPopup({ isOpen, onClose }) {
  const [selectedNetwork, setSelectedNetwork] = useState("Mainnet");
  const [isButtonOpen, setIsButton] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [accountBalances, setAccountBalances] = useState({});
  const { selectedAccount, setSelectedAccount } = useAuth();
  const [evmAddresses, setEvmAddresses] = useState({});
  const [loading, setLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [walletError, setWalletError] = useState(null);
  const modalScrollRef = useRef(null);

  const toggleDropdown = () => {
    setIsButton(!isButtonOpen);
  };

  // Function to connect with Reef Wallet and get all accounts
  const connectWallet = async () => {
    setLoading(true);
    setWalletError(null);
    try {
      const allInjected = await web3Enable("Reef Wallet Integration");
      // console.log(
      //   "🚀 ~ connectWallet ~ allInjected: line nmber 38",
      //   allInjected
      // );
      if (allInjected.length === 0) {
        setWalletError("extension_not_installed");
        setLoading(false);
        return;
      }
      const walletAccounts = await web3Accounts();
      console.log("🚀 ~ connectWallet ~ walletAccounts:", walletAccounts);
      if (walletAccounts.length === 0) {
        setWalletError("no_accounts");
        setLoading(false);
        return;
      }
      setAccounts(walletAccounts);
      await fetchAccountDetails(walletAccounts);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setWalletError("connection_failed");
    }
    setLoading(false);
  };

  // Function to fetch balance and EVM address for all accounts
  // const fetchAccountDetails = async (accounts) => {
  //   const wsProvider = new WsProvider("wss://rpc.reefscan.com/ws");
  //   const provider = new Provider({ provider: wsProvider });
  //   await provider.api.isReady;

  //   const balances = {};
  //   const evmAddrs = {};

  //   for (const account of accounts) {
  //     try {
  //       const balance = await provider.api.query.system.account(
  //         account.address
  //       );
  //       const freeBalance = u8aToBn(balance.data.free.toU8a()).toString();
  //       const freeBalanceREEF = (
  //         parseFloat(freeBalance) / Math.pow(10, 18)
  //       ).toFixed(4);
  //       balances[account.address] = freeBalanceREEF;
  //       const evmAddress = await provider.api.query.evmAccounts.evmAddresses(
  //         account.address
  //       );
  //       const evmHex = evmAddress.toHex();
  //       evmAddrs[account.address] = evmHex;
  //     } catch (error) {
  //       console.error(`Error fetching details for ${account.address}:`, error);
  //       balances[account.address] = "0.0000";
  //       evmAddrs[account.address] = "";
  //     }
  //   }

  //   setAccountBalances(balances);
  //   setEvmAddresses(evmAddrs);
  // };

  // performance optimization
  // Function to fetch balance and EVM address for all accounts
  // const fetchAccountDetails = async (accounts) => {
  //   const wsProvider = new WsProvider("wss://rpc.reefscan.com/ws");
  //   const provider = new Provider({ provider: wsProvider });
  //   await provider.api.isReady;

  //   const balances = {};
  //   const evmAddrs = {};

  //   // Helper function to add timeout to a promise
  //   const withTimeout = (promise, ms = 5000) => {
  //     return Promise.race([
  //       promise,
  //       new Promise((_, reject) =>
  //         setTimeout(() => reject(new Error("Request timed out")), ms)
  //       ),
  //     ]);
  //   };

  //   try {
  //     // Fetch all balances and EVM addresses in parallel
  //     const accountQueries = accounts.map(async (account) => {
  //       try {
  //         // Fetch balance
  //         const balancePromise = provider.api.query.system.account(
  //           account.address
  //         );
  //         const balance = await withTimeout(balancePromise, 7000); // 5-second timeout
  //         const freeBalance = u8aToBn(balance.data.free.toU8a()).toString();
  //         const freeBalanceREEF = (
  //           parseFloat(freeBalance) / Math.pow(10, 18)
  //         ).toFixed(4);
  //         balances[account.address] = freeBalanceREEF;

  //         // Fetch EVM address
  //         const evmAddressPromise = provider.api.query.evmAccounts.evmAddresses(
  //           account.address
  //         );
  //         const evmAddress = await withTimeout(evmAddressPromise, 7000); // 7-second timeout
  //         const evmHex = evmAddress.toHex();
  //         evmAddrs[account.address] = evmHex;
  //       } catch (error) {
  //         console.error(
  //           `Error fetching details for ${account.address}:`,
  //           error
  //         );
  //         balances[account.address] = "0.0000";
  //         evmAddrs[account.address] = "";
  //       }
  //     });

  //     // Execute all queries concurrently
  //     await Promise.all(accountQueries);
  //   } catch (error) {
  //     console.error("Error in fetchAccountDetails:", error);
  //   } finally {
  //     // Disconnect the provider to free resources
  //     await provider.api.disconnect();
  //   }

  //   setAccountBalances(balances);
  //   setEvmAddresses(evmAddrs);
  // };
  // GraphQL endpoint for Reef mainnet
  const GRAPHQL_ENDPOINT = "https://squid.subsquid.io/reef-explorer/graphql";

  // GraphQL query to get account info
  const ACCOUNT_QUERY = `
  query GetAccount($accountId: String!) {
    accounts(where: {id_eq: $accountId}) {
      id
      freeBalance
      evmAddress
    }
  }
`;

  // Function to fetch account details using GraphQL
  const fetchAccountDetails = async (accounts) => {
    const balances = {};
    const evmAddrs = {};

    // Fetch all accounts concurrently
    const fetchPromises = accounts.map(async (account) => {
      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: ACCOUNT_QUERY,
            variables: {
              accountId: account.address,
            },
          }),
        });

        const result = await response.json();
        console.log("🚀 ~ fetchAccountDetails ~ result:", result);

        if (
          result.data &&
          result.data.accounts &&
          result.data.accounts.length > 0
        ) {
          const accountData = result.data.accounts[0];

          // Convert balance from raw to REEF
          const freeBalanceREEF = accountData.freeBalance
            ? (parseFloat(accountData.freeBalance) / Math.pow(10, 18)).toFixed(
                4
              )
            : "0.0000";

          balances[account.address] = freeBalanceREEF;
          evmAddrs[account.address] = accountData.evmAddress || "";
        } else {
          // Account not found in GraphQL (might be new)
          balances[account.address] = "0.0000";
          evmAddrs[account.address] = "";
        }
      } catch (error) {
        console.error(`Error fetching ${account.address}:`, error);
        balances[account.address] = "0.0000";
        evmAddrs[account.address] = "";
      }
    });

    // Wait for all fetches to complete
    await Promise.all(fetchPromises);

    setAccountBalances(balances);
    setEvmAddresses(evmAddrs);
  };
  // Function to copy address to clipboard
  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  // Function to truncate address
  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  // Function to select an account
  const selectAccount = (account) => {
    const mergedAccount = {
      ...account,
      balance: accountBalances[account.address] || "0.0000",
      evmAddress: evmAddresses[account.address] || "",
    };
    setSelectedAccount(mergedAccount);
    onClose();
  };

  // Toggle body overflow to hide scrollbar when popup is open on large screens
  useEffect(() => {
    if (isOpen) {
      // Apply overflow-hidden only on md and larger screens
      if (window.innerWidth >= 768) {
        document.body.classList.add("overflow-hidden");
      }
      if (accounts.length === 0) {
        connectWallet();
      }
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);
  // Always scroll modal to top when opened
  useEffect(() => {
    if (isOpen && modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-[2000ms] ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-transparent transition-opacity duration-[2000ms] ease-in-out ${
          isOpen ? "bg-opacity-50" : "bg-opacity-0"
        }`}
        onClick={onClose}
      ></div>
      <div
        ref={modalScrollRef}
        className={`relative w-full h-full bg-[#EEEBF6] shadow-xl transform transition-all duration-[1800ms] ease-in-out overflow-y-auto ${
          isOpen
            ? "translate-y-0 scale-y-100 opacity-100"
            : "-translate-y-full scale-y-0 opacity-0"
        }`}
        style={{
          transformOrigin: "top center",
        }}
      >
        <div className="mx-auto max-w-[90%] sm:max-w-[80%] md:max-w-[60%] pt-8 sm:pt-12 md:pt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8">
            <div className="relative w-full sm:w-auto">
              <div
                className="flex items-center justify-center gap-1 text-white py-2 px-3 sm:py-3 sm:px-4 rounded-2xl bg-gradient-to-br from-[#ae27a5] to-[#742cb2] shadow-[0_5px_20px_-10px_#742cb2] cursor-pointer"
                // onClick={toggleDropdown}
              >
                {/* <FiChevronDown className="w-5 h-5" /> */}
                <button className="font-medium text-sm sm:text-base cursor-pointer">
                  browser-extension
                </button>
                <img src={Reeficon} className="w-5 h-5 sm:w-6 sm:h-6" alt="" />
              </div>

              {isButtonOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 sm:w-84 bg-white shadow-xl rounded-lg py-2 z-[60]">
                  <div className="flex items-center justify-start gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    <img
                      src={Reeficon}
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      alt=""
                    />
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-medium text-base sm:text-lg text-[#ae27a5]">
                        Browser Extension
                      </span>
                      <div className="bg-green-100 rounded-2xl">
                        <span className="text-green-500 px-3 py-1 text-sm">
                          Selected
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-start px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    <span className="text-base sm:text-lg text-[#742cb2]">
                      Mobile App
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full sm:w-auto">
              {/* Network Toggle */}
              <div className="flex items-center w-full sm:w-44 h-10 sm:h-12 justify-between px-2 sm:px-3 bg-[#EEEBF6] border-2 border-[#EEEBF6] rounded-lg shadow-[0_5px_10px_0_rgba(0,0,0,0.1)] p-1">
                <button
                  onClick={() => setSelectedNetwork("Mainnet")}
                  className={`w-[100%] h-[80%] cursor-pointer rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedNetwork === "Mainnet"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Mainnet
                </button>
                {/* <button
                  onClick={() => setSelectedNetwork("Testnet")}
                  className={`w-[50%] h-[80%] cursor-pointer rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedNetwork === "Testnet"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Testnet
                </button> */}
              </div>
              <div className="bg-[#EEEBF6] border-4 border-[#EEEBF6] shadow-2xl w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center">
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-black cursor-pointer transition-colors duration-500"
                >
                  <HiX className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500 hover:text-[#A93185]" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center flex-col gap-4 sm:gap-6 mt-8 sm:mt-12 md:mt-16">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <DotSpinner />
              </div>
            ) : walletError ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 max-w-md">
                {walletError === "extension_not_installed" ? (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        Reef Wallet Extension Not Found
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Install Browser Extension and refresh the page.
                      </p>
                    </div>
                    <a
                      href="https://chrome.google.com/webstore/detail/reef-wallet/mjgkpalnahacmhkikiommfiomhjipgjn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white py-3 px-6 rounded-2xl bg-gradient-to-br from-[#ae27a5] to-[#742cb2] shadow-[0_5px_20px_-10px_#742cb2] font-medium text-sm sm:text-base hover:from-[#742cb2] hover:to-[#ae27a5] transition-all duration-200"
                    >
                      Install Reef Wallet Extension
                    </a>
                  </>
                ) : walletError === "no_accounts" ? (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        No Accounts Found
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Please unlock your Reef Wallet and create or import an
                        account
                      </p>
                    </div>
                    <button
                      onClick={connectWallet}
                      className="text-white py-2 cursor-pointer h-12 w-48 px-6 sm:py-3 sm:px-6 rounded-2xl bg-gradient-to-br from-[#ae27a5] to-[#742cb2] shadow-[0_5px_20px_-10px_#742cb2] font-medium text-sm sm:text-base"
                    >
                      Try Again
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        Connection Failed
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Failed to connect to Reef Wallet. Please try again.
                      </p>
                    </div>
                    <button
                      onClick={connectWallet}
                      className="text-white py-2 cursor-pointer h-12 w-48 px-6 sm:py-3 sm:px-6 rounded-2xl bg-gradient-to-br from-[#ae27a5] to-[#742cb2] shadow-[0_5px_20px_-10px_#742cb2] font-medium text-sm sm:text-base"
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>
            ) : accounts.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <button
                  onClick={connectWallet}
                  className="text-white py-2 h-12 w-48 px-6 sm:py-3 sm:px-6 rounded-2xl bg-gradient-to-br from-[#ae27a5] to-[#742cb2] shadow-[0_5px_20px_-10px_#742cb2] font-medium text-sm sm:text-base"
                >
                  Connect Reef Wallet
                </button>
              </div>
            ) : (
              accounts.map((account, index) => (
                <div
                  key={account.address}
                  className="w-full h-auto rounded-2xl shadow-2xl bg-[#EEEBF6] border-2 border-[#EEEBF6] p-4 sm:p-6 mb-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-3 sm:gap-5">
                      <div>
                        <img
                          src={accountimage}
                          className="w-12 h-12 sm:w-16 sm:h-16"
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col gap-1 sm:gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-[#000000]">
                          {account.meta?.name || `Account ${index + 1}`}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                          <h4>Native address</h4>
                          <h4>{truncateAddress(account.address)}</h4>
                          <button
                            className="cursor-pointer"
                            onClick={() => copyToClipboard(account.address)}
                          >
                            {copiedAddress === account.address ? (
                              <FaCheck className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <FaCopy className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>
                        <div className="flex gap-2 text-gray-500 text-xs sm:text-sm">
                          <span>
                            Balance:{" "}
                            {accountBalances[account.address] || "0.0000"} REEF
                          </span>
                        </div>
                        <a
                          href={`https://reefscan.com/account/${account.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#A93185] text-xs sm:text-sm"
                        >
                          Open in Explorer
                        </a>
                      </div>
                    </div>
                    <div
                      className={`text-white py-2 px-3 sm:py-3 sm:px-4 rounded-2xl shadow-[0_5px_20px_-10px_#742cb2] cursor-pointer text-sm sm:text-base ${
                        selectedAccount?.address === account.address
                          ? "bg-gradient-to-br from-green-500 to-green-600"
                          : "bg-gradient-to-br from-[#ae27a5] to-[#742cb2]"
                      }`}
                    >
                      <button
                        className="font-medium cursor-pointer"
                        onClick={() => selectAccount(account)}
                      >
                        {selectedAccount?.address === account.address
                          ? "Selected"
                          : "Select"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
