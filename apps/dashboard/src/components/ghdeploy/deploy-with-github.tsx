import { Divider, Input, Select } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Button } from 'tw-components';

export const DeployWithGithub = () => {
  const [repoLink, setRepoLink] = useState('');
  const [contracts, setContracts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [framework, setFramework] = useState<string>('Select framework');

  const handleFetchContracts = async () => {
    try {
        setLoading(true);
        setContracts([]);
        setError(null);
        const contracts = await fetchSmartContracts();
        console.log(contracts);
        setContracts(contracts);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
  };

  const fetchSmartContracts = async () => {
    const res = await fetch("https://remote-compiler-server-hxa9.chainsaw-dev.zeet.app/compile",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({repoUrl: repoLink, framework})
        }
    )

    if(res.ok) {
      const { compiledContracts } = await res.json();
      return compiledContracts.contracts as any[];
    } else {
      const err = await res.json();
      throw new Error(err.message);
    }
  };

  const handleCompileContract = async (contract: any) => {
    try {
      setLoading(true);
      await uploadContracts(contract);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const uploadContracts = async (contract: any) => {
    const res = await fetch("https://remote-compiler-server-hxa9.chainsaw-dev.zeet.app/upload-compiled-contract",
      {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({contract})
      }
    )
    const { publishUri } = await res.json();
    console.log("publish uri: ", publishUri);
    
    const url = new URL(
      "https://thirdweb.com" +
      `/contracts/deploy/` +
      encodeURIComponent(publishUri.replace("ipfs://", "")),
    );
    window.open(url);
  };

  return (
    <div>
      <Input 
        type="text" 
        placeholder="Enter GitHub repository link" 
        value={repoLink} 
        onChange={(e) => setRepoLink(e.target.value)} 
        mb={5}
      />
      <Select 
        placeholder="Select framework" 
        value={framework} 
        onChange={(e) => setFramework(e.target.value)} 
        mb={5}
      >
        <option value="forge">Forge</option>
        <option value="hardhat">Hardhat</option>
        <option value="zk-hardhat">zk-Hardhat</option>
      </Select>
      <br/>
      <Button onClick={handleFetchContracts} mb={10} background="purple">Compile Contracts</Button>
      <Divider/>
      {loading && <p>Loading contracts...</p>}
      <ul>
        {contracts.map((contract: any) => (
          <li key={contract.name}>
            <Button onClick={() => handleCompileContract(contract)} mb={4}>{contract.name}</Button>
          </li>
        ))}
      </ul>
      {error && (
        <div>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
