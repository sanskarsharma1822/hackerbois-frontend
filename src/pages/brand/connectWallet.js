import { ConnectButton } from "web3uikit";
import { useMoralis } from "react-moralis";

// let connected = false;
// let acc = "0x726fA710e16d31b0Db81741fc1e97b70234a779a";

function ConnectWallet() {
  // console.log("connectWallet");
  const { isWeb3Enabled, account } = useMoralis();
  // connected = isWeb3Enabled;
  // acc = account;
  return (
    <div>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
// export { connected, acc };
export default ConnectWallet;
