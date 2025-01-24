import { Account, Client, Databases, Storage } from "appwrite";

const client = new Client();
client
	.setProject(process.env.APPWRITE_PROJECT_ID || "")
	.setEndpointRealtime(process.env.APPWRITE_ENDPOINT || "");

// Initialize Appwrite Account
const account = new Account(client);
// Initialize Appwrite Databases
const databases = new Databases(client);
// Initialize Appwrite Storage
const storage = new Storage(client);

const appwrite = {
	account,
	databases,
	storage,
};

export default appwrite;
