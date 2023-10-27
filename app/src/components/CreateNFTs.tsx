import { FC, FormEvent, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";

import { useUmi } from "pages/useUmi";
import {
  PublicKey,
  base58PublicKey,
  createGenericFileFromBrowserFile,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import { notify } from "utils/notifications";
import { base58 } from "@metaplex-foundation/umi/serializers";

import styles from "../styles/CreateNFTs.module.css";

export const CreateNFTs: FC = () => {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [mintCreated, setMintCreated] = useState<PublicKey | null>(null);

  const umi = useUmi();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData) as {
      name: string;
      image: File;
      description: string;
    };
    const name = data.name;
    const file = data.image;
    const description = data.description;

    try {
      if (!name) {
        throw new Error("Please enter a name for your NFT.");
      }
      if (!file || file.size === 0) {
        throw new Error("Please select an image for your NFT.");
      }
      const imageFile = await createGenericFileFromBrowserFile(file);

      const [imageUri] = await umi.uploader.upload([imageFile]);
      const uri = await umi.uploader.uploadJson({
        name,
        description: description,
        image: imageUri,
      });

      const mint = generateSigner(umi);
      const sellerFeeBasisPoints = percentAmount(5.5, 2);
      const confirmResult = await createNft(umi, {
        mint,
        name,
        uri,
        sellerFeeBasisPoints,
      }).sendAndConfirm(umi);
      setMintCreated(mint.publicKey);
      const txid = base58.deserialize(confirmResult.signature)[0];
      notify({
        type: "success",
        message: "Successfully",
        txid: txid,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!wallet.connected) {
    return <p>Please connect your wallet to get started.</p>;
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="192"
          height="192"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <rect width="256" height="256" fill="none"></rect>
          <path
            d="M168,40.7a96,96,0,1,1-80,0"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></path>
        </svg>
        <p>Creating the NFT...</p>
      </div>
    );
  }

  if (mintCreated) {
    return (
      <a
        className={styles.success}
        target="_blank"
        href={
          "https://solscan.io/address/" +
          base58PublicKey(mintCreated) +
          "?cluster=devnet"
        }
        rel="noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="192"
          height="192"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <rect width="256" height="256" fill="none"></rect>
          <polyline
            points="172 104 113.3 160 84 132"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></polyline>
          <circle
            cx="128"
            cy="128"
            r="96"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></circle>
        </svg>
        <div>
          <p>
            <strong>NFT Created</strong> at the following address
          </p>
          <p>
            <code>{base58PublicKey(mintCreated)}</code>
          </p>
        </div>
      </a>
    );
  }

  return (
    <form method="post" onSubmit={onSubmit} className="my-6">
      <input
        name="name"
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Token Name"
      />
      <input
        name="image"
        type="file"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Decimals(eg 0-9)"
      />
      <input
        name="description"
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Description"
      />
      <button
        type="submit"
        className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
      >
        <span>Submit</span>
      </button>
    </form>
  );
};
