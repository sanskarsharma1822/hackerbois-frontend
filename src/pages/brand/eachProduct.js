import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import console from "console-browserify";

import { brandsABI } from "../../constants/Brands/brandsConstant";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import sendMail from "../../backendScripts/sendMessage";
import storeOwnerHistory from "../../backendScripts/storeOwnerHistory";

function Product({
  tokenId,
  brandIndex,
  brandId,
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
  const [val, setVal] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [ipfs, setIPFS] = useState("");
  const [IPFSReturn, setIPFSReturn] = useState("");

  const {
    runContractFunction: transferToken,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "transferToken",
    params: { _sendTo: newAddress, _tokenId: tokenId, _newHistory: IPFSReturn },
  });

  const { runContractFunction: isOwner } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "isOwner",
    params: { _tokenId: tokenId },
  });

  const { runContractFunction: viewhistory } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "viewhistory",
    params: { _tokenId: tokenId },
  });

  const { runContractFunction: validityPeriod } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "validityPeriod",
    params: { _tokenId: tokenId },
  });

  const updateIsOwner = async function () {
    const tempOwner = await isOwner({
      onError: (error) => console.log(error),
    });
    const tempValidityPeriod = await validityPeriod({
      onError: (error) => console.log(error),
    });
    const tempHistory = await viewhistory({
      onError: (error) => console.log(error),
    });
    setVal(tempValidityPeriod);
    setOwner(tempOwner);
    setIPFS(tempHistory);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateIsOwner();
    }
  }, []);

  useEffect(() => {
    async function updateIPFSHistory() {
      await transferToken({
        onSuccess: handleSuccess,
        onError: handleErrorNotification,
      });
    }
    if (IPFSReturn !== "") {
      updateIPFSHistory();
    }
  }, [IPFSReturn]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNotification(tx);
    // updateUI();
    sendMail(tokenId, name, brandId, val, userEmail);
  };

  const handleNotification = function (tx) {
    dispatch({
      type: "success",
      message: "NFT Successfully Transferred",
      title: "Product Transferred",
      position: "topR",
      icon: "checkmark",
    });
  };

  const handleErrorNotification = function (tx) {
    dispatch({
      type: "error",
      message: "NFT Transfer Unsuccessful",
      title: "Error Occured",
      position: "topR",
      icon: "info",
    });
  };

  return (
    <div class="everyProduct">
      <Card style={{ width: "18rem", height: "60vh" }}>
        <Card.Img
          variant="top"
          src={image}
          style={{ objectFit: "cover", height: "20vh" }}
        />
        <Card.Body>
          <Card.Title id="nameProduct">{name}</Card.Title>
          <Card.Text>
            <div id="description">{description}</div>
            <a id="productLink" href={productLink} target="blank">
              Link
            </a>
            <div>Price - {price}</div>
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
                <label>Email : </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
                {/* </div>
              <div> */}
                <Button
                  variant="primary"
                  disabled={isFetching || isLoading ? true : false}
                  onClick={async () => {
                    const tempRetIpfs = await storeOwnerHistory(
                      ipfs,
                      newAddress,
                      chainId
                    );
                    setIPFSReturn(tempRetIpfs);
                  }}
                >
                  Transfer
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ color: "red" }}>NFT has already been transfered</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Product;
