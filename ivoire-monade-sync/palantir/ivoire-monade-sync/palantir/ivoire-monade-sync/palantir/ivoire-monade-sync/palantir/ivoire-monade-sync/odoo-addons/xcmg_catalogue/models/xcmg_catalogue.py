from odoo import fields, models


class XcmgCatalogueLine(models.Model):
    _name = "xcmg.catalogue.line"
    _description = "XCMG catalogue line"
    _rec_name = "name"

    name = fields.Char(string="Name", required=True)
    product_tmpl_id = fields.Many2one("product.template", string="Product Template")
    category = fields.Char(string="Category")
    spec_json = fields.Text(string="Specifications JSON")
    active = fields.Boolean(string="Active", default=True)
