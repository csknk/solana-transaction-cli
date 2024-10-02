# Build Solana Transactions

Builds Solana transactions to be signed externally.

To run, install node packages and run the `start` script.

The script takes three parameters:

```sh
# Run script with warnings suppressed
npm run --silent start "$from" "$to" "$amount" 2>/dev/null
```

A shell script `request-signature.sh` is provided which:

- Runs the typescript programme to generate the unsigned (devnet) transaction
- Submits the transaction for signing to zrchain

If the Solana-enabled relayer is running, the fulfilled transaction request will be picked up and broadcast to L1.

For debugging, set `broadcast=0` in `request-signature.sh` - this will print the script output without broadcasting.
