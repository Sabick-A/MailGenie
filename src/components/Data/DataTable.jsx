import React, { useState } from "react";

function DataTable({ parsedData }) {
    const [showError, setShowError] = useState(false);
    return (
        <>
            <div className="rounded-sm border w-11/12 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    {parsedData.name}
                </h2>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Company Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Products
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Others
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {parsedData.data.map((dataRow, index) => (
                                <tr
                                    key={index}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        {dataRow.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {dataRow.companyName}
                                    </td>
                                    <td className="px-6 py-4">{dataRow.email}</td>
                                    <td className="px-6 py-4">
                                        {dataRow.location}
                                    </td>
                                    <td className="px-6 py-4">
                                        {dataRow.products}
                                    </td>
                                    <td className="px-6 py-4">
                                        {dataRow.others.length > 0
                                            ? dataRow.others.join(", ")
                                            : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {parsedData.errors.length > 0 && (
                    <div className="m-4 text-red-500 flex justify-start">
                        {!showError ? (
                            <button onClick={() => setShowError(true)}>
                                Show Errors While Parsing
                            </button>
                        ) : (
                            <div className="flex justify-end items-center">
                                
                                <ul className="px-5">
                                    {parsedData.errors.map((error, index) => (
                                        <li key={index}>
                                            {error.message} (Row: {error.row})
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={()=>setShowError(false)} className="font-bold text-l border border-red  px-2.5 rounded-3xl">X</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default DataTable;
