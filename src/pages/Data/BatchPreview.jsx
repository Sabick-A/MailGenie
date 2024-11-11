import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useParams } from "react-router-dom";
import databaseService from "../../appwrite/database";
import { DataTable } from "simple-datatables";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../store/authSlice";
import Loader from "../../common/Loader2";
function Preview() {
    const { batchIndex } = useParams();
    const index = parseInt(batchIndex, 10);

    const userData = useSelector((state) => state.auth.userData);
    const [batchData, setBatchData] = useState(userData.batches[index]);

    const [loading,setLoading]=useState(false);
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
    }, [batchData]);

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
            console.log("started deleting");
            // Remove the batch with the specified batchId from userData.batches
            const updatedData = userData.batches[index].data.filter(
                (data) => data.$id !== dataId
            );
            // Create a new batches array with the updated batch data
            const updatedBatches = userData.batches.map((batch, index) => {
                if (index === index) {
                    return { ...batch, data: updatedData };
                }
                return batch;
            });

            const updatedUserData = { ...userData, batches: updatedBatches };

            // Update the user data in the database
            await databaseService.deleteData(dataId);
            dispatch(updateData(updatedUserData));

            // Set the updated batch data
            setBatchData({ ...batchData, data: updatedData });
            console.log("done deleting");
        } catch (error) {
            console.error("Error updating user data:", error);
        } finally{
            setLoading(false);
        }
    };

    return (
        <>
            <Breadcrumb pageName={`${batchData.name} Batch Preview`} />
            {loading && <Loader/>}
            <div>
                <h2 className="text-xl my-5 text-black-2 font-satoshi font-bold">
                    Prompt
                </h2>
                <p className="bg-white p-10 rounded-2xl text-black-2">
                    {batchData.prompt}
                </p>
            </div>

            <div>
                <h2 className="text-xl my-5 text-black-2 font-satoshi font-bold">
                    Data Available
                </h2>
                <table id="pagination-table">
                    <thead>
                        <tr>
                            <th>
                                <span class="flex items-center">
                                    Name
                                    <svg
                                        class="w-4 h-4 ms-1"
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
                                <span class="flex items-center">
                                    Company Name
                                    <svg
                                        class="w-4 h-4 ms-1"
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
                                <span class="flex items-center">
                                    Email
                                    <svg
                                        class="w-4 h-4 ms-1"
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
                                <span class="flex items-center">
                                    Status
                                    <svg
                                        class="w-4 h-4 ms-1"
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
                                <span class="flex items-center">
                                    Created At
                                    <svg
                                        class="w-4 h-4 ms-1"
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
                                <span class="flex items-center">
                                    Open Details
                                </span>
                            </th>
                            <th>
                                <span class="flex items-center">
                                    Delete Batch
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {batchData.data.map((ele, index) => (
                            <tr key={index}>
                                <td class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {ele.name}
                                </td>
                                <td>{ele.companyName}</td>
                                <td>{ele.email}</td>
                                <td>{ele.status}</td>
                                <td>{formatDate(ele.$createdAt)}</td>
                                <td>
                                    <Link to={`/data/preview`}>
                                        <button
                                            type="button"
                                            class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        >
                                            Open
                                        </button>
                                    </Link>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleClick(ele.$id)}
                                        class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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

export default Preview;
