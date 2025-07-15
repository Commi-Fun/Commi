import * as React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import CommiModal from '@/components/CommiModal';
import CommiButton from '@/components/CommiButton';

export default function ConnectWalletButton() {
  const [open, setOpen] = React.useState(false);
  const { select, connect } = useWallet();

  const handleConnect = async (walletName: WalletName) => {
    try {
      select(walletName);
      // The wallet will be automatically connected if autoConnect is true in the provider.
      // If not, you might need to call `await connect();`
      setOpen(false); // Close the modal after selection
    } catch (error) {
      console.error(`Failed to connect to ${walletName}:`, error);
    }
  };

  return (
    <>
      <CommiModal open={open} onClose={() => setOpen(false)} title="Connect a Wallet">
        <CommiButton size="medium" onClick={() => handleConnect('Phantom' as WalletName)}>
          Phantom
        </CommiButton>
      </CommiModal>
      <CommiButton onClick={() => setOpen(true)}>Connect Wallet</CommiButton>
    </>
  );
}
