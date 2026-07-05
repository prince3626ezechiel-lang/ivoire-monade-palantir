#!/usr/bin/env python3
"""SMC 4H paper trader using CCXT public feeds."""
import json, sys
try:
    import ccxt
except Exception as e:
    print(json.dumps({"status":"error","detail":str(e)}))
    sys.exit(1)
exchange = ccxt.binance()
markets = exchange.load_markets()
btc = exchange.fetch_ticker('BTC/USDT')
print(json.dumps({"status":"ok","symbol":"BTC/USDT","price":btc['last'],"markets_count":len(markets)}))
