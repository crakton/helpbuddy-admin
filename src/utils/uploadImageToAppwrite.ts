import { Client, ID, Storage } from "appwrite";

export const client = new Client();
client.setProject("678e8b3f003e4494c068");

// Initialize Appwrite Storage
const storage = new Storage(client);

export default async function uploadImageToAppwrite(
	file: File,
	BUCKET_ID: string
) {
	try {
		const fileId = ID.unique();
		const upload = await storage.createFile(BUCKET_ID, fileId, file);

		// Get the file view URL
		const fileUrl = storage.getFileView(BUCKET_ID, fileId);

		console.log("url of the image: ", fileUrl);
		console.log("id of the image: ", fileId);

		return { uri: fileUrl.toString(), id: fileId };
	} catch (error) {
		console.error("Error uploading image:", error);
		throw new Error("Failed to upload image");
	}
}
