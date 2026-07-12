# browseros-cli Command Reference

## Global Flags
| Flag | Env Var | Description |
|------|---------|-------------|
| `--server, -s` | `BROWSEROS_URL` | Server URL |
| `--page, -p` | `BROWSEROS_PAGE` | Target page ID |
| `--json` | `BOS_JSON=1` | JSON output |
| `--debug` | `BOS_DEBUG=1` | Debug output |
| `--timeout, -t` | | Request timeout |

## Navigate
`open`, `open --hidden`, `open --bg`, `open --window`, `nav`, `back`, `forward`, `reload`, `pages`, `active`, `close`

## Observe
`snap`, `snap -e`, `text`, `text --selector/css/links/images/viewport`, `links`, `ss [-o path]`, `ss --full`, `eval`, `dom`, `dom-search`, `wait --text/selector`

## Input
`click/right/middle/double`, `click-at`, `fill`, `fill --no-clear`, `clear`, `key`, `hover`, `focus`, `check/uncheck`, `select`, `scroll`, `drag`, `upload`, `dialog accept/dismiss`

## Export
`pdf <path>`, `download <id> <dir>`

## Resources
- bookmark: list/search/create/remove/update/move
- history: recent/search/delete/delete-range
- group: list/create/update/ungroup/close
- window: list/create/close/activate

## Setup
`install`, `install --dir/--deb`, `launch [--wait]`, `init [--auto/url]`, `health`, `status`, `config [--path]`, `info`

Run `browseros-cli --help` for the latest flags.
