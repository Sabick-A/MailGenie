import { Client, Account, ID, OAuthProvider } from "appwrite";
import conf from "../conf/appwriteConf";

export class AuthServices{
    client = new Client()
    account

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account=new Account(this.client);
    }

    async createAccount({email,password,name}){
        try {
            const currUser=await this.account.create(ID.unique(), email, password, name);
            if(currUser){
                //calling the login method to authenticate the user;
                console.log("done");
                return this.login({email,password});
                
            }else{
                throw new Error("User creation failed");
            }
        } catch (error) {
            console.log(`Appwrite serive :: createAccount :: error`,error);
            throw error;
        }
    }

    async createAuthToken({baseUrl,fullUrl}){
        try {
            return await this.account.createOAuth2Session(
                OAuthProvider.Google,
                baseUrl,
                fullUrl,
                [
                    'openid',
                    'https://www.googleapis.com/auth/userinfo.email',    // Access primary email address
                    'https://www.googleapis.com/auth/userinfo.profile',  // Access personal profile information
                    'https://mail.google.com/',                          // Full access to Gmail (read, write, delete)
                    'https://www.googleapis.com/auth/gmail.modify',      // Read, compose, and send Gmail emails
                    'https://www.googleapis.com/auth/gmail.compose',     // Manage drafts and send Gmail emails
                    'https://www.googleapis.com/auth/gmail.addons.current.action.compose', // Manage drafts and send emails in add-ons
                    'https://www.googleapis.com/auth/gmail.addons.current.message.action',  // Access emails when add-on is in use
                    'https://www.googleapis.com/auth/gmail.readonly',    // Read-only access to Gmail
                    'https://www.googleapis.com/auth/gmail.metadata',    // View email metadata like labels and headers
                    'https://www.googleapis.com/auth/gmail.insert',      // Add emails into Gmail mailbox
                    'https://www.googleapis.com/auth/gmail.addons.current.message.metadata', // View metadata when add-on is active
                    'https://www.googleapis.com/auth/gmail.addons.current.message.readonly', // Read-only access to messages in add-ons
                    'https://www.googleapis.com/auth/gmail.send',        // Send Gmail emails
                    'https://www.googleapis.com/auth/gmail.labels'       // View and edit Gmail labels
                ]
            )
        } catch (error) {
            console.log(`Appwrite serive :: createAuthToken :: error`,error);
            throw error;
        }
    }

    async createSession({userId,secret}){
        try {
            return await this.account.createSession(userId,secret);
        } catch (error) {
            console.log(`Appwrite serive :: createSession :: error`,error);
            throw error;
        }
    }

    async login({email,password}){
        try {
            return await this.account.createEmailPasswordSession(email,password);
        } catch (error) {
            console.log(`Appwrite serive :: login :: error`,error);
            throw error;
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log(`Appwrite serive :: getCurrentUser :: error`,error);
            throw error;
        }
    }

    async getUserDetails(userId){
        try {
            return await this.account.get(userId);
        } catch (error) {
            console.log(`Appwrite serive :: getUSerDetails :: error`,error);
            throw error;
        }
    }

    async logout(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log(`Appwrite serive :: logout :: error`,error);
            throw error;
        }
    }

    async getSession(){
        try {
            return await this.account.getSession('current');
        } catch (error) {
            console.log(`Appwrite serive :: getSession :: error`,error);
            throw error;
        }
    }
}

const authService=new AuthServices();

export default authService;


// // Provider information
// console.log(session.provider);
// console.log(session.providerUid);
// console.log(session.providerAccessToken);