---
title: CreateWeb3Dapp
author: T8840
date: '2023-02-15'
---

本文涉及的demo详见[Github](https://github.com/T8840/dapp/tree/create-web3-dapp)

## 安装并按照指引操作生成项目
- npx create-web3-dapp@latest
- 配置下
```sh
1. Add your private key in the .env file inside the backend folder
2. To start the application, run: cd my-create-web3-dapp/frontend && npm run dev
```
- 打开浏览器查看  
http://localhost:3000
- 文档参考
[Docs](https://docs.alchemy.com/docs/create-web3-dapp-quickstart)


## 配置修改


## 增加组件
### NFT-NftGallery组件使用
1. Step 1: Create files
    1. In /components create nftsGallery.jsx
    ```jsx
    import styles from "../styles/NftGallery.module.css";
    import { useEffect, useState } from "react";
    import { useAccount } from "wagmi";

    export default function NftGallery({
    walletAddress,
    collectionAddress,
    chain,
    pageSize,
    }) {
    const [nfts, setNfts] = useState();
    const [isLoading, setIsloading] = useState(false);
    const { address, isConnected, isDisconnected } = useAccount();
    const [pageKey, setPageKey] = useState();
    const [excludeFilter, setExcludeFilter] = useState(true);

    const fetchNfts = () => {
        if (collectionAddress) {
        getNftsForCollection();
        } else if (walletAddress || address) {
        getNftsForOwner();
        }
    };
    const getNftsForOwner = async () => {
        setIsloading(true);
        if (isConnected || walletAddress) {
        try {
            const res = await fetch("/api/getNftsForOwner", {
            method: "POST",
            body: JSON.stringify({
                address: walletAddress ? walletAddress : address,
                pageSize: pageSize,
                chain: chain,
                pageKey: pageKey ? pageKey : null,
                excludeFilter: excludeFilter,
            }),
            }).then((res) => res.json());
            console.log(res);

            setNfts(res.nfts);
            if (res.pageKey) setPageKey(res.pageKey);
        } catch (e) {
            console.log(e);
        }
        }

        setIsloading(false);
    };

    const getNftsForCollection = async () => {
        setIsloading(true);

        if (collectionAddress) {
        try {
            const res = await fetch("/api/getNftsForCollection", {
            method: "POST",
            body: JSON.stringify({
                address: collectionAddress ? collectionAddress : address,
                pageSize: pageSize,
                chain: chain,
                pageKey: pageKey ? pageKey : null,
                excludeFilter: excludeFilter,
            }),
            }).then((res) => res.json());

            setNfts(res.nfts);
            if (res.pageKey) setPageKey(res.pageKey);
        } catch (e) {
            console.log(e);
        }
        }

        setIsloading(false);
    };

    useEffect(() => {
        fetchNfts();
    }, []);

    if (isDisconnected) return <p>Loading...</p>;

    return (
        <div className={styles.nft_gallery_page_container}>
        <div className={styles.nft_gallery}>
            <div className={styles.nfts_display}>
            {isLoading ? (
                <p>Loading...</p>
            ) : nfts?.length ? (
                nfts.map((nft) => {
                return <NftCard key={nft.tokenId} nft={nft} />;
                })
            ) : (
                <p>No NFTs found for the selected address</p>
            )}
            </div>
        </div>

        {pageKey && (
            <div className={styles.button_container}>
            <a
                className={styles.button_black}
                onClick={() => {
                fetchNFTs(pageKey);
                }}
            >
                Load more
            </a>
            </div>
        )}
        </div>
    );
    }

    function NftCard({ nft }) {
    return (
        <div className={styles.card_container}>
        <div className={styles.image_container}>
            <img src={nft.media}></img>
        </div>
        <div className={styles.info_container}>
            <div className={styles.title_container}>
            <h3>
                {nft.title.length > 20
                ? `${nft.title.substring(0, 15)}...`
                : nft.title}
            </h3>
            </div>
            <hr className={styles.separator} />
            <div className={styles.symbol_contract_container}>
            <div className={styles.symbol_container}>
                <p>
                {nft.collectionName && nft.collectionName.length > 20
                    ? `${nft.collectionName.substring(0, 20)}`
                    : nft.collectionName}
                </p>

                {nft.verified == "verified" ? (
                <img
                    src={
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/2048px-Twitter_Verified_Badge.svg.png"
                    }
                    width="20px"
                    height="20px"
                />
                ) : null}
            </div>
            <div className={styles.contract_container}>
                <p className={styles.contract_container}>
                {nft.contract.slice(0, 6)}...{nft.contract.slice(38)}
                </p>
                <img
                src={
                    "https://etherscan.io/images/brandassets/etherscan-logo-circle.svg"
                }
                width="15px"
                height="15px"
                />
            </div>
            </div>

            <div className={styles.description_container}>
            <p>{nft.description}</p>
            </div>
        </div>
        </div>
    );
    }
    ```
    2. In /styles create NftGallery.module.css
    ```css
    .nft_gallery_page_container {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 100vh;
    }
    
    
    .nft_gallery{
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 1224px;
        align-items: center;
        padding: 0 1.5rem;
        margin-bottom: 2rem
    }
    
    
    .nfts_display {
        display: grid;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
        grid-template-columns: repeat(4, 1fr);
        border-radius: 8px;
        padding-top: 1rem;
    }
    
    .header {
        font-size: 1.5rem;
        font-weight: bolder;
    }
    
    .header_info {
        color: #4e4e4e;
        font-size: 1em;
        margin-bottom: 1em;
    }
    
    .card_container {
        background-color: #fff;
        width: 100%;
        width: 236px;
        max-height: 384px;
        border-radius: 12px;
        padding: 8px;
        border: 1px solid #CFD9F0;
    
    
    }
    
    .image_container {
    height: 204px;
        width: 100%;
        border-radius: 6px 6px 0 0;
    }
    
    .image_container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
    }
    
    
    .info_container{
        display: flex;
        flex-direction: column;
        row-gap: .3rem;
        width: 100%;
        flex-wrap: wrap;
    }
    .symbol_contract_container{
        display: flex; 
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        flex-grow: 1;
    }
    .symbol_container{
        display: flex;
        align-items: center;
    }
    .contract_container{
        display: flex;
        column-gap: .3rem;
        font-size: 12px;
        cursor: pointer;
        align-items: center;
    
    }
    
    .title_container {
        display: flex;
        align-items: center;
        height: 2.5rem;
    }
    
    .title_container h3 {
        font-weight: bold;
    }
    
    .symbol_container {
        display: flex;
        column-gap: .3rem;
        font-size: 0.8rem;
        font-weight: 700;
    }
    
    
    .description_container {
        margin-top: 0.5em;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 90%;
        font-size: 14px;
        color: #4e4e4e;
    }
    
    @media screen and (max-width: 992px) {
    
    }
    @media screen and (max-width: 750px) {
        .nfts_display {
        
        grid-template-columns: repeat(2, 1fr);
        }
    }
    @media screen and (max-width: 560px) {
        .nfts_display {
        
        grid-template-columns: repeat(1, 1fr);
        }
    }
    
    .button_container{
        display: flex;
        width: 100%;
        justify-content: center;
    }
    
    .button_black{
        text-align: center;
        padding: .6rem 1rem;
    
        border-radius: 3px;
        background-color: black;
        cursor: pointer;
        border-radius: 8px;
        color: white;
        cursor: pointer;
    }
    
    ```
    3. In /pages/api create getNftsForCollection.js 与getNftsForOwner.js
        - getNftsForCollection.js
        ```javascript
        import { Network, Alchemy } from "alchemy-sdk";

        export default async function handler(req, res) {
        const { address, pageKey, pageSize, chain, excludeFilters } = JSON.parse(
            req.body
        );
        if (req.method !== "POST") {
            res.status(405).send({ message: "Only POST requests allowed" });
            return;
        }
        console.log(chain);
        const settings = {
            apiKey: process.env.ALCHEMY_API_KEY,
            network: Network[chain],
        };
        const alchemy = new Alchemy(settings);

        try {
            const nfts = await alchemy.nft.getNftsForContract(address, {
            pageKey: pageKey ? pageKey : null,
            pageSize: pageSize ? pageSize : null,
            });
            const formattedNfts = nfts.nfts.map((nft) => {
            const { contract, title, tokenType, tokenId, description, media } = nft;

            return {
                contract: contract.address,
                symbol: contract.symbol,
                media: media[0]?.gateway
                ? media[0]?.gateway
                : "https://via.placeholder.com/500",
                collectionName: contract.openSea?.collectionName,
                verified: contract.openSea?.safelistRequestStatus,
                tokenType,
                tokenId,
                title,
                description,
            };
            });

            res.status(200).json({
            nfts: formattedNfts,
            pageKey: nfts.pageKey,
            });
            // the rest of your code
        } catch (e) {
            console.warn(e);
            res.status(500).send({
            message: "something went wrong, check the log in your terminal",
            });
        }
        }
        ```
        - getNftsForOwner.js
        ```javascript

        import { Network, Alchemy, NftFilters } from "alchemy-sdk";

        export default async function handler(req, res) {
        const { address, pageSize, chain, excludeFilter, pageKey } = JSON.parse(
            req.body
        );
        console.log(chain);
        if (req.method !== "POST") {
            res.status(405).send({ message: "Only POST requests allowed" });
            return;
        }

        const settings = {
            apiKey: process.env.ALCHEMY_API_KEY,
            network: Network[chain],
        };

        const alchemy = new Alchemy(settings);

        try {
            const nfts = await alchemy.nft.getNftsForOwner(address, {
            pageSize: pageSize ? pageSize : 100,
            excludeFilters: excludeFilter && [NftFilters.SPAM],
            pageKey: pageKey ? pageKey : "",
            });

            const formattedNfts = nfts.ownedNfts.map((nft) => {
            const { contract, title, tokenType, tokenId, description, media } = nft;

            return {
                contract: contract.address,
                symbol: contract.symbol,
                collectionName: contract.openSea?.collectionName,
                media: media[0]?.gateway
                ? media[0]?.gateway
                : "https://via.placeholder.com/500",
                verified: contract.openSea?.safelistRequestStatus,
                tokenType,
                tokenId,
                title,
                description,
            };
            });

            res.status(200).json({ nfts: formattedNfts, pageKey: nfts.pageKey });
        } catch (e) {
            console.warn(e);
            res.status(500).send({
            message: "something went wrong, check the log in your terminal",
            });
        }
        }
        ```
2. 在page需要引入的地方引入，如在pages/index.jsx
```jsx
import styles from "../styles/Home.module.css";
import NftGallery from "../components/nftsGallery"

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
      <NftGallery walletAddress={"t8840.eth"} />

      </main>
    </div>
  );
}
```

### NFT-NftGallery组件使用

### NFT-NFT Collection Info Display


### NFT-Minter

### Defi-Balance Display
1. Create Files
- In /components create tokensBalanceDisplay.jsx
```jsx
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import styles from "../styles/TokenBalancesDisplay.module.css";

export default function TokenBalancesPanel({ walletAddress, chain }) {
  const [tokensBalance, setTokensBalance] = useState();
  const [isLoading, setIsloading] = useState(false);
  const { address, isConnected, isDisconnected } = useAccount();
  const [propAddress, setPropAddress] = useState();
  useEffect(() => {
    const getNFTs = async () => {
      setIsloading(true);
      if (isConnected || walletAddress) {
        try {
          const fetchedTokensBalance = await fetch("/api/getTokensBalance", {
            method: "POST",
            body: JSON.stringify({
              address: walletAddress ? walletAddress : address,
              chain,
            }),
          }).then((res) => res.json());
          setTokensBalance(fetchedTokensBalance);
        } catch (e) {
          console.log(e);
        }
      }

      setIsloading(false);
    };

    getNFTs();
  }, []);

  useEffect(() => {
    if (!propAddress?.length && address) setPropAddress(address);
  }, [address]);
  if (isLoading) return <p>Loading...</p>;
  return (
    <div className={styles.token_panel_container}>
      <div className={styles.token_box}>
        <h2>
          {isDisconnected && walletAddress?.length
            ? `${walletAddress.slice(0, 6)}...${walletAddress.contract.slice(
                38
              )} `
            : `${propAddress?.slice(0, 6)}...${propAddress?.slice(38)}`}
        </h2>
        <div className={styles.tokens_container}>
          {tokensBalance?.length &&
            tokensBalance.map((token) => {
              return (
                <div key={token.symbol} className={styles.token}>
                  <div className={styles.token_name_container}>
                    <div className={styles.image_container}>
                      <img
                        src={
                          token.logo
                            ? token.logo
                            : "http://via.placeholder.com/50"
                        }
                      ></img>
                    </div>
                    <p className={styles.token_name}>{token.name}</p>
                  </div>

                  <div className={styles.info_container}>
                    <div className={styles.token_name_sybol_container}>
                      <p className={styles.token_balance}>{token.balance}</p>
                      <p className={styles.token_symbol}>{token.symbol}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

```
- In /styles create TokenBalancesDisplay.module.css
```javascript
.token_panel_container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: rgb(12, 12, 12);
}

.token_box{
    background-color: #fff;
    border-radius: 12px;
    padding: 1.5rem 1rem;
    width: 378px;
    min-height: 260px;
    border: 1px solid #CFD9F0;

}

.token_box h2{
    font-weight: 700;
    margin-bottom: 1.8rem;

}
.height_box{
    height: 30rem;
    overflow: scroll;

}

.token{
    display: flex;
    justify-content: space-between;
    align-items: center;
    
}

.tokens_container{
    display: flex;
    flex-direction: column;
    row-gap: 1.5rem;
}

.token_name_container{
    display: flex;
    align-items: center;
    column-gap: .3rem;
}

.image_container{
    height: 40px;
    width: 40px;
    border-radius: 100%;
    background-color:#ECEFF0
   }
   
   .image_container img{
       width: 100%;
       height: 100%;
       border-radius: 100%;
       object-fit: contain;
   
   }

   .info_container{
    padding-left: 1rem;
    font-size: .85rem;
   }
   .token_name_sybol_container{
    display: flex;
    column-gap: .5rem;
  
   }
   .token_name{
    font-weight: 600;
   }
   .token_balance{
    font-weight: 700;
   }

   .token_symbol{
    color:#4E4E4E;
font-weight: 700
   }

```

- In /pages/api create getTokensBalance.js
```javascript
import { Network, Alchemy } from "alchemy-sdk";

export default async function handler(
  req, res
) {
  const { address, chain } = JSON.parse(req.body);
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network[chain],
  };

  const alchemy = new Alchemy(settings);
  try {
    const fetchedTokens = await alchemy.core.getTokenBalances(address);
    const ethBalance = await alchemy.core.getBalance(address);
    const parsedEthBalance = parseInt(ethBalance.toString()) / Math.pow(10, 18);
    console.log(parsedEthBalance);
    const ethBalanceObject = {
      name: "Ethereum",
      symbol: "ETH",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      decimals: 18,
      balance: parsedEthBalance.toPrecision(2),
      address: "0x",
    };
    const fetchedTokenBalances = fetchedTokens.tokenBalances.map(
      (token) => token.tokenBalance
    );

    const fetchedTokenAddresses = fetchedTokens.tokenBalances.map(
      (token) => token.contractAddress
    );

    const fetchedTokenMetadata = await Promise.all(
      fetchedTokenAddresses.map(async (address) => {
        const metadata = await alchemy.core.getTokenMetadata(address);
        return metadata;
      })
    );
    
    const unifiedBalancedAndMetadata = [ethBalanceObject];

    for (let x = 0; x < fetchedTokenMetadata.length - 1; x++) {
      const tokenMetadata = fetchedTokenMetadata[x];
      const { name, symbol, logo, decimals } = tokenMetadata;
      const hexBalance = fetchedTokenBalances[x];
      const address = fetchedTokenAddresses[x];
      let convertedBalance;

      if (hexBalance && tokenMetadata.decimals) {
        convertedBalance = parseInt(hexBalance) / Math.pow(10, decimals);
        if (convertedBalance > 0) {
          const tokenBalanceAndMetadata = {
            name,
            symbol,
            logo,
            decimals,
            balance: convertedBalance.toPrecision(2),
            address,
          };
          unifiedBalancedAndMetadata.push(tokenBalanceAndMetadata);
        }
      }
    }

    res.status(400).json(unifiedBalancedAndMetadata);
  } catch (e) {
    console.warn(e);
    res.status(500).send({
      message: "something went wrong, check the log in your terminal",
    });
  }
}

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

```
2. 在page需要引入的地方引入，如在pages/index.jsx
```jsx
import styles from "../styles/Home.module.css";
import TokenBalancesPanel from "../components/tokensBalanceDisplay"
export default function Home() {
  return (
    <div>
 
      <main className={styles.main}>
      <TokenBalancesPanel walletAddress={"t8840.eth"} />
      </main> 
      
    </div>
    
  );
}
```
### Defi-Transaction History Display


## Template模版


## 部署到测试网


## 部署到主网