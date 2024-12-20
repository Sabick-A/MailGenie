import { Client, Databases, Query, ID } from "appwrite";
import conf from "../conf/appwriteConf";

export class DatabaseService {
    client = new Client();
    database;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.database = new Databases(this.client);
    }
    async createUser({ name, email,picture }) {
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUsersCollectionId,
                ID.unique(),
                {
                    name,
                    email,
                    picture,
                }
            );
        } catch (error) {
            console.log(`Appwrite serive :: createUser :: error`, error);
            throw error;
        }
    }

    async getUser(userEmail) {
        try {
            const users = await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUsersCollectionId,
                [Query.equal('email', userEmail)]
            );
            return users.documents[0];
        } catch (error) {
            console.log(`Appwrite serive :: getUser :: error`, error);
            return null;
        }
    }

    async updateUser(userId, data) {
        try {
            return await this.database.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUsersCollectionId,
                userId,
                data
            );
        } catch (error) {
            console.log(`Appwrite serive :: updateUser :: error`, error);
            throw error;
        }
    }

    async createBatch(data) {
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteBatchCollectionId,
                ID.unique(),
                {
                    name: data.name,
                    data: data.data,
                    prompt: data.prompt,
                }
            );
        } catch (error) {
            console.log(`Appwrite serive :: createBatch :: error`, error);
        }
    }

    async deleteBatch(batchId) {
        try {
            const batchData=await this.getBatch(batchId);

            await Promise.all(batchData.data.map(async (data) => {
                await this.deleteData(data.$id);
            }));

            return await this.database.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteBatchCollectionId,
                batchId
            );
        } catch (error) {
            console.log(`Appwrite serive :: deleteBatch :: error`, error);
        }
    }

    async getBatch(batchId) {
        try {
            return await this.database.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteBatchCollectionId,
                batchId
            );
        } catch (error) {
            console.log(`Appwrite serive :: getBatch :: error`, error);
        }
    }


    async deleteData(dataId) {
        try {
            return await this.database.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteDataCollectionId,
                dataId
            );
        } catch (error) {
            console.log(`Appwrite serive :: deleteData :: error`, error);
        }
    }
    // async createData({title,slug,content,featuredImage,status,username,userId,summary}){
    //     try {
    //         return await this.database.createDocument(
    //             conf.appwriteDatabaseId,
    //             conf.appwriteCollectionId,
    //             slug,
    //             {
    //                 title,
    //                 content,
    //                 featuredImage,
    //                 status,
    //                 userId,
    //                 username,
    //                 summary,
    //             }
    //         )
    //     } catch (error) {
    //         console.log(`Appwrite serive :: createPost :: error`,error);
    //         throw error;
    //     }
    // }

    // async updatePost(slug,{title,content,featuredImage,status,summary,username}){
    //     try {
    //         return await this.database.updateDocument(
    //             conf.appwriteDatabaseId,
    //             conf.appwriteCollectionId,
    //             slug,
    //             {
    //                 title,
    //                 content,
    //                 featuredImage,
    //                 status,
    //                 summary,
    //                 username,
    //             }
    //         )
    //     } catch (error) {
    //         console.log(`Appwrite serive :: updatePost :: error`,error);
    //         throw error;
    //     }
    // }

    // async deletePost(slug){
    //     try {
    //         return await this.database.deleteDocument(
    //             conf.appwriteDatabaseId,
    //             conf.appwriteCollectionId,
    //             slug
    //         )
    //     } catch (error) {
    //         console.log(`Appwrite serive :: deletePost :: error`,error);
    //         throw error;
    //     }
    // }

    // async getPost(slug){
    //     try {
    //         return await this.database.getDocument(
    //             conf.appwriteDatabaseId,
    //             conf.appwriteCollectionId,
    //             slug
    //         )
    //     } catch (error) {
    //         console.log(`Appwrite serive :: getPost :: error`,error);
    //         throw error;
    //     }
    // }

    // async getPosts(queries=[Query.equal('status','active')]){
    //     try {
    //         return await this.database.listDocuments(
    //             conf.appwriteDatabaseId,
    //             conf.appwriteCollectionId,
    //             queries
    //         )
    //     } catch (error) {
    //         console.log(`Appwrite serive :: getPosts :: error`,error);
    //         throw error;
    //     }
    // }
}

const databaseService = new DatabaseService();

export default databaseService;
