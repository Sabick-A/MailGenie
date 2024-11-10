const appwriteConf={
    appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
    appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    appwriteDataCollectionId: import.meta.env.VITE_APPWRITE_DATA_COLLECTION_ID,
    appwriteBatchCollectionId: import.meta.env.VITE_APPWRITE_BATCH_COLLECTION_ID,
    appwriteUsersCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
    appwriteBucket1Id: import.meta.env.VITE_APPWRITE_BUCKET_ID,
}

export default appwriteConf;