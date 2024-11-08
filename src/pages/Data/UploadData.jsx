import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { parseCsv } from "../../utils/FormData/parseCsv.js";

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import SelectOne from "../../components/FormElements/SelectOne";
import ErrorModal from "../../components/Elements/ErrorModal";

function UploadData() {
    const [selectedOption, setSelectedOption] = useState("");
    const { register, handleSubmit, watch } = useForm();
    const [error, setError] = useState("");

    const [parsedData, setParsedData] = useState(null);

    const closeModal = () => {
        setError(null);
    };

    const handleData = async (data) => {
        setError(null);
        if (selectedOption === "CSV File Upload") {
            const file = watch("csvFile")[0];
            if (file) {
                const response = await parseCsv(file);
                response.name = data.name;
                setParsedData(response);
                console.log(parsedData);
            } else {
                setError("Please upload a CSV file");
            }
        }
        console.log(parsedData);
    };
    return (
        <>
            <Breadcrumb pageName="Upload Data" />
            {error && <ErrorModal {...{ error, closeModal }} />}
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <form onSubmit={handleSubmit(handleData)}>
                    <div className=" bg-slate-50 w-11/12">
                        <div className="flex flex-col rounded-sm border w-full border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5 gap-5">
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Give A Name for the Data
                                </label>
                                <input
                                    type="text"
                                    placeholder="Data Name"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("name", {
                                        required: true,
                                    })}
                                />
                            </div>
                            <SelectOne
                                label={"Select Upload Source"}
                                options={[
                                    "CSV File Upload",
                                    "Google Sheets Url",
                                ]}
                                setSelectedOption={setSelectedOption}
                                selectedOption={selectedOption}
                            />
                            {selectedOption === "CSV File Upload" && (
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">
                                        Attach CSV file
                                    </label>
                                    <input
                                        type="file"
                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                        {...register("csvFile")}
                                    />
                                </div>
                            )}

                            {selectedOption === "Google Sheets Url" && (
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">
                                        Enter Google Sheets URL
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Google Sheet Url"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("gsheetUrl")}
                                    />
                                </div>
                            )}
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                            >
                                Fetch Data
                            </button>
                        </div>
                    </div>
                </form>

                {parsedData && (
                    <>
                        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                            Data Preview
                        </h2>
                        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                                {parsedData.name}
                            </h4>
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
                                        {parsedData.errors.map(
                                            (error, index) => (
                                                <li key={index}>
                                                    {error.message} (Row:{" "}
                                                    {error.row})
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default UploadData;
