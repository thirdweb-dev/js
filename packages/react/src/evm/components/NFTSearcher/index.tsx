import React, { useState, useEffect, useMemo } from 'react';
import getStyles from './styles'
import {
    useNFTs,
    useContract,
} from "@thirdweb-dev/react-core";
import { MediaRenderer } from "../MediaRenderer";


export interface SearchBarProps {
    activeNetwork?: string;
    limit?: number;
    start?: number;
    theme?: string;
    onNFTsFetched?: (nfts: any[]) => void;
    style?: {
        searchBarContainer?: React.CSSProperties;
        selectNetwork?: React.CSSProperties;
        searchBar?: React.CSSProperties;
        searchBarMatic?: React.CSSProperties;
        clearButton?: React.CSSProperties;
        suggestionsContainer?: React.CSSProperties;
        suggestion?: React.CSSProperties;
        suggestionLogo?: React.CSSProperties;
    };
    classNames?: {
        searchBarContainer?: string;
        selectNetwork?: string;
        searchBar?: string;
        searchBarMatic?: string;
        clearButton?: string;
        suggestionsContainer?: string;
        suggestion?: string;
        suggestionLogo?: string;
    };
}

export interface Collection {
    name?: string;
    contract?: string;
    image?: string;
    symbol?: string;
}


export interface Collections {
    [key: string]: Collection[];
}

export const NFTSearcher = ({
    activeNetwork, 
    limit, 
    start,
    theme, 
    onNFTsFetched, 
    style = {
        searchBarContainer: {},
        selectNetwork: {},
        searchBar: {},
        searchBarMatic: {},
        clearButton: {},
        suggestionsContainer: {},
        suggestion: {},
        suggestionLogo: {},
    },
    classNames = {
        searchBarContainer: "",
        selectNetwork: "",
        searchBar: "",
        searchBarMatic: "",
        clearButton: "",
        suggestionsContainer: "",
        suggestion: "",
        suggestionLogo: "",
    }}:SearchBarProps) => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [twContractAddress, setTWContractAddress] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionCache, setCollectionCache] = useState<Collections>({});
  const darkTheme = useMemo(() => theme === 'dark', [theme]);
  const [lastUsedContractAddress, setLastUsedContractAddress] = useState<string>('');
  onNFTsFetched = onNFTsFetched || (() => {});
  const styles = getStyles(darkTheme);

  const darkMode = useMemo(() => ({
    searchBarContainer: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.searchBarContainer,
    },
    searchBar: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.searchBar,
    },
    searchBarMatic: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.searchBarMatic,
    },
    suggestionsContainer: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.suggestionsContainer,
    },
    suggestionLogo: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.suggestionLogo,
    },
 }), [darkTheme, style]);

 const network = useMemo(() => {
    return activeNetwork || 'ethereum';
}, [activeNetwork]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        setContractAddress(search);
        setShowSuggestions(search !== '');
    };
    
    const handleClearSearch = () => {
        setContractAddress('');
        setShowSuggestions(false);
    };
    
    const { contract } = useContract(twContractAddress);
    const {data: nfts} = useNFTs(contract,{
        count: limit,
        start: start,
    });

    useEffect(() => {
        if (nfts && nfts.length > 0 && onNFTsFetched) {
            onNFTsFetched(nfts);
            setIsProcessing(false);
        } else {
            setIsProcessing(false);
            console.log('No NFTs found');
        }
        setShowSuggestions(false);
    }, [nfts, onNFTsFetched]);

    const handleSuggestionClick = (search: string) => {
        console.log('Setting last used contract address...');
        setLastUsedContractAddress(search);
        setTWContractAddress(search || lastUsedContractAddress);
        setIsProcessing(true);
        setContractAddress('');
        setShowSuggestions(false);
    };
    
    
    useEffect(() => {
        const fetchCollections = async () => {
            // Check cache first
            const cache = collectionCache[network];
            if (cache) {
            setCollections((prevCollections) => [
                ...prevCollections,
                ...(Array.isArray(cache) ? cache : []),
            ]);
            return;
            }

            try {
                let url;
                switch (network) {
                    case "ethereum":
                        url = "https://lib.locatia.app/eth-directory/twdirectory.json";
                        break;
                    case "polygon":
                        url = "https://lib.locatia.app/poly-directory/twdirectory.json";
                        break;
                    case "fantom":
                        url = "https://lib.locatia.app/ftm-directory/twdirectory.json";
                        break;
                    case "avalanche":
                        url = "https://lib.locatia.app/avax-directory/twdirectory.json";
                        break;
                    case "frame-testnet":
                        url = "https://lib.locatia.app/frame-testnet/twdirectory.json";
                        break;
                    default:
                        url = "https://lib.locatia.app/eth-directory/twdirectory.json";
                }
        
                const response = await fetch(url);
                if (!response.ok) {
                    console.log('Error: URL returned no content');
                } else {
                    const data = await response.json();
                    if (data === null || data === undefined) {
                        console.log('Error: Invalid JSON data received from server');
                    } else {
                        setCollections(data);
                        setCollectionCache({ ...collectionCache, [network]: data });
                    }
                }
            } catch (error) {
                console.error(`Suggestions: ${error}`);
            }
        };
        fetchCollections();
   
    }, [network, collectionCache]);

    
  return (
    <div className={styles.searchContainer}>
        <div className={`${styles.searchBarContainer} ${classNames.searchBarContainer || ""}`} 
        style={style.searchBarContainer && darkMode ? darkMode.searchBarContainer : style.searchBarContainer}>
            {network === "ethereum" ? (
                <MediaRenderer 
                    className={styles.networkImage}
                    src="https://bafybeie3c5fcqjhrfma6wljpwzzldpsttu2lonutagoxwikeslersqzdwe.ipfs.dweb.link/eth.png"
                    alt="ethereum"
                    width={"30px"} 
                    height={"30px"}
                />
            ) : network === "polygon" ? (
                <MediaRenderer 
                    className={styles.networkImage}
                    src="https://bafybeigzgztdmt3qdt52wuhyrrvpqp5qt4t2uja23wmfhsccqt332ek7da.ipfs.dweb.link/polygon/512.png"
                    alt="polygon"
                    width={"30px"} 
                    height={"30px"}
                />
            ) : network === "fantom" ? (
                <MediaRenderer 
                    className={styles.networkImage}
                    src="https://bafybeigzgztdmt3qdt52wuhyrrvpqp5qt4t2uja23wmfhsccqt332ek7da.ipfs.dweb.link/fantom/512.png"
                    alt="fantom"
                    width={"30px"} 
                    height={"30px"}
                />
            ) : network === "avalanche" ? (
                <MediaRenderer 
                    className={styles.networkImage}
                    src="https://bafybeigzgztdmt3qdt52wuhyrrvpqp5qt4t2uja23wmfhsccqt332ek7da.ipfs.dweb.link/avalanche/512.png"
                    alt="avalanche"
                    width={"30px"} 
                    height={"30px"}
                />
             ) : network === "frame-testnet" ? (
                    <MediaRenderer 
                        className={styles.networkImage}
                        src="https://5830d53ec6e6754ea216cead1b68e681.ipfscdn.io/ipfs/bafybeibvzodeiunfwwkffke35wcrgup2gcc6rn4izzt3u74xcstf74k3o4/"
                        alt="frametestnet"
                        width={"30px"} 
                        height={"30px"}
                        style={{borderRadius: "50%"}}
                    />
            ) : (
                <MediaRenderer 
                    className={styles.networkImage}
                    src="https://bafybeie3c5fcqjhrfma6wljpwzzldpsttu2lonutagoxwikeslersqzdwe.ipfs.dweb.link/eth.png"
                    alt="ethereum"
                    width={"30px"} 
                    height={"30px"}
                />
            )    
            }
            <input
                style={style.searchBar && darkMode ? darkMode.searchBar : style.searchBar}
                className={`${styles.searchBar} ${styles.searchBar || ""}`}
                type="text"
                value={contractAddress}
                placeholder={isProcessing ? "searching..." : "Name/Contract Address"}
                onChange={handleInputChange}
                onKeyPress={event => {
                    if (event.key === 'Enter' && contractAddress) {
                        handleSuggestionClick(contractAddress);
                        };
                    }}
                disabled={isProcessing}
            />
            {contractAddress && (
            <button 
                style={style.clearButton}
                className={`${styles.clearButton} ${classNames.clearButton || ""}`} 
                onClick={handleClearSearch} 
                aria-label="Clear search"
            >
                X
            </button>
            )}
        </div>
        {showSuggestions && (
        <div
            style={style.suggestionsContainer && darkMode ? darkMode.suggestionsContainer : style.suggestionsContainer}
            className={`${styles.suggestionsContainer} ${classNames.suggestionsContainer || ""} `}
        >
            {collections && collections.length > 0 ? 
                collections
                .filter((collection) =>
                {return collection.name && collection.name.toLowerCase().includes(contractAddress.toLowerCase())}
                )
                .slice(0, 6)
                .map((collection, index) => (
                    <div
                        key={index}
                        style={style.suggestion}
                        className={`${styles.suggestion} ${classNames.suggestion || ""}`}
                        onClick={() => {
                            if (collection.contract){
                            handleSuggestionClick(collection.contract);
                            }
                        }}
                    >
                        <MediaRenderer 
                            src={collection.image} 
                            alt={collection.contract}
                            style={style.suggestionLogo}
                            className={`${styles.suggestionLogo} ${classNames.suggestionLogo || ""}`} 
                            width={"20px"} 
                            height={"20px"}
                        />
                        <span>{collection.name}</span>
                    </div>
                ))
            :
                <div
                    style={style.suggestion}
                    className={`${styles.suggestion} ${classNames.suggestion || ""}`}
                >
                    <span>{'No Collection Found'}</span>
                </div>
            }
        </div>
        )}
    </div>
  );
};
