#!/usr/bin/env bash
# Remote device workflow via Tailscale headless
# Usage: ./scripts/tailscale/remote-device.sh <target> <command>
TARGET="${1:?target required}"
shift
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$TARGET" "$*"
