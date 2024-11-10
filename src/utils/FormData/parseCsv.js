import Papa from "papaparse";

function parseData(inputData) {
    // Initialize result object
    const result = {
        data: [],
        errors: inputData.errors || [],
    };

    // Extract the field names from the meta section
    const fields = inputData.meta.fields || [];

    // Define standard column names for matching
    const standardColumns = {
        name: ["name", "Name", "Full Name"],
        companyName: [
            "Company name",
            "companyName",
            "Organization name",
            "company name",
            "Company Name",
            "company Name",
            "Company",
            "company",
        ],
        email: ["email", "Email", "Email Address", "email address"],
        location: [
            "location",
            "Location",
            "Location of the company",
            "location of the company",
            "Location of the Company",
            "location of the Company",
        ],
        products: [
            "products",
            "Products",
            "Products Offered",
            "Products of the company",
            "products of the company",
            "Products of the Company",
            "products of the Company",
        ],
    };

    // Check if the email column is present
    const emailColumnPresent = fields.some((field) =>
        standardColumns.email.includes(field)
    );
    if (!emailColumnPresent) {
        throw new Error("Email column is missing in the CSV file");
    }

    // Iterate over each data item
    inputData.data.forEach((row) => {
        const parsedRow = {
            name: "",
            companyName: "",
            email: "",
            location: "",
            products: "",
            others: [],
        };

        // Check for mismatched or missing fields and process the row
        fields.forEach((fieldName) => {
            const value = row[fieldName] || "";

            // Check if the field matches any of the standard column names
            let matched = false;
            for (let [key, names] of Object.entries(standardColumns)) {
                if (names.includes(fieldName)) {
                    parsedRow[key] = value;
                    matched = true;
                    break;
                }
            }

            // If the field doesn't match, convert it to "Column Name: Value" format and add to others
            if (!matched && value) {
                parsedRow.others.push(JSON.stringify({ [fieldName]: value }));
            }
        });

        // Set companyName as name if name is missing
        if (!parsedRow.name) {
            parsedRow.name = parsedRow.companyName;
        }

        // Check if all fields are empty
        const isEmptyRow =
            !parsedRow.name &&
            !parsedRow.companyName &&
            !parsedRow.email &&
            !parsedRow.location &&
            !parsedRow.products &&
            parsedRow.others.length === 0;

        // Push the parsed row into the result data array only if it's not empty
        if (!isEmptyRow) {
            result.data.push(parsedRow);
        }
    });
    return result;
}

const parseCsv = (file) => {
    return new Promise((resolve, reject) => {
        try {
            Papa.parse(file, {
                header: true,
                complete: function (results) {
                    try {
                        resolve(parseData(results));
                    } catch (error) {
                        reject(error);
                    }
                },
                error: (error) => {
                    console.error(
                        "UploadData.jsx :: parseCsv :: Papa.parse :: error",
                        error
                    );
                    reject(error);
                },
            });
        } catch (error) {
            console.error(
                "UploadData.jsx :: parseCsv :: tryCatch :: error",
                error
            );
            reject(error);
        }
    });
};

export { parseCsv };
