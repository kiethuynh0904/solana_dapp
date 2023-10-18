import { FC, useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, PublicKey } from "@solana/web3.js";
import { createFungible } from "@metaplex-foundation/mpl-token-metadata";

import { useUmi } from "pages/useUmi";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { notify } from "utils/notifications";

export const CreateToken: FC = () => {
  const wallet = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [metadata, setMetadata] = useState("");
  const umi = useUmi();

  const onClick = useCallback(
    async (form) => {
      const mint = generateSigner(umi);
      await createFungible(umi, {
        mint,
        name: form.tokenName,
        uri: form.metadata,
        symbol: form.symbol,
        sellerFeeBasisPoints: percentAmount(5.5),
      }).sendAndConfirm(umi);
      notify({
        type: "success",
        message: "Successfully",
        txid: mint.publicKey,
      });
    },
    [umi]
  );

  if (!wallet.connected) {
    return <p>Please connect your wallet to get started.</p>;
  }

  return (
    <div className="my-6">
      <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Token Name"
        onChange={(e) => setTokenName(e.target.value)}
      />
      <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Symbol"
        onChange={(e) => setSymbol(e.target.value)}
      />
      <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Metadata Url"
        onChange={(e) => setMetadata(e.target.value)}
      />
      <button
        className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={() =>
          onClick({
            metadata: metadata,
            symbol: symbol,
            tokenName: tokenName,
          })
        }
      >
        <span>Submit</span>
      </button>
    </div>
  );
};
