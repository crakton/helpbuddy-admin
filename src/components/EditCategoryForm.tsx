import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { GoTrash } from "react-icons/go";
import { TbUpload } from "react-icons/tb";
import { toast } from "react-toastify";
import { Models } from "appwrite";

interface EditCategoryFormProps {
	selectedService: Models.Document;
	type: "category" | "subcategory";
	onSubmit: (data: any) => Promise<void>;
}

const EditCategoryForm: FC<EditCategoryFormProps> = ({
	selectedService,
	type,
	onSubmit,
}) => {
	const [name, setName] = useState(selectedService.name || "");
	const [description, setDescription] = useState(
		selectedService.description || ""
	);
	const [files, setFiles] = useState<ExtFile[]>([
		{ imageUrl: selectedService.imageUrl } as ExtFile,
	]);

	const updateFiles = useCallback((incomingFiles: ExtFile[]) => {
		setFiles((prevFiles) => {
			if (incomingFiles.length + prevFiles.length > 1) {
				toast.warn("Maximum files reached!");
				return prevFiles;
			}
			return incomingFiles.filter((file) => {
				if ((file.size as number) < 500 * 1024) {
					return file;
				} else {
					toast.warning(`The file size of ${file.name} is too large.`);
					return false;
				}
			});
		});
	}, []);

	const removeFile = useCallback((id: string | number | undefined) => {
		setFiles((prevFiles) => prevFiles.filter((x: ExtFile) => x.id !== id));
	}, []);

	const handleSubmit = useCallback(
		async (event: React.FormEvent) => {
			event.preventDefault();
			try {
				const formData = {
					name,
					description,
					// Maintain existing relationships when editing
					...(type === "subcategory" && {
						categoryId: selectedService.categoryId,
					}),
				};
				await onSubmit(formData);
			} catch (error) {
				toast.error("Failed to save changes");
			}
		},
		[name, description, type, selectedService.categoryId, onSubmit]
	);

	return (
		<div className="max-w-lg mx-auto px-3 py-6">
			<h2 className="text-xl font-semibold mb-4">
				Edit {type === "category" ? "Category" : "Subcategory"}:{" "}
				{selectedService.name}
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Name Field */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						{type === "category" ? "Category" : "Subcategory"} Name
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
						placeholder={`Enter ${type} name`}
						required
					/>
				</div>

				{/* Image Upload - Commented out as per original, but updated for future use */}
				{/* <fieldset>
          <label className="text-xs font-semibold text-[#232F3E] leading-6">
            {type === "category" ? "Category" : "Subcategory"} Image
          </label>
          <div className="mt-2 flex flex-col gap-4 w-full">
            <Dropzone
              value={files}
              onChange={updateFiles}
              maxFiles={1}
              maxFileSize={500 * 1024}
              type="image/*"
            >
              <div className="flex flex-col gap-2 items-center text-slate-900">
                <h3 className="text-[0.9rem] font-semibold text-slate-600">
                  Drag and drop files here
                </h3>
                <span className="text-[0.8rem] text-slate-400">
                  The file size limit is 500KB
                </span>
                <button className="my-2 px-8 font-semibold rounded-md gap-2 py-2 flex items-center bg-orange-200 text-black text-xs">
                  <TbUpload className="text-lg" />
                  Browse
                </button>
              </div>
            </Dropzone>
            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4 w-full">
                {files.map((file) => (
                  <div className="relative" key={file.id}>
                    <FileMosaic {...file} preview />
                    <span
                      onClick={() => removeFile(file.id)}
                      className="absolute cursor-pointer text-lg top-2 right-2 text-afruna-blue"
                    >
                      <GoTrash className="hover:text-rose-500 transition-all" />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </fieldset> */}

				{/* Description Field */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Description
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
						placeholder="Enter description"
						rows={4}
						required
					/>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
				>
					Save Changes
				</button>
			</form>
		</div>
	);
};

export default EditCategoryForm;
