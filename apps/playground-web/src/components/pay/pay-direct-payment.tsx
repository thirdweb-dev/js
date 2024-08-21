"use client";

import React from "react";
import { sepolia } from "thirdweb/chains";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { StyledConnectButton } from "../styled-connect-button";
import { getBuyWithCryptoTransfer, BuyWithCryptoTransfer, GetBuyWithCryptoTransferParams, NATIVE_TOKEN_ADDRESS, sendTransaction, waitForReceipt,
  getBuyWithCryptoStatus, BuyWithCryptoStatus
 } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

export function PayDirectPayments() {

  const [transferQuote, setTransferQuote] = React.useState<BuyWithCryptoTransfer | null>(null);
  const [transactionHash, setTransactionHash] = React.useState<string | null>(null);
  const account = useActiveAccount();
  const [status, setStatus] = React.useState<BuyWithCryptoStatus | null>(null);

  const getPayment = async () => {

    if(!account) {
      alert("Must sign in first");
      return;
    }


    const result = await getBuyWithCryptoTransfer({
      client: THIRDWEB_CLIENT,
      fromAddress: account.address,
      toAddress: "0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675",
      chainId: sepolia.id,
      tokenAddress: NATIVE_TOKEN_ADDRESS,
      amount: ".001",
      purchaseData: {
        "size": "m"
      }
    });

    setTransferQuote(result);

    console.log(result);
  } 


  const handleSubmit = async () => {
    if (!transferQuote) {
      alert("No transfer quote available.");
      return;
    }

    if(!account) {
      alert("must sign in to use");
      return;
    }

    if(transferQuote.approval) {
      const approvalTx = await sendTransaction({
        account: account,
        transaction: transferQuote.approval
      });

      await waitForReceipt({ ...approvalTx, maxBlocksWaitTime: 50 });
    }

    const tx = await sendTransaction({
      account: account,
      transaction: transferQuote.transactionRequest
    });

    setTransactionHash(tx.transactionHash);
  };

  React.useEffect(() => {
    let interval: Timer;

    const startPolling = () => {
      if (transactionHash) {
        interval = setInterval(async () => {
          const status = await getBuyWithCryptoStatus({
            client: THIRDWEB_CLIENT,
            transactionHash: transactionHash,
          });

          setStatus(status);

          // stop polling if completed or failed
          if (status.status === "COMPLETED" || status.status === "FAILED") {
            clearInterval(interval as NodeJS.Timeout);
          }
        }, 5000); 
      }
    };

    startPolling();

    return () => {
      if (interval) {
        clearInterval(interval as NodeJS.Timeout);
      }
    };
  }, [transactionHash]);


  return (
    <>
      <StyledConnectButton />
      <div className="h-10" />
      <button onClick={getPayment}>Get Payment Quote</button>
      {transferQuote && (
        <div>
          <h3>Payment Quote Details</h3>
          <p><strong>From Address:</strong> {transferQuote.fromAddress}</p>
          <p><strong>To Address:</strong> {transferQuote.toAddress}</p>
          <p><strong>Payment Token:</strong> {transferQuote.paymentToken.token.symbol}</p>
          <p><strong>Amount:</strong> {transferQuote.paymentToken.amount}</p>
          <p><strong>Processing Fee:</strong> {transferQuote.processingFee.amount}</p>
          <p><strong>Estimated Gas Cost (USD):</strong> ${(transferQuote.estimatedGasCostUSDCents / 100).toFixed(2)}</p>
          <button onClick={handleSubmit}>Submit Payment</button>
        </div>
      )}
      {transactionHash && (
        <div>
          <h3>Transaction Status</h3>
          {status ? (
            <>
              {status.status === "NOT_FOUND" ? (
                <p>Transaction not found. Please check the transaction hash.</p>
              ) : (
                <>
                  <p>
                    <strong>Status:</strong> {status.status}
                  </p>
                  <p>
                    <strong>Sub-Status:</strong> {status.subStatus}
                  </p>
                  {status.failureMessage && (
                    <p>
                      <strong>Failure Message:</strong> {status.failureMessage}
                    </p>
                  )}
                </>
              )}
            </>
          ) : (
            <p>Loading status...</p>
          )}
        </div>
      )}

      <div className="h-10" />
    </>
  );
}
