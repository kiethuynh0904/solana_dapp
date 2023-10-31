// TODO: SignMessage
import { verify } from '@noble/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";
import { TokenStandard, transferV1 } from '@metaplex-foundation/mpl-token-metadata'
import { useUmi } from 'pages/useUmi';
import { base58, createAmount, lamports, publicKey, tokenAmount } from '@metaplex-foundation/umi';

const destination = publicKey('EQNNQrV3seVxJdVrMQZkVpzSTPvLA4FsVs9tyvaqfkeY')
const tokenMint = publicKey('BLeqYoADXebcbhMxr7EipZPBjpnQE7CkudGuMYXpbjfc') // My ticket

const LAMPORT_PER_S3C = 1000

export const TransferToken: FC = () => {
    const { publicKey, signMessage } = useWallet();
    const umi = useUmi()

    const onClick = useCallback(async () => {
        try {
            const confirmResults = await transferV1(umi, {
                mint: tokenMint,
                destinationOwner: destination,
                tokenStandard: TokenStandard.Fungible,
                amount: 10.4 * LAMPORT_PER_S3C,
            }).sendAndConfirm(umi)
            const txid = base58.deserialize(confirmResults.signature)[0];
            notify({ type: 'success', message: 'Token send successful!', txid: txid });
        } catch (error: any) {
            notify({ type: 'error', message: `Token send failed!`, description: error?.message });
            console.log('error', `Token send failed! ${error?.message}`);
        }
    }, [publicKey, notify, signMessage]);

    return (
        <div className="flex flex-row justify-center">
            <div className="relative group items-center">
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <button
                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                    onClick={onClick} disabled={!publicKey}
                >
                    <div className="hidden group-disabled:block">
                        Wallet not connected
                    </div>
                    <span className="block group-disabled:hidden" >
                        Send S3Coin
                    </span>
                </button>
            </div>
        </div>
    );
};
