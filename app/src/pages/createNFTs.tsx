import type { NextPage } from "next";
import Head from "next/head";
import { CreateNFTsView } from "views/createNFTs";

const Create: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <CreateNFTsView />
    </div>
  );
};

export default Create;
