import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css"
import { ethers } from "ethers";

function Social() {

    const SocialConnect = async () => {

    const socialLogin = new SocialLogin();
    
    await socialLogin.init();

    socialLogin.showWallet();

    if (!socialLogin?.provider) return;
    const provider = new ethers.providers.Web3Provider(
        socialLogin.provider,
    );
    const accounts = await provider.listAccounts();
    console.log("EOA address", accounts)
    }

    return (
        <div>
            <button className="absolute top-1/2 left-1/2 bg-black text-white rounded-md w-24 h-24" onClick={SocialConnect}>Social Connect</button>
        </div>
    );
}
  
export default Social;