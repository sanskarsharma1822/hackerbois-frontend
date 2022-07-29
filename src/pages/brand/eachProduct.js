import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import console from "console-browserify";

import { brandsABI } from "../../constants/Brands/brandsConstant";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";

function Product({
  tokenId,
  brandIndex,
  brandAddress,
  name,
  image,
  serialNumber,
  productLink,
  description,
  price,
}) {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const dispatch = useNotification();

  const [newAddress, setNewAddress] = useState("");
  const [owner, setOwner] = useState("");

  const {
    runContractFunction: transferToken,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "transferToken",
    params: { _sendTo: newAddress, _tokenId: tokenId },
  });

  const { runContractFunction: isOwner } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "isOwner",
    params: { _tokenId: tokenId },
  });

  const updateIsOwner = async function () {
    const tempOwner = await isOwner({
      onError: (error) => console.log(error),
    });
    setOwner(tempOwner);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateIsOwner();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNotification(tx);
    // updateUI();
  };

  const handleNotification = function (tx) {
    dispatch({
      type: "success",
      message: "NFT Successfully Transferred",
      title: "Product Transferred",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            <div>{description}</div>
            <div>{productLink}</div>
            <div>{price}</div>
          </Card.Text>
          {owner ? (
            <div>
              <div>
                <label>Transfer To : </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <Button
                  variant="primary"
                  disabled={isFetching || isLoading ? true : false}
                  onClick={async () => {
                    await transferToken({
                      onSuccess: handleSuccess,
                      onError: (error) => console.log(error),
                    });
                  }}
                >
                  Transfer
                </Button>
              </div>
            </div>
          ) : (
            <div>NFT has already been transfered</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Product;
