// File: src/index.ts

import {
  Keypair,
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  // Connect to the Solana devnet
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed",
  );

  // Generate a new keypair for the sender
  const senderKeypair = Keypair.generate();

  console.log("Sender public key:", senderKeypair.publicKey.toBase58());

  // Request recipient's public key from user
  const recipientPublicKey = await new Promise<string>((resolve) => {
    rl.question("Enter recipient's public key: ", resolve);
  });

  // Request amount to send
  const amount = await new Promise<number>((resolve) => {
    rl.question("Enter amount to send (in SOL): ", (answer) => {
      resolve(parseFloat(answer));
    });
  });

  // Create a simple transfer instruction
  const instruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey: new PublicKey(recipientPublicKey),
    lamports: amount * 1e9, // Convert SOL to lamports
  });

  // Get the latest blockhash
  const { blockhash } = await connection.getLatestBlockhash();

  // Create a new transaction and add the instruction
  const transaction = new Transaction().add(instruction);

  // Set the recent blockhash and the paying account
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderKeypair.publicKey;

  // Serialize the transaction
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });

  console.log(
    "Unsigned transaction (base64):",
    serializedTransaction.toString("base64"),
  );
  console.log(
    "Unsigned transaction (hex):",
    serializedTransaction.toString("hex"),
  );

  rl.close();
}

main().catch(console.error);
// // File: src/index.ts
//
// import { Keypair, Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';
// import * as readline from 'readline';
//
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
//
// async function main() {
//   // Connect to the Solana devnet
//   const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
//
//   // Generate a new keypair for the sender
//   const senderKeypair = Keypair.generate();
//
//   console.log('Sender public key:', senderKeypair.publicKey.toBase58());
//
//   // Request recipient's public key from user
//   const recipientPublicKey = await new Promise<string>((resolve) => {
//     rl.question('Enter recipient\'s public key: ', resolve);
//   });
//
//   // Request amount to send
//   const amount = await new Promise<number>((resolve) => {
//     rl.question('Enter amount to send (in SOL): ', (answer) => {
//       resolve(parseFloat(answer));
//     });
//   });
//
//   // Create a simple transfer instruction
//   const instruction = SystemProgram.transfer({
//     fromPubkey: senderKeypair.publicKey,
//     toPubkey: new PublicKey(recipientPublicKey),
//     lamports: amount * 1e9 // Convert SOL to lamports
//   });
//
//   // Get the latest blockhash
//   const { blockhash } = await connection.getLatestBlockhash();
//
//   // Create a new transaction and add the instruction
//   const transaction = new Transaction().add(instruction);
//
//   // Set the recent blockhash and the paying account
//   transaction.recentBlockhash = blockhash;
//   transaction.feePayer = senderKeypair.publicKey;
//
//   // Serialize the transaction
//   const serializedTransaction = transaction.serialize({
//     requireAllSignatures: false,
//     verifySignatures: false
//   });
//
//   console.log('Unsigned transaction:', serializedTransaction.toString('base64'));
//
//   rl.close();
// }
//
// main().catch(console.error);
