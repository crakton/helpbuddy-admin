"use client";

import { Button } from "@/components/ui/button";
import { Loader2, HelpCircle } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Service from "@/services/service.service";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import { GoTrash } from "react-icons/go";
import { TbUpload } from "react-icons/tb";
import withAuth from "@/utils/withAuth";

interface PageProps {}

type ServiceForm = {
	name: string;
	category: string;
	subcategory: string;
	price: number;
	description: string;
	duration: number;
	maxParticipants: number;
	isRemoteService: boolean;
	cancellationPolicy: "flexible" | "moderate" | "strict";
	status: "active" | "inactive" | "pending" | "suspended";
	availability: {
		day: string;
		startTime: string;
		endTime: string;
	}[];
	location?: {
		coordinates: [number, number];
	};
	tags: string[];
};

const DAYS_OF_WEEK = [
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
];

const CreateServicePage: FC<PageProps> = ({}) => {
	const loading = useSelector((state: RootState) => state.loading.loading);
	const [categories, setCategories] = useState<Array<any>>([]);
	const [subcategories, setSubcategories] = useState<Array<any>>([]);
	const [serviceImages, setServiceImages] = useState<ExtFile[]>([]);
	const [tagInput, setTagInput] = useState("");

	const [formData, setFormData] = useState<ServiceForm>({
		name: "",
		category: "",
		subcategory: "",
		price: 0,
		description: "",
		duration: 60,
		maxParticipants: 1,
		isRemoteService: false,
		cancellationPolicy: "moderate",
		status: "active",
		availability: DAYS_OF_WEEK.map((day) => ({
			day,
			startTime: "09:00",
			endTime: "17:00",
		})),
		tags: [],
		location: {
			coordinates: [0, 0],
		},
	});

	const serviceApis = new Service();
	const router = useRouter();

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			// const response = await serviceApis.getCategories();
			// setCategories(response.data);
		} catch (error) {
			toast.error("Failed to fetch categories");
		}
	};

	const fetchSubcategories = async (categoryId: string) => {
		try {
			// const response = await serviceApis.getSubcategories(categoryId);
			// setSubcategories(response.data);
		} catch (error) {
			toast.error("Failed to fetch subcategories");
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === "category") {
			fetchSubcategories(value);
		}
	};

	const handleAvailabilityChange = (
		day: string,
		field: "startTime" | "endTime",
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			availability: prev.availability.map((a) =>
				a.day === day ? { ...a, [field]: value } : a
			),
		}));
	};

	const updateFiles = (incommingFiles: ExtFile[]) => {
		if (incommingFiles.length <= 5) {
			setServiceImages(
				incommingFiles.filter((file) => {
					if ((file.size as number) < 500 * 1024) {
						return file;
					} else {
						toast.warn(`The file size of ${file.name} is too large.`);
						return;
					}
				})
			);
		} else {
			toast.warn("Maximum 5 images allowed!");
		}
	};

	const removeFile = (id: string | number | undefined) => {
		setServiceImages(serviceImages.filter((x: ExtFile) => x.id !== id));
	};

	const handleAddTag = () => {
		if (tagInput && !formData.tags.includes(tagInput)) {
			setFormData((prev) => ({
				...prev,
				tags: [...prev.tags, tagInput],
			}));
			setTagInput("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.name ||
			!formData.category ||
			!formData.subcategory ||
			!formData.price ||
			!serviceImages.length
		) {
			toast.error("Please fill all required fields and add at least one image");
			return;
		}

		const formDataToSend = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (key === "availability" || key === "location" || key === "tags") {
				formDataToSend.append(key, JSON.stringify(value));
			} else {
				formDataToSend.append(key, value as string);
			}
		});

		serviceImages.forEach((image) => {
			formDataToSend.append("serviceImages", image.file as Blob);
		});

		try {
			// await serviceApis.createService(formDataToSend);
			// toast.success("Service created successfully");
			// router.push("/services");
		} catch (error) {
			toast.error("Failed to create service");
		}
	};

	return (
		<section className="flex flex-col gap-6 pb-12">
			<div className="flex justify-start items-center pl-4 lg:pl-6 bg-white w-full h-16">
				<h1 className="text-lg lg:pl-0 lg:text-lg leading-3 text-afruna-blue font-bold">
					Create Service
				</h1>
			</div>

			<div className="flex flex-col justify-start p-20 items-start max-w-[85%] ml-8 rounded-xl bg-white w-full">
				<h2 className="font-semibold text-black mb-6">Service Creation</h2>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-8 max-w-[70%] w-full"
				>
					{/* Basic Information */}
					<div className="space-y-6">
						<h3 className="text-sm font-semibold text-gray-900">
							Basic Information
						</h3>

						{/* Service Name */}
						<fieldset className="w-full">
							<label
								htmlFor="name"
								className="text-xs font-semibold text-[#232F3E] leading-6"
							>
								Service Name *
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="form-input w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6] 
                focus-within:shadow-md text-sm font-medium rounded-md"
							/>
						</fieldset>

						{/* Category & Subcategory */}
						<div className="grid grid-cols-2 gap-4">
							<fieldset>
								<label
									htmlFor="category"
									className="text-xs font-semibold text-[#232F3E] leading-6"
								>
									Category *
								</label>
								<select
									name="category"
									value={formData.category}
									onChange={handleChange}
									className="form-select w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6]"
								>
									<option value="">Select Category</option>
									{categories.map((category) => (
										<option key={category._id} value={category._id}>
											{category.name}
										</option>
									))}
								</select>
							</fieldset>

							<fieldset>
								<label
									htmlFor="subcategory"
									className="text-xs font-semibold text-[#232F3E] leading-6"
								>
									Subcategory *
								</label>
								<select
									name="subcategory"
									value={formData.subcategory}
									onChange={handleChange}
									className="form-select w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6]"
								>
									<option value="">Select Subcategory</option>
									{subcategories.map((subcategory) => (
										<option key={subcategory._id} value={subcategory._id}>
											{subcategory.name}
										</option>
									))}
								</select>
							</fieldset>
						</div>

						{/* Price & Duration */}
						<div className="grid grid-cols-2 gap-4">
							<fieldset>
								<label
									htmlFor="price"
									className="text-xs font-semibold text-[#232F3E] leading-6"
								>
									Price *
								</label>
								<input
									type="number"
									name="price"
									value={formData.price}
									onChange={handleChange}
									min="0"
									step="0.01"
									className="form-input w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6]"
								/>
							</fieldset>

							<fieldset>
								<label
									htmlFor="duration"
									className="text-xs font-semibold text-[#232F3E] leading-6"
								>
									Duration (minutes) *
								</label>
								<input
									type="number"
									name="duration"
									value={formData.duration}
									onChange={handleChange}
									min="15"
									step="15"
									className="form-input w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6]"
								/>
							</fieldset>
						</div>
					</div>

					{/* Service Details */}
					<div className="space-y-6">
						<h3 className="text-sm font-semibold text-gray-900">
							Service Details
						</h3>

						{/* Description */}
						<fieldset>
							<label
								htmlFor="description"
								className="text-xs font-semibold text-[#232F3E] leading-6"
							>
								Description
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								rows={4}
								className="form-textarea w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6]"
							/>
						</fieldset>

						{/* Service Type & Policy */}
						<div className="grid grid-cols-2 gap-4">
							<fieldset>
								<label className="text-xs font-semibold text-[#232F3E] leading-6">
									Service Type
								</label>
								<div className="mt-2">
									<label className="inline-flex items-center">
										<input
											type="checkbox"
											name="isRemoteService"
											checked={formData.isRemoteService}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													isRemoteService: e.target.checked,
												}))
											}
											className="form-checkbox"
										/>
										<span className="ml-2 text-sm">Remote Service</span>
									</label>
								</div>
							</fieldset>

							<fieldset>
								<label
									htmlFor="cancellationPolicy"
									className="text-xs font-semibold text-[#232F3E] leading-6"
								>
									Cancellation Policy
								</label>
								<select
									name="cancellationPolicy"
									value={formData.cancellationPolicy}
									onChange={handleChange}
									className="form-select w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6]"
								>
									<option value="flexible">Flexible</option>
									<option value="moderate">Moderate</option>
									<option value="strict">Strict</option>
								</select>
							</fieldset>
						</div>

						{/* Max Participants */}
						<fieldset>
							<label
								htmlFor="maxParticipants"
								className="text-xs font-semibold text-[#232F3E] leading-6"
							>
								Maximum Participants
							</label>
							<input
								type="number"
								name="maxParticipants"
								value={formData.maxParticipants}
								onChange={handleChange}
								min="1"
								className="form-input w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6]"
							/>
						</fieldset>
					</div>

					{/* Images */}
					<div className="space-y-6">
						<h3 className="text-sm font-semibold text-gray-900">
							Service Images
						</h3>

						<Dropzone
							value={serviceImages}
							onChange={updateFiles}
							maxFiles={5}
							maxFileSize={500 * 1024}
							accept="image/*"
							header={false}
							footer={false}
							color="#00AEEF"
						>
							<div className="flex flex-col gap-2 items-center text-slate-900">
								<h3 className="text-[0.9rem] font-semibold text-slate-600">
									Drag and drop images here
								</h3>
								<span className="text-[0.8rem] text-slate-400">
									Maximum 5 images, 500KB each
								</span>
								<button className="my-2 px-8 font-semibold rounded-md gap-2 py-2 flex items-center bg-orange-200 text-black text-xs">
									<TbUpload className="text-lg" />
									Browse
								</button>
							</div>
						</Dropzone>

						{serviceImages.length > 0 && (
							<div className="mt-4 flex flex-wrap gap-4">
								{serviceImages.map((file) => (
									<FileMosaic
										key={file.id}
										{...file}
										onDelete={removeFile}
										info
										preview
										className="w-[30%]"
									/>
								))}
							</div>
						)}
					</div>

					{/* Tags */}
					<div className="space-y-6">
						<h3 className="text-sm font-semibold text-gray-900">Tags</h3>
						<div className="flex flex-col gap-4">
							<div className="flex gap-2">
								<input
									type="text"
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
									placeholder="Add tags"
									className="form-input flex-1 border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6]"
								/>
								<Button
									type="button"
									onClick={handleAddTag}
									className="bg-orange-200 text-black hover:bg-orange-300"
								>
									Add Tag
								</Button>
							</div>
							<div className="flex flex-wrap gap-2">
								{formData.tags.map((tag) => (
									<span
										key={tag}
										className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
									>
										{tag}
										<button
											type="button"
											onClick={() => removeTag(tag)}
											className="text-gray-500 hover:text-gray-700"
										>
											×
										</button>
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Availability Schedule */}
					<div className="space-y-6">
						<h3 className="text-sm font-semibold text-gray-900">
							Availability Schedule
						</h3>
						<div className="space-y-4">
							{formData.availability.map((schedule) => (
								<div
									key={schedule.day}
									className="grid grid-cols-3 gap-4 items-center"
								>
									<span className="capitalize text-sm">{schedule.day}</span>
									<input
										type="time"
										value={schedule.startTime}
										onChange={(e) =>
											handleAvailabilityChange(
												schedule.day,
												"startTime",
												e.target.value
											)
										}
										className="form-input border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6]"
									/>
									<input
										type="time"
										value={schedule.endTime}
										onChange={(e) =>
											handleAvailabilityChange(
												schedule.day,
												"endTime",
												e.target.value
											)
										}
										className="form-input border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6]"
									/>
								</div>
							))}
						</div>
					</div>

					{/* Submit Button */}
					<div className="flex justify-end gap-4">
						<Button
							type="button"
							onClick={() => router.back()}
							variant="outline"
							className="bg-white text-black border-gray-300 hover:bg-gray-50"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={loading}
							className="bg-orange-500 text-white hover:bg-orange-600"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Service"
							)}
						</Button>
					</div>
				</form>
			</div>
		</section>
	);
};

// export default withAuth(CreateServicePage);
export default CreateServicePage;
