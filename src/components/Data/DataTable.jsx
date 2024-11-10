import React from "react";

function DataTable({parsedData}) {
    return (
        <>
            <div className="rounded-sm border w-11/12 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    {parsedData.name}
                </h2>
                <div className="flex flex-col overflow-x-auto">
                    <div className="min-w-full grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Name
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Company Name
                            </h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Email
                            </h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Location
                            </h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Products
                            </h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Others
                            </h5>
                        </div>
                    </div>

                    {parsedData.data.map((dataRow, index) => (
                        <div
                            className={`min-w-full grid grid-cols-3 sm:grid-cols-6 ${
                                index === parsedData.data.length - 1
                                    ? ""
                                    : "border-b border-stroke dark:border-strokedark"
                            }`}
                            key={index}
                        >
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">
                                    {dataRow.name || "N/A"}
                                </p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">
                                    {dataRow.companyName || "N/A"}
                                </p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">
                                    {dataRow.email || "N/A"}
                                </p>
                            </div>
                            <div className="hidden sm:flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">
                                    {dataRow.location || "N/A"}
                                </p>
                            </div>
                            <div className="hidden sm:flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">
                                    {dataRow.products || "N/A"}
                                </p>
                            </div>
                            <div className="hidden sm:flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">
                                    {dataRow.others.length > 0
                                        ? dataRow.others.join(", ")
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {parsedData.errors.length > 0 && (
                    <div className="my-4 text-red-500">
                        <h5 className="text-lg font-medium">
                            Errors Occured While Parsing:
                        </h5>
                        <ul className="px-10">
                            {parsedData.errors.map((error, index) => (
                                <li key={index}>
                                    {error.message} (Row: {error.row})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default DataTable;
