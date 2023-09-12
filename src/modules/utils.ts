export function applyCustomFormat(number: number, formatString: string) {
    // Split the format string into individual formats based on semicolons
    const formats = formatString.split(";");

    // Define variables to hold the formatted value and the chosen format
    let formattedValue = "";
    let chosenFormat = "";

    // Determine which format to use based on the value of the number
    if (number < 0 && formats.length > 1) {
        // If the number is negative and a negative format is available
        chosenFormat = formats[1];
        number = -number; // Make the number positive for formatting
    } else if (number === 0 && formats.length > 2) {
        // If the number is zero and a zero format is available
        chosenFormat = formats[2];
    } else if (formats.length > 0) {
        // Use the positive format by default
        chosenFormat = formats[0];
    }

    // Apply the chosen format to the number
    formattedValue = number.toLocaleString(undefined, parseFormatString(chosenFormat));

    return formattedValue;
}

export function parseFormatString(formatString: string) {
    // Define a function to parse each part of the format string
    const parsePart = (part: string) => {
        if (part.endsWith("%")) {
            return {
                style: "percent",
                minimumFractionDigits: 2
            };
        } if (part.indexOf("£") != -1) {
            return {
                style: "currency",
                currency: 'GBP',
                minimumFractionDigits: 2
            };
        } else {
            return {
                minimumFractionDigits: 2
            };
        }
    };

    // Split the format string into individual parts based on commas
    const parts = formatString.split(",");

    // Parse each part and combine them into a single options object
    const options = parts.map(parsePart).reduce((acc, curr) => Object.assign(acc, curr), {});

    return options;
}