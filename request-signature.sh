#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
# request-signature.sh
# author David Egan <csknk@protonmail.com>
#
# Creates an unsigned Solana transaction using the npm `start` script and submits this to Zenrock zrchain for signing.
#
# - Set the key id that corresponds to the generated address specified in `from`
# - zenrockd should be a path to a suitable zenrock binary (must have Solana support)
# - Set broadcast to 1 for broadcast to zrchain, otherwise will print output for debugging purposes
# - Set MetadataSolana to the correct network - for mainnet, this can be left empty. See: https://github.com/zenrocklabs/zenrock/blob/main/zrchain/x/treasury/types/tx.pb.go#L63
# --------------------------------------------------------------------------------------

zenrockd=$HOME/zenrock/zenrock/.worktree/feature/solana-relayer/zrchain/build/zenrockd
from=GuqQ1oJJ7n9C3cSc1W6cj2NubVKCQKrEG8NkZTHucoee
to=HpzusjfWgokpwuz6D8GhyCELJM83e6FC7KeAvzbXtF6R
amount=10042
broadcast=1

unsigned_tx=$(npm run --silent start "$from" "$to" "$amount" 2>/dev/null)
tx_hexstring=$(echo "$unsigned_tx" | jq -r '.unsigned_transaction.hex')

key_id=2
if [[ $broadcast == 1 ]]; then
	echo "submitting to zenrock zrchain..."
	result=$(
		"$zenrockd" tx treasury new-sign-transaction-request "$key_id" solana "$tx_hexstring" \
			--metadata '{ "@type": "/zrchain.treasury.MetadataSolana", "network": 2}' \
			--chain-id zenrock --from alice --yes --gas-prices 0.0001urock \
			--output json
	)

	tx=$(echo "$result" | jq -r '.txhash')
	echo "$tx"
else
	echo "$unsigned_tx" | jq '.'
fi
