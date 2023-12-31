import { FC } from 'react';

import { CreateNFTs } from 'components/CreateNFTs';

export const CreateNFTsView: FC = ({ }) => {

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Create NFTs
        </h1>      
        <div style={{height:'100%'}} className="text-center">
          <CreateNFTs />
        </div>
      </div>
    </div>
  );
};