#!/usr/bin/env python3
"""XOdoo product importer for XCMG catalogue JSON.
Run inside the Odoo venv/container: python odoo_import_products.py /opt/ivoire-monade/schemas/products/xcmg_catalogue.json
Requires: xmlrpc.client, optional qrcode/media handling.
"""
import json
import sys
import xmlrpc.client
from pathlib import Path


def get_odoo_client(url: str, db: str, user: str, password: str):
    common = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/common')
    uid = common.authenticate(db, user, password, {})
    if not uid:
        raise SystemExit(f'auth failed for {user}')
    models = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/object')
    return uid, models


def ensure_category(models, db, uid, name):
    ids = models.execute_kw(db, uid, '', 'product.category', 'search', [[('name', '=', name)]], {'limit': 1})
    if ids:
        return ids[0]
    return models.execute_kw(db, uid, '', 'product.category', 'create', [{'name': name}])


def main():
    if len(sys.argv) < 6:
        print('Usage: python odoo_import_products.py <url> <db> <user> <password> <catalogue.json>')
        sys.exit(2)
    url, db, user, password, path = sys.argv[1:6]
    uid, models = get_odoo_client(url, user, password, db)
    items = json.loads(Path(path).read_text())
    cat_id = ensure_category(models, db, uid, 'XCMG')
    imported = []
    for item in items:
        vals = {
            'name': item['name'],
            'default_code': item['sku'],
            'type': 'service',
            'categ_id': cat_id,
            'weight': item['technical_specs'].get('operating_weight_kg', 0),
            'list_price': 0.0,
            'description_sale': item['description_short'],
            'sale_line_warn': 'no-message',
        }
        pid = models.execute_kw(db, uid, password, 'product.template', 'create', [vals])
        imported.append({'id': pid, 'sku': item['sku'], 'name': item['name']})
    print(json.dumps({'imported': imported, 'count': len(imported)}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
