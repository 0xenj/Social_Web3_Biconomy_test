import React, { useState, useEffect, useRef } from "react";
import "@biconomy/web3-auth/dist/src/style.css"
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import SmartAccount from "@biconomy/smart-account";

const Social = () => {
  const [smartAccount, setSmartAccount] = useState(null);
  const [interval, enableInterval] = useState(false);
  const sdkRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    let configureLogin;
    if (interval) {
      configureLogin = setInterval(() => {
        if (sdkRef.current && sdkRef.current.provider) {
          setupSmartAccount();
          clearInterval(configureLogin);
        }
      }, 1000);
    }
  }, [interval]);

  const login = async () => {
      const socialLogin = new SocialLogin();

      const signature1 = await socialLogin.whitelistUrl('https://localhost:3000/');
      await socialLogin.init({
        whitelistUrl: {
            'https://localhost:3000/': signature1,
        }
      });
      socialLogin.showWallet();
    if (!socialLogin?.provider) return;
    const provider = new ethers.providers.Web3Provider(
        socialLogin.provider,
    );
    const accounts = await provider.listAccounts();
    console.log("EOA address", accounts)
    }

  const setupSmartAccount = async () => {
    if (!sdkRef.current || !sdkRef.current.provider) return;
    sdkRef.current.hideWallet();
    setLoading(true);
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    );
    setProvider(web3Provider);
    try {
      const smartAccount = new SmartAccount(web3Provider, {
        activeNetworkId: ChainId.POLYGON_MUMBAI,
        supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
        networkConfig: [
          {
            chainId: ChainId.POLYGON_MUMBAI,
            dappAPIKey: "your dapp api key from biconomy dashboard",
          },
        ],
      });
      await smartAccount.init();
      setSmartAccount(smartAccount);
      setLoading(false);
    } catch (err) {
      console.log("error setting up smart account... ", err);
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await sdkRef.current.logout();
    sdkRef.current.hideWallet();
    setSmartAccount(null);
    enableInterval(false);
  };

  return (
    <div>
        <button className="absolute top-1/2 left-1/2 bg-black text-white rounded-md" onClick={login}>Connect</button>
        <span className="absolute top-1/4 right-1/4 bg-black text-white rounded-md">Connect</span>
    </div>
  );
};

export default Social;
