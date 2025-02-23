import appwrite from "@/appwrite-config";
import { ID } from "appwrite";

export default async function uploadImageToAppwrite(
	file: File,
	BUCKET_ID: string
) {
	try {
		const fileId = ID.unique();
		const upload = await appwrite.storage.createFile(BUCKET_ID, fileId, file);

		// Get the file view URL
		const fileUrl = appwrite.storage.getFileView(BUCKET_ID, fileId);

		console.log("url of the image: ", fileUrl);
		console.log("id of the image: ", fileId);

		return { uri: fileUrl.toString(), id: fileId };
	} catch (error) {
		console.error("Error uploading image:", error);
		throw new Error("Failed to upload image");
	}
}
