// File: src/index.ts

import {
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";

async function main() {
  try {
    if (process.argv.length !== 5) {
      throw new Error(
        "Usage: npm start <sender_address> <recipient_address> <amount_in_lamports>",
      );
    }

    const [, , senderAddress, recipientAddress, amountInLamports] =
      process.argv;

    if (
      !PublicKey.isOnCurve(senderAddress) ||
      !PublicKey.isOnCurve(recipientAddress)
    ) {
      throw new Error("Invalid Solana address provided");
    }

    const amount = parseInt(amountInLamports, 10);
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount provided");
    }

    // NOTE: connect to correct network for valid blockhash
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed",
    );

    const senderPublicKey = new PublicKey(senderAddress);
    const recipientPublicKey = new PublicKey(recipientAddress);
    const instruction = SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: recipientPublicKey,
      lamports: amount,
    });
    const { blockhash } = await connection.getLatestBlockhash();

    // Create a new transaction and add the instruction
    const transaction = new Transaction().add(instruction);
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPublicKey;

    // NOTE: Serialize the transaction *message* - NOT the transaction
    // This is the output that will be signed.
    const serializedTransaction = transaction.serializeMessage();

    const output = {
      sender: senderAddress,
      recipient: recipientAddress,
      amount_in_lamports: amount,
      unsigned_transaction: {
        base64: serializedTransaction.toString("base64"),
        hex: serializedTransaction.toString("hex"),
      },
    };

    console.log(JSON.stringify(output));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.log(JSON.stringify({ error: errorMessage }));
    process.exit(1);
  }
}

main();
