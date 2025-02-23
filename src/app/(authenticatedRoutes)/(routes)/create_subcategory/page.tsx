"use client";

import { Button } from "@/components/ui/button";
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import { Loader2 } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { GoTrash } from "react-icons/go";
import { TbUpload } from "react-icons/tb";
import { toast } from "react-toastify";
import { ServiceCategory, serviceManager } from "@/services/service.service";
import { BUCKET_IDS } from "@/constants/bucket_id";
import uploadImageToAppwrite from "@/lib/uploadImageToAppwrite";
import withAuth from "@/lib/withAuth";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { COLLECTION_IDS } from "@/constants/collection_id";

const CreateSubCategoryPage: FC<{}> = () => {
	const [subCatgyName, setSubCatgyName] = useState<string>("");
	const [subCatId, setSubCategoryId] = useState<string>("");
	const [parentId, setParentId] = useState<string>("");
	const [subCatgyDescription, setSubCatgyDescription] = useState("");
	const [files, setFiles] = useState<ExtFile[]>([]);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	// Get categories from Redux store
	const categories = useAppSelector((state) => state.services.categories);

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
					toast.warn(`The file size of ${file.name} is too large.`);
					return false;
				}
			});
		});
	}, []);

	const removeFile = useCallback((id: string | number | undefined) => {
		setFiles((prevFiles) => prevFiles.filter((x: ExtFile) => x.id !== id));
	}, []);

	const submitSubCategory = useCallback(
		async (e: any) => {
			e.preventDefault();
			if (!subCatgyName.trim()) {
				toast.warn("Subcategory name must be provided");
				return;
			}
			if (!parentId) {
				toast.warn("Please select a parent category");
				return;
			}
			if (isSubmitting) return;
			setIsSubmitting(true);

			try {
				let imageUrl = "";
				if (files.length > 0) {
					const file = files[0].file as File;
					const uploadedFile = await uploadImageToAppwrite(
						file,
						BUCKET_IDS.SERVICES_CATEGORY_IMAGES
					);
					imageUrl = uploadedFile.uri;
				}

				const newSubCategory = {
					name: subCatgyName,
					description: subCatgyDescription,
					parentId,
					imageUrl,
				};

				console.log("data", newSubCategory);

				await serviceManager.createCategory(
					newSubCategory as unknown as Omit<
						ServiceCategory,
						"$id" | "createdAt"
					>,
					COLLECTION_IDS.SUB_CATEGORIES
				);

				toast.success("Subcategory created successfully!");
				setSubCatgyName("");
				setParentId("");
				setFiles([]);
			} catch (error) {
				toast.error("Failed to create subcategory.");
				console.error(error);
			} finally {
				setIsSubmitting(false);
			}
		},
		[subCatgyDescription, subCatgyName, parentId, files, isSubmitting]
	);

	return (
		<section className="flex flex-col gap-6 pb-12">
			<div className="flex justify-start items-center pl-4 lg:pl-6 bg-white w-full h-16">
				<h1 className="text-lg lg:pl-0 lg:text-lg leading-3 text-afruna-blue font-bold">
					{subCatId ? "Edit Subcategory" : "Create Subcategory"}
				</h1>
			</div>
			<div className="flex flex-col justify-start p-20 items-start max-w-[85%] ml-8 rounded-xl bg-white w-full">
				<h2 className="font-semibold text-black mb-6">
					{subCatId ? "Edit the Subcategory" : "Subcategory creation"}
				</h2>
				<form
					onSubmit={submitSubCategory}
					className="flex flex-col gap-8 max-w-[70%] w-full"
				>
					<fieldset className="flex w-full flex-col gap-1">
						<div className="form-control w-full mb-[22px] flex flex-col gap-2">
							<label className="text-sm font-semibold">
								Parent Category <span className="text-[red]">*</span>
							</label>
							<select
								className="w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6] 
                                focus-within:shadow-md text-sm font-medium rounded-md placeholder:text-gray-400 
                                focus-visible:shadow-md transition duration-300 sm:text-[0.8rem] sm:leading-6"
								value={parentId}
								onChange={(e) => setParentId(e.target.value)}
							>
								<option value="">Select Parent Category</option>
								{categories.map((cat) => (
									<option key={cat.$id} value={cat.$id}>
										{cat.name}
									</option>
								))}
							</select>
						</div>
					</fieldset>

					<fieldset className="w-full">
						<label
							htmlFor="subcategory_name"
							className="text-xs font-semibold text-[#232F3E] leading-6"
						>
							Subcategory Name
						</label>
						<div className="mt-1 flex justify-center items-center gap-2">
							<input
								name="name"
								type="text"
								onChange={(e) => setSubCatgyName(e.target.value)}
								value={subCatgyName}
								placeholder="Enter Subcategory Name"
								autoComplete="subcategory_name"
								className="form-input w-full border-[2px] px-3 py-2.5 focus-within:border-[#FFDBB6] 
                                focus-within:shadow-md text-sm font-medium rounded-md placeholder:text-gray-400 
                                focus-visible:shadow-md transition duration-300 sm:text-[0.8rem] sm:leading-6"
							/>
						</div>
					</fieldset>

					<fieldset className="w-full">
						<label
							htmlFor="subcategory_description"
							className="text-xs font-semibold text-[#232F3E] leading-6"
						>
							Subcategory Description
						</label>
						<div className="mt-1 flex justify-center items-center gap-2">
							<input
								name="description"
								type="text"
								onChange={(e) => setSubCatgyDescription(e.target.value)}
								value={subCatgyDescription}
								placeholder="Enter Subcategory Description"
								autoComplete="subcategory_description"
								className="form-input w-full border-[2px] px-3 py-2.5 focus-within:border-[#FFDBB6] 
                                focus-within:shadow-md text-sm font-medium rounded-md placeholder:text-gray-400 
                                focus-visible:shadow-md transition duration-300 sm:text-[0.8rem] sm:leading-6"
							/>
						</div>
					</fieldset>

					<fieldset>
						<label className="text-xs font-semibold text-[#232F3E] leading-6">
							Subcategory Image
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
					</fieldset>

					<div className="flex justify-end items-center gap-4 mt-6">
						<Button
							type="submit"
							variant="primary"
							className="w-[7rem] h-[2.5rem]"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<Loader2 className="h-6 w-6 animate-spin text-white" />
							) : (
								"Submit"
							)}
						</Button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default withAuth(CreateSubCategoryPage);
