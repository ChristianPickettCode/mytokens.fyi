import React, { useEffect, useState }  from "react";
import Metamask from "./metamask.svg"
import { Input, Button, List, Row, Col } from 'antd';
const { Search } = Input;


export function TokenList({selectedAddress}) {

    const [tokenList, setTokenList] = useState([])

    useEffect(() => {
        getTokens(selectedAddress);
    }, [selectedAddress])

    const getTokens = (address) => {
        fetch(`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&apikey=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                var tList = []
                data.result.map(i => (
                    tList.push(i)
                ))

                const unique = []

                tList.filter(function(item) {
                    var i = unique.findIndex(x => (x.contractAddress === item.contractAddress));
                    if(i <= -1 && item.tokenName !== ""){
                        unique.push(item);
                    }
                    return null;
                });

                setTokenList(unique)
            })
    }

    const addToken = async(tokenAddress, tokenSymbol, tokenDecimals) => {

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                    address: tokenAddress, // The address that the token is at.
                    symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: tokenDecimals, // The number of decimals in the token
                    // image: tokenImage, // A string url of the token logo
                    },
                },
            });
    
            if (wasAdded) {
                console.log(`${tokenSymbol} added`);
            } else {
                console.log(`${tokenSymbol} not added`);
            }
            } catch (error) {
                console.log(error);
            }
    }
    return (
        <div>
            <Row>
                {/* <Input placeholder={selectedAddress} onChange={e => setAddress(e.target.value)} />
                <Button onClick={getTokens}>Get</Button> */}
                <Search placeholder={selectedAddress} onSearch={getTokens} enterButton />
            </Row>
            
            <br />
            <List
                bordered
                dataSource={tokenList}
                renderItem={i => (
                    <List.Item key={i.timeStamp}>
                        <Col span={8}>{i.tokenName} (${i.tokenSymbol})</Col>
                        <Col span={1}>
                            <img style={{cursor:"pointer"}} onClick={() => addToken(i.contractAddress, i.tokenSymbol, i.tokenDecimal)} src={Metamask} height={30} width={30} alt={<Button>ADD</Button>}/>
                        </Col>
                    </List.Item>
                )}
                />
        </div>
    );
}
