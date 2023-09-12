"use strict";

import "./../style/visual.less";
import { 
    create_empty_table_container,
    sort_and_arrange_columns,
    map_row,
    create_data_html,
    create_and_insert_table,
    sort_rows_by
} from "./modules/table"

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IVisualHost = powerbi.extensibility.IVisualHost;

// import * as d3 from "d3";
// type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
    private host: IVisualHost;
    private body: HTMLElement;
    private table: HTMLElement;

    constructor(options: VisualConstructorOptions) {
        this.body = document.querySelector('#sandbox-host');
        this.host = options.host;
        this.table = create_empty_table_container("beforeEnd", this.body);
    }

    public update(options: VisualUpdateOptions) {
        let dataView: DataView = options.dataViews[0];
        
        // @ts-ignore
        const allowInteractions = this.host.hostCapabilities.allowInteractions

        // // Sort and Re-arrange columns
        let columns = dataView.table.columns
        let column_names_in_original_order = columns.map(a => a.queryName)
        columns = sort_and_arrange_columns(columns)

        // // Convert row arrays to row objects
        let rows = dataView.table.rows.map((row, index) => map_row(row, index, column_names_in_original_order))

        let default_sort_direction = "desc"
        let default_sort_header = columns.filter(column => !!column.isMeasure)[0]

        let sorted_rows = sort_rows_by(rows, default_sort_header.queryName, default_sort_direction)
        create_and_insert_table(this.table, columns, sorted_rows, default_sort_header.queryName, default_sort_direction)

        console.log({
            Visualisation: this,
            dataView,
            columns,
            rows,
            allowInteractions,
        })
    }
}