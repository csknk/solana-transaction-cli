#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

from="GuqQ1oJJ7n9C3cSc1W6cj2NubVKCQKrEG8NkZTHucoee"
to="5Wvu3L3vVkQi2RPA12sTbzFTPgzgim5kQc3iRHFVw6zZ"
amount=10042

unsigned_tx=$(npm run --silent start "$from" "$to" "$amount" 2>/dev/null | jq -r '.unsigned_transaction.hex')
echo "$unsigned_tx"
