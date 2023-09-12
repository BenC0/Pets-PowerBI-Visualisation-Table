"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import { applyCustomFormat } from "./modules/utils"

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IVisualHost = powerbi.extensibility.IVisualHost;
import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
    private bodyWidth: number;
    private host: IVisualHost;
    private body: HTMLElement;
    private table: HTMLElement;
    private column_names_in_original_order: string[];
    private svg: Selection<SVGElement>;
    private container: Selection<SVGElement>;

    constructor(options: VisualConstructorOptions) {
        this.body = document.querySelector('#sandbox-host');
        this.host = options.host;
        this.bodyWidth = this.body.getBoundingClientRect().width;
        this.table = this.create_empty_table("beforeEnd", this.body);
    }

    public update(options: VisualUpdateOptions) {
        let dataView: DataView = options.dataViews[0];
        // // Clear the current table
        this.table.querySelectorAll("*").forEach(el => el.remove());
        
        // @ts-ignore
        const allowInteractions = this.host.hostCapabilities.allowInteractions

        // // Sort and Re-arrange columns
        let columns = dataView.table.columns
        let column_names_in_original_order = columns.map(a => a.queryName)
        let dimension_columns = columns.filter(column => !!column.roles.dimension)
        dimension_columns = this.sort_dimensions(dimension_columns)
        let metrics_columns = columns.filter(column => !!column.roles.metrics)
        metrics_columns = this.sort_metrics(metrics_columns)
        let arranged_columns = [...dimension_columns, ...metrics_columns]
        arranged_columns = arranged_columns.map((column, index) => {
            return {
                ...column,
                arrangement_index: index
            }
        })

        // // Convert row arrays to row objects
        let rows = dataView.table.rows.map((row, index) => this.map_row(row, index, column_names_in_original_order))

        let table_layout = arranged_columns.map(column => column.queryName)
        let table_shape = {
            rows: rows.length,
            columns: table_layout.length
        }

        let thead_html = `<thead><tr>`
        arranged_columns.forEach(column => {
            thead_html += `<td
                dimension=${!!column.roles.dimension}
                metric=${!!column.roles.metrics}
            >${column.displayName}</td>`
        })
        thead_html += `</tr></tbody>`

        let tbody_html = `<tbody>`
        for (let row_index = 0; row_index < table_shape.rows; row_index++) {
            let row_html = `<tr>`
            let row = rows[row_index]
            for (let column_index = 0; column_index < table_shape.columns; column_index++) {
                let column = arranged_columns[column_index]
                let cell = row.values.filter(cell => cell.column_reference == column.queryName).pop()
                let value = cell.value
                let formatString = column.format
                let formatted_value = value
                if (!!formatString && typeof value !== "string") {
                    formatted_value = applyCustomFormat(formatted_value, formatString);
                }
                row_html += `<td
                    dimension=${!!column.roles.dimension}
                    metric=${!!column.roles.metrics}
                >${formatted_value}</td>`
            }
            row_html += `</tr>`
            tbody_html += row_html
        }
        tbody_html += `</tbody>`
        
        let table_html = `<table class="pets-table">`
        table_html += thead_html
        table_html += tbody_html
        table_html += `</table>`
        this.table.insertAdjacentHTML("beforeend", table_html)

        console.log({
            Visualisation: this,
            dataView,
            dimension_columns,
            metrics_columns,
            arranged_columns,
            rows,
            allowInteractions
        })
    }

    private map_row(row: any, row_index: number, column_names_in_original_order: string[]) {
        let mapped_row = {
            values: [],
            row_index: row_index,
            sort_index: row_index,
        }
        row.forEach((cell, cell_index) => {
            mapped_row.values.push({
                value: cell,
                column_reference: column_names_in_original_order[cell_index]
            })
        })
        return mapped_row
    }

    private sort_dimensions(columns) {
        return columns.sort((a, b) => {
            return a.rolesIndex.dimension[0] - b.rolesIndex.dimension[0]
        })
    }

    private sort_metrics(columns) {
        return columns.sort((a, b) => {
            return a.rolesIndex.metrics[0] - b.rolesIndex.metrics[0]
        })
    }

    private create_empty_table(method, target) {
        var template = document.createElement('template');
        template.innerHTML = `<div class="pets-table-container"></div>`;
        var tempEl = template.content.firstChild;
        var node = target.insertAdjacentElement(method, tempEl);
        return node
    }
}