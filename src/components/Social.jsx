import React, { useState, useEffect, useRef } from 'react';
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { ethers } from 'ethers';
import SmartAccount from "@biconomy/smart-account";
import "@biconomy/web3-auth/dist/src/style.css"
import CircularProgress from '@mui/material/CircularProgress';

export default function Social() {
  const [smartAccount, setSmartAccount] = useState(null);
  const [interval, enableInterval] = useState(false);
  const sdkRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    let configureLogin;
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount();
          clearInterval(configureLogin);
        }
      }, 1000);
    }
  }, [interval]);

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin();
    //   const signature1 = await socialLoginSDK.whitelistUrl('http://localhost:3000');
      await socialLoginSDK.init();
      sdkRef.current = socialLoginSDK;
    }
    if (!sdkRef.current.provider) {
      sdkRef.current.showWallet();
      enableInterval(true);
    } else {
      setupSmartAccount();
    }
  }

  async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return;
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
            dappAPIKey: "_TEfd0tVk.32daf94b-abde-44f5-b735-a3994da09c8d",
          },
        ],
      });
      await smartAccount.init();
      setSmartAccount(smartAccount);
      setLoading(false);
    } catch (err) {
      console.log('error setting up smart account... ', err);
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error('Web3Modal not initialized.');
      return;
    }
    await sdkRef.current.logout();
    sdkRef.current.hideWallet();
    setSmartAccount(null);
    enableInterval(false);
  };

  return (
    <div>
      {
        !smartAccount && !loading && <button className='fixed top-6 right-10 bg-slate-700 rounded-md text-white font-bold hover:bg-slate-500 w-20 h-8' onClick={login}>Login</button>
      }
      {
        loading && <CircularProgress />
      }
      {
        !!smartAccount && (
          <div>
            <h3 className='fixed top-16 right-10 font-semibold'>Smart account address:</h3>
            <p className='fixed top-20 right-10 text-base'>{smartAccount.address}</p>
            <button className='fixed top-6 right-10 bg-slate-700 rounded-md text-white font-bold hover:bg-slate-500 w-20 h-8'onClick={logout}>Logout</button>
          </div>
        )
      }
    </div>
  );
}