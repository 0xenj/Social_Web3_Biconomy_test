import React, { useState, useEffect, useRef } from "react";
import "@biconomy/web3-auth/dist/src/style.css"
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import SmartAccount from "@biconomy/smart-account";

const Social = () => {

    const isConnected = async () => {
        
    }

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

    let options = {
        activeNetworkId: ChainId.POLYGON_MUMBAI,
        supportedNetworksIds: [ChainId.GOERLI, ChainId.POLYGON_MAINNET, ChainId.POLYGON_MUMBAI],
        networkConfig: {
            chainId: ChainId.POLYGON_MUMBAI,
            dappAPIKey: "_TEfd0tVk.32daf94b-abde-44f5-b735-a3994da09c8d",
        }
    }

    let smartAccount = new SmartAccount(provider, options);
    smartAccount = await smartAccount.init();
}

  return (
    <div>
        <button className="absolute top-1/2 left-1/2 bg-black text-white rounded-md" onClick={login}>Connect</button>
        <span className="absolute top-1/4 right-1/4 bg-black text-white rounded-md">{isConnected}</span>
    </div>
  );
};

export default Social;
