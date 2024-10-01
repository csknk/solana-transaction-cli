#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

zenrockd=$HOME/zenrock/zenrock/.worktree/feature/solana-relayer/zrchain/build/zenrockd # Path to a zenrock binary
# zenrockd=$HOME/zenrock/zenrock/zrchain/build/zenrockd # Path to a zenrock binary
from=GuqQ1oJJ7n9C3cSc1W6cj2NubVKCQKrEG8NkZTHucoee
to=HpzusjfWgokpwuz6D8GhyCELJM83e6FC7KeAvzbXtF6R
amount=10042
broadcast=0

# unsigned_tx=$(npm run --silent start "$from" "$to" "$amount")
unsigned_tx=$(npm run --silent start "$from" "$to" "$amount" 2>/dev/null)
# echo "$unsigned_tx"
hex=$(echo "$unsigned_tx" | jq -r '.unsigned_transaction.hex')
# b64=$(echo "$unsigned_tx" | jq -r '.unsigned_transaction.base64')

echo "$hex"
# echo "$b64"

key_id=2
if [[ $broadcast == 1 ]]; then
	echo "submitting to zenrock zrchain..."
	result=$(
		"$zenrockd" tx treasury new-sign-transaction-request "$key_id" solana "$unsigned_tx" \
			--metadata '{ "@type": "/zrchain.treasury.MetadataSolana", "network": 2}' \
			--chain-id zenrock --from alice --yes --gas-prices 0.0001urock \
			--output json
	)

	tx=$(echo "$result" | jq -r '.txhash')
	echo "$tx"
fi
