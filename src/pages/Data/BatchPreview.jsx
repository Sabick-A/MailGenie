import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { useParams } from "react-router-dom";
import databaseService from "../../appwrite/database";
import { DataTable } from "simple-datatables";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../store/authSlice";
import Loader from "../../common/Loader2";
import DataModal from "../../components/Elements/DataModal";

function BatchPreview() {
    const { batchIndex } = useParams();
    const index = parseInt(batchIndex, 10);
    const [response, setResponse] = useState(null);
    const userData = useSelector((state) => state.auth.userData);
    const [batchData, setBatchData] = useState(userData.batches[index]);
    const [showResponse, setShowResponse] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (
            document.getElementById("pagination-table") &&
            typeof DataTable !== "undefined"
        ) {
            const dataTable = new DataTable("#pagination-table", {
                paging: true,
                perPage: 5,
                perPageSelect: [5, 10, 15, 20, 25],
                sortable: true,
            });
        }
    }, []);

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleClick = async (dataId) => {
        setLoading(true);
        try {
            // Remove the batch with the specified batchId from userData.batches
            const updatedData = userData.batches[index].data.filter(
                (data) => data.$id !== dataId
            );
            // Create a new batches array with the updated batch data
            const updatedBatches = userData.batches.map((batch, idx) => {
                if (idx === index) {
                    return { ...batch, data: updatedData };
                }
                return batch;
            });

            const updatedUserData = { ...userData, batches: updatedBatches };

            // Update the user data in the database
            await databaseService.deleteData(dataId);
            dispatch(updateData(updatedUserData));

            // Set the updated batch data
            setBatchData((prevBatchData) => ({
                ...prevBatchData,
                data: updatedData,
            }));

            // Reinitialize the DataTable to apply changes
            const dataTableElement =
                document.getElementById("pagination-table");
            if (dataTableElement && typeof DataTable !== "undefined") {
                new DataTable(dataTableElement, {
                    paging: true,
                    perPage: 5,
                    perPageSelect: [5, 10, 15, 20, 25],
                    sortable: true,
                });
            }
        } catch (error) {
            console.error("Error updating user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowResponse = (dataId) => {
        const email = batchData.data.find(
            (data) => data.$id === dataId
        ).response;
        setResponse(email);
        setShowResponse(true);
    };
    return (
        <>
            <Breadcrumb pageName={`${batchData.name} Batch Preview`} />
            {loading && <Loader />}

            {showResponse && (
                <DataModal
                    data={response}
                    closeModal={() => setShowResponse(false)}
                />
            )}
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl my-5  text-black-2 dark:text-white font-satoshi font-bold">
                        Prompt
                    </h2>
                    <button
                        type="button"
                        className="py-3 px-10 me-10 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                        Start Sending
                    </button>
                </div>

                <p className="bg-white p-10 rounded-2xl dark:text-white dark:bg-boxdark text-black-2">
                    {batchData.prompt}
                </p>
            </div>

            <div>
                <h2 className="text-xl my-5 dark:text-white  text-black-2 font-satoshi font-bold">
                    Data Available
                </h2>
                <table id="pagination-table">
                    <thead>
                        <tr>
                            <th>
                                <span className="flex items-center">
                                    Name
                                    <svg
                                        className="w-4 h-4 ms-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                                        />
                                    </svg>
                                </span>
                            </th>
                            <th>
                                <span className="flex items-center">
                                    Company Name
                                    <svg
                                        className="w-4 h-4 ms-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                                        />
                                    </svg>
                                </span>
                            </th>
                            <th>
                                <span className="flex items-center">
                                    Email
                                    <svg
                                        className="w-4 h-4 ms-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                                        />
                                    </svg>
                                </span>
                            </th>
                            <th>
                                <span className="flex items-center">
                                    Status
                                    <svg
                                        className="w-4 h-4 ms-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                                        />
                                    </svg>
                                </span>
                            </th>
                            <th>
                                <span className="flex items-center">
                                    Created At
                                    <svg
                                        className="w-4 h-4 ms-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                                        />
                                    </svg>
                                </span>
                            </th>
                            <th>
                                <span className="flex items-center">
                                    Email Preview
                                </span>
                            </th>
                            <th>
                                <span className="flex items-center">
                                    Delete Data
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {batchData.data.map((ele) => (
                            <tr key={ele.$id}>
                                <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {ele.name}
                                </td>
                                <td>{ele.companyName}</td>
                                <td>{ele.email}</td>
                                <td>{ele.status}</td>
                                <td>{formatDate(ele.$createdAt)}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={(e) =>
                                            handleShowResponse(
                                                e.currentTarget.getAttribute(
                                                    "data-id"
                                                )
                                            )
                                        }
                                        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        data-id={ele.$id}
                                    >
                                        Open
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={(e) =>
                                            handleClick(
                                                e.currentTarget.getAttribute(
                                                    "data-id"
                                                )
                                            )
                                        }
                                        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        data-id={ele.$id}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default BatchPreview;
