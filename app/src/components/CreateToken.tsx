import { FC, useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, PublicKey } from "@solana/web3.js";
import {
  TokenStandard,
  createFungible,
  createV1,
  mintV1,
} from "@metaplex-foundation/mpl-token-metadata";

import { useUmi } from "pages/useUmi";
import {
  generateSigner,
  percentAmount,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { notify } from "utils/notifications";

export const CreateToken: FC = () => {
  const wallet = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [metadata, setMetadata] = useState("");
  const [amount, setAmount] = useState(0);
  const [decimals, setDecimals] = useState(9);
  const umi = useUmi();

  const onClick = useCallback(
    async (form) => {
      const mint = generateSigner(umi);
      let builder = transactionBuilder()
        .add(
          createFungible(umi, {
            mint,
            name: form.tokenName,
            uri: form.metadata,
            symbol: form.symbol,
            sellerFeeBasisPoints: percentAmount(0),
            decimals: form.decimals,
          })
        )
        .add(
          mintV1(umi, {
            mint: mint.publicKey,
            amount: form.amount,
            tokenStandard: TokenStandard.Fungible,
          })
        );
      const confirmResult = await builder.sendAndConfirm(umi);
      const stringSignature = new TextDecoder().decode(confirmResult.signature);
      notify({
        type: "success",
        message: "Successfully",
        txid: stringSignature,
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
        type="number"
        value={decimals}
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Decimals(eg 0-9)"
        onChange={(e) => setDecimals(Number(e.target.value))}
      />
      <input
        type="number"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Amount"
        onChange={(e) => setAmount(Number(e.target.value))}
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
            amount: amount,
            decimals: decimals,
          })
        }
      >
        <span>Submit</span>
      </button>
    </div>
  );
};
