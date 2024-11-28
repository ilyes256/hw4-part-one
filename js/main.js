/* 
        Name: Ilyes Abdellatif Bouazza
        Email : ilyesabdellatif_bouazza@student.uml.edu
        University: UMass Lowell
        Class: GUI 1 Fall 2024
        Homework 4: Using the jQuery Plugin/UI with Your Dynamic Table
        PART 1: Validation Plugin
        FILE : main.js 
        */



// constants class,all memmbers are static so we can have them without an object
class CONSTANTS {
    //min and max values for rows and columns
    static MIN_COLUMN_VALUE = -100;
    static MAX_COLUMN_VALUE = 100;
    static MIN_ROW_VALUE = -100;
    static MAX_ROW_VALUE = 100;

    //error messages
    static EMPTY_ERROR_MESSAGE = "Please fill out this field."
    static NOT_INTEGER_ERROR_MESSAGE = "Please enter a valid integer."
    static NOT_IN_RANGE_ERROR_MESSAGE = `Value must be between ${CONSTANTS.MIN_ROW_VALUE} and ${CONSTANTS.MAX_ROW_VALUE}`

}

// Using this class we can have our object that is constructed using min and columns, min and max rows
class Multiplication_Table {
    // a constructor that has four parmeters min and max columns
    //once we gell the four parmeters we calculate the size of the row and column
    //Finally we fill our matrix with data based on the four parameters
    //to generate data for the matrix,we use populate_matrix function 
    constructor(min_column, max_column, min_row, max_row) {

        // Swap min_column and max_column if needed
        if (min_column > max_column) [min_column, max_column] = [max_column, min_column];

        // Swap min_row and max_row if needed
        if (min_row > max_row) [min_row, max_row] = [max_row, min_row];

        this.min_column = min_column;
        this.max_column = max_column;
        this.min_row = min_row;
        this.max_row = max_row;
        this.row_size = this.max_row - this.min_row + 1;
        this.column_size = this.max_column - this.min_column + 2;
        this.matrix = this.populate_matrix();
    }
    //this function will return the multiolication table which is a 2d array
    populate_matrix() {
        let matrix = [];
        //create header row
        let header_row = [];
        //matrix[0][0] is the sign of multiplication X
        header_row.push('X');
        //fill the first row with column values from min to max
        for (let j = this.min_column; j <= this.max_column; j++) {
            header_row.push(j);
        }
        //push the first row with column values from max to min
        matrix.push(header_row);

        //we fill out the rest of rows by multiplying each column by the first column in the same row 
        //we do the same for all the rows from min to max values
        //once we fill the rows we push it back into the matrix
        for (let i = this.min_row; i <= this.max_row; i++) {

            let row = [];
            row.push(i);
            for (let j = this.min_column; j <= this.max_column; j++) {
                row.push(i * j);

            }
            matrix.push(row);
        }
        //we return the 2d matrix
        return matrix;
    }

    // a function to display the multiplcation table into the console for testing purpuses
    print_matrix() {
        let r = this.row_size;
        let c = this.column_size;
        console.log(r);
        console.log(c);
        for (let i = 0; i < this.row_size; i++) {
            let rowOutput = ''; // Reset for each row
            for (let j = 0; j < this.column_size; j++) {
                rowOutput += `${this.matrix[i][j]} \t`; // Access matrix
            }
            console.log(rowOutput.trim()); // Trim and print the row
        }
    }
    //a getter for the matrix
    get_matrix() { return this.matrix; }

}


//a class only for UI that has two static methods 
class HTML_DISPLAY {


    //onstructs an HTML table from a 2D array (matrix), using the first row as the table header
    //and alternating row styles with CSS classes for each row. The first column in each row 
    //is used as a header cell, creating a structured and styled table.
    //Begin with an empty HTML string and add the `<table>` opening tag.
    //Loop through each row of the `matrix`:
    //If it’s the first row (header row):
    //Open `<thead><tr>`.
    //Loop through each cell in the header row, wrapping each cell in `<th>` tags.
    //Close `</tr></thead>` and open `<tbody>` for the main content rows.
    //For all other rows:
    //Determine a CSS class based on the row index (even/odd for alternate styling).
    //Add a new `<tr>` with the CSS class.
    //For each cell in the row:
    //If it’s the first cell, wrap it in `<th>` to designate it as a row header.
    //Otherwise, wrap each cell in `<td>`.
    //Close the `<tr>` tag for the row.
    //Close the `</tbody></table>` tags.
    //Return the constructed HTML string.

    static construct_table(matrix) {
        let html = "";
        html += "<table>";

        for (let i = 0; i < matrix.length; i++) {
            // If it's the first row, treat it as a header
            if (i === 0) {
                html += "<thead><tr>";
                for (let j = 0; j < matrix[i].length; j++) {
                    html += `<th>${matrix[i][j]}</th>`;
                }
                html += "</tr></thead><tbody>";
            } else {
                // Add class based on the row index for alternation
                const rowClass = i % 2 === 0 ? "even-row" : "odd-row";
                html += `<tr class="${rowClass}">`; // Add the row with the class
                for (let j = 0; j < matrix[i].length; j++) {
                    if (j === 0) {
                        // First column as header
                        html += `<th>${matrix[i][j]}</th>`;
                    } else {
                        html += `<td>${matrix[i][j]}</td>`;
                    }
                }
                html += "</tr>";
            }
        }

        html += "</tbody></table>";
        return html;
    }

    //Checks if the container element is valid:
    //If `container` is `null` or `undefined`, logs an error message to the console
    //and exits the function to prevent further execution.
    //If the container is valid, sets its `innerHTML` property to `html_content`,
    //effectively updating the container’s displayed content with the provided HTML.

    static display_content(container, html_content) {
        if (!container) {
            console.error("Container not found");
            return;
        }
        container.innerHTML = html_content;
    }

}







// Add a custom validation method for integer validation
$.validator.addMethod("integer", function (value, element) {
    return /^-?\d+$/.test(value); // // Regular expression to allow both positive and negative integers
});



$(document).ready(function () {
    // Initialize jQuery Validation for the form with ID 'form'
    $("#form").validate({
        // Define validation rules for each input field
        rules: {
            
            minColumn: {
                required: true,// Field is required
                integer: true,// Must be an integer (custom validation method)
                range: [CONSTANTS.MIN_COLUMN_VALUE, CONSTANTS.MAX_COLUMN_VALUE] // Must be within the specified range
            },
            maxColumn: {
                required: true,
                integer: true,
                range: [CONSTANTS.MIN_COLUMN_VALUE, CONSTANTS.MAX_COLUMN_VALUE]
            },
            minRow: {
                required: true,
                integer: true,
                range: [CONSTANTS.MIN_ROW_VALUE, CONSTANTS.MAX_ROW_VALUE]
            },
            maxRow: {
                required: true,
                integer: true,
                range: [CONSTANTS.MIN_ROW_VALUE, CONSTANTS.MAX_ROW_VALUE]
            }
        },
        // Custom error messages for each field
        messages: {
            
            minColumn: {
                required: CONSTANTS.EMPTY_ERROR_MESSAGE, // Error message for empty field
                integer: CONSTANTS.NOT_INTEGER_ERROR_MESSAGE,// Error message for non-integer value
                range: CONSTANTS.NOT_IN_RANGE_ERROR_MESSAGE// Error message for out-of-range value
            },
            maxColumn: {
                required: CONSTANTS.EMPTY_ERROR_MESSAGE,
                integer: CONSTANTS.NOT_INTEGER_ERROR_MESSAGE,
                range: CONSTANTS.NOT_IN_RANGE_ERROR_MESSAGE
            },
            minRow: {
                required: CONSTANTS.EMPTY_ERROR_MESSAGE,
                integer: CONSTANTS.NOT_INTEGER_ERROR_MESSAGE,
                range: CONSTANTS.NOT_IN_RANGE_ERROR_MESSAGE
            },
            maxRow: {
                required: CONSTANTS.EMPTY_ERROR_MESSAGE,
                integer: CONSTANTS.NOT_INTEGER_ERROR_MESSAGE,
                range: CONSTANTS.NOT_IN_RANGE_ERROR_MESSAGE
            }
        },
        // Add styling to invalid fields
        highlight: function (element) {
            $(element).addClass("invalid-input"); // Adds .invalid-input styling to invalid fields
        },
        // Remove styling from valid fields
        unhighlight: function (element) {
            $(element).removeClass("invalid-input"); // Removes .invalid-input styling when valid
        },


    });






    // Generate button action
    $("#generate-btn").click(function () {
        // Parse the values from the input fields
        const min_col_value = parseInt($("#min-column").val(), 10);// Minimum column value
        const max_col_value = parseInt($("#max-column").val(), 10);// Maximum column value
        const min_row_value = parseInt($("#min-row").val(), 10);// Minimum row value
        const max_row_value = parseInt($("#max-row").val(), 10);// Maximum row value

        // Check if the form is valid before proceeding
        if ($("#form").valid()) {
            //create multiplication table
            let mul_table = new Multiplication_Table(min_col_value, max_col_value, min_row_value, max_row_value)
            // Display the generated multiplication table in the container with ID 'container-table'
            HTML_DISPLAY.display_content(document.getElementById("container-table"), HTML_DISPLAY.construct_table(mul_table.get_matrix()));
        }
        else {
            // Log a message if the form is not valid
            console.log("form is not valid")
        }
    });


});





// Sources :
//I used the sources provided by the professor in the hw4 pdf posted on blackboard
//https://jqueryvalidation.org/documentation/

