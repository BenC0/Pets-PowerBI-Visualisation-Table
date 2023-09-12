import { applyCustomFormat } from "./utils"

export function create_empty_table_container(method, target) {
    var template = document.createElement('template');
    template.innerHTML = `<div class="pets-table-container"></div>`;
    var tempEl = template.content.firstChild;
    var node = target.insertAdjacentElement(method, tempEl);
    return node
}

export function create_data_html(columns, rows) {
    let table_layout = columns.map(column => column.queryName)
    let table_shape = {
        rows: rows.length,
        columns: table_layout.length
    }

    let thead_html = `<thead><tr>`
    columns.forEach(column => {
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
            let column = columns[column_index]
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
    return table_html
}


export function sort_and_arrange_columns(columns) {
    let dimension_columns = columns.filter(column => !!column.roles.dimension)
    dimension_columns = sort_dimensions(dimension_columns)
    let metrics_columns = columns.filter(column => !!column.roles.metrics)
    metrics_columns = sort_metrics(metrics_columns)
    let arranged_columns = [...dimension_columns, ...metrics_columns]
    arranged_columns = arranged_columns.map((column, index) => {
        return {
            ...column,
            arrangement_index: index
        }
    })
    return arranged_columns
}

export function sort_dimensions(columns) {
    return columns.sort((a, b) => {
        return a.rolesIndex.dimension[0] - b.rolesIndex.dimension[0]
    })
}

export function sort_metrics(columns) {
    return columns.sort((a, b) => {
        return a.rolesIndex.metrics[0] - b.rolesIndex.metrics[0]
    })
}

export function map_row(row: any, row_index: number, column_names_in_original_order: string[]) {
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