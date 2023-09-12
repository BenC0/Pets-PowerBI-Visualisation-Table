import { applyCustomFormat } from "./utils"

export function create_empty_table_container(method, target) {
    var template = document.createElement('template');
    template.innerHTML = `<div class="pets-table-container"></div>`;
    var tempEl = template.content.firstChild;
    var node = target.insertAdjacentElement(method, tempEl);
    return node
}

export function create_data_html(columns, rows, sorted_by = null, sort_direction = "asc") {
    let table_layout = columns.map(column => column.queryName)
    let table_shape = {
        rows: rows.length,
        columns: table_layout.length
    }

    let thead_html = `<thead><tr>`
    columns.forEach(column => {
        let is_sorted = column.queryName == sorted_by
        let sort_dir = is_sorted ? sort_direction : "" 
        thead_html += `<td
            dimension=${!!column.roles.dimension}
            metric=${!!column.roles.metrics}
            is_sorted=${is_sorted}
            sort_direction=${sort_dir}
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

export function sort_rows_by(rows, column, direction="asc") {
    console.log({
        event: "Sorting Rows By",
        rows, column, direction,
    })
    let sorted_rows = rows.sort((rowA, rowB) => {
        let rowATargetCell = rowA.values.filter(cell => cell.column_reference == column).pop()
        let rowAValue = rowATargetCell.value
        
        let rowBTargetCell = rowB.values.filter(cell => cell.column_reference == column).pop()
        let rowBValue = rowBTargetCell.value

        if (typeof rowAValue == "string" && typeof rowBValue == "string") {
            let output = 0;
            rowAValue = rowAValue.toLowerCase()
            rowBValue = rowBValue.toLowerCase()
            if(rowAValue > rowBValue){
                if (direction == "desc") {
                    output = 1;
                }
                if (direction == "asc") {
                    output = -1;
                }
            } 
            if(rowAValue < rowBValue){
                if (direction == "desc") {
                    output = -1;
                }
                if (direction == "asc") {
                    output = 1;
                }
            }
            return output;
        } else {
            if (direction == "desc") {
                return rowAValue - rowBValue
            }
            if (direction == "asc") {
                return rowBValue - rowAValue
            }
        }
    })
    console.log({
        rows,
        sorted_rows,
    })
    return sorted_rows
}

export function clear_table(table) {
    table.querySelectorAll("*").forEach(el => el.remove());
}

export function create_and_insert_table(target, columns, rows, sorted_by = null, sort_direction = "asc") {
    // Clear the current table
    clear_table(target)
    // Create and insert new table
    let table_html = create_data_html(columns, rows, sorted_by, sort_direction)
    target.insertAdjacentHTML("beforeend", table_html)
    apply_table_header_sort_listeners(target, columns, rows)
}

export function apply_table_header_sort_listeners(table, columns, rows) {
    let table_headers = table.querySelectorAll("thead td")
    table_headers.forEach(header => {
        header.addEventListener("click", e => {
            let header_text = header.textContent
            let header_details = columns.filter(column => column.displayName == header_text).pop()
            let is_already_sorted = header.getAttribute("is_sorted") == "true"
            let previous_sort_direction = header.getAttribute("sort_direction")
            let direction = "desc"
            if ( is_already_sorted && header.getAttribute("sort_direction") == "desc") {
                direction = "asc"
            } 
            let sorted_rows = sort_rows_by(rows, header_details.queryName, direction)
            create_and_insert_table(table, columns, sorted_rows, header_details.queryName, direction)
        })
    })
}