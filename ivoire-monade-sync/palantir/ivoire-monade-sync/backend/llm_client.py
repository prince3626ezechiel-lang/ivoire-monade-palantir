#!/usr/bin/env python3
"""IVOIRE MONADE unified local LLM client for OBM swarm."""
import json, os, urllib.request, urllib.error
from pathlib import Path

CONFIG = Path('/opt/ivoire-monade/schemas/llm/local-llm-config.json')
cfg = json.loads(CONFIG.read_text())

def call(messages, max_tokens=256, temperature=0.3):
    for target in [cfg['primary'], cfg['fallback']]:
        url = target['base_url'] + '/chat/completions'
        payload = json.dumps({
            'model': target['model'],
            'messages': messages,
            'max_tokens': max_tokens,
            'temperature': temperature,
        }).encode()
        req = urllib.request.Request(url, data=payload, headers={'content-type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = json.loads(r.read())
                return data['choices'][0]['message']['content']
        except Exception as e:
            print(f"[llm] {target['provider']} failed: {e}")
    return 'LLM_BLOCKED: no local backend available'

if __name__ == '__main__':
    msg = call([{'role':'user','content':'OBM swarm online, one line.'}], max_tokens=32)
    print(msg)
