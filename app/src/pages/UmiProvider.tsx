import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { nftStorageUploader } from "@metaplex-foundation/umi-uploader-nft-storage";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { useWallet } from "@solana/wallet-adapter-react";
import { ReactNode } from "react";
import { UmiContext } from "./useUmi";

export const UmiProvider = ({
  endpoint,
  children,
}: {
  endpoint: string;
  children: ReactNode;
}) => {
  const wallet = useWallet();
  const umi = createUmi(endpoint)
    .use(walletAdapterIdentity(wallet))
    .use(
      nftStorageUploader({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFlNjE4MDkxOTJCOTI1MTNmMDI4MGIwMmUxZEQ1NEMxQmRhMGYyYWIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5ODM5NjQ5OTI3NCwibmFtZSI6ImtpZXQuaHV5bmgifQ._8wmrgZSnEchFIJAkOd3m1rEXQ6NRLOx-MUghM4Uw_g",
      })
    )
    .use(mplTokenMetadata());

  return <UmiContext.Provider value={{ umi }}>{children}</UmiContext.Provider>;
};
