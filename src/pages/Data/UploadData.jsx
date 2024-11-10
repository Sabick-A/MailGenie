import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { parseCsv } from "../../utils/FormData/parseCsv.js";
import databaseService from "../../appwrite/database.js";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import SelectOne from "../../components/FormElements/SelectOne";
import ErrorModal from "../../components/Elements/ErrorModal";
import { updateData } from "../../store/authSlice.js";
import DataTable from "../../components/Data/DataTable.jsx";

function UploadData() {
    const [selectedOption, setSelectedOption] = useState("");
    const { register, handleSubmit, watch } = useForm();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [parsedData, setParsedData] = useState(null);
    const userData = useSelector((state) => state.auth.userData);
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
                response.userId = userData.$id;
                setParsedData(response);
            } else {
                setError("Please upload a CSV file");
            }
        }
        if (selectedOption === "Google Sheets Url") {
            const url = data.gSheetUrl;
            if (url) {
                const spreadsheetId = url.split("/d/")[1].split("/")[0];
                console.log(spreadsheetId);
            } else {
                setError("Please enter a Google Sheets URL");
            }
        }
    };

    const saveData = async () => {
        setError(null);
        try {
            const batch = await databaseService.createBatch(parsedData);

            if (batch) {
                const updatedUserData = { ...userData };
                updatedUserData.batches = updatedUserData.batches
                    ? [...updatedUserData.batches, batch.$id]
                    : [batch.$id];

                const updatedData = await databaseService.updateUser(
                    userData.$id,
                    { batches: updatedUserData.batches }
                );

                dispatch(updateData(updatedData));
                console.log("Data saved successfully");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            setError(error.message);
        }
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
                                        {...register("gSheetUrl")}
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
                        <div className="w-full flex justify-between">
                            <span className="mb-6 text-2xl font-semibold text-black dark:text-white">
                                Data Preview
                            </span>
                            <div className="flex gap-10 mb-5  ">
                                <button
                                    onClick={saveData}
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                >
                                    Save Data
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setParsedData(null)}
                                    className="inline-flex items-center justify-center rounded-md bg-red-400 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                >
                                    Reset Data
                                </button>
                            </div>
                        </div>
                        <DataTable parsedData={parsedData} />
                    </>
                )}
            </div>
        </>
    );
}

export default UploadData;
