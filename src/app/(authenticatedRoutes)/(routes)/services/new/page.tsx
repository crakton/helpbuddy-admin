"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import { TbUpload } from "react-icons/tb";
import withAuth from "@/lib/withAuth";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { serviceManager } from "@/services/service.service";
import {
	addService,
	IServiceCategory,
	setCategories,
	setSubCategories,
} from "@/features/serviceSlice";
import { useToast } from "react-toast-plus";
import { IService } from "@/interfaces/service.interface";

const DAYS_OF_WEEK = [
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
];

interface FormState {
	name: string;
	providerId: string;
	categoryId: string;
	subCategoryId: string;
	price: number;
	description: string;
	duration: number;
	maxParticipants: number;
	isRemoteService: boolean;
	cancellationPolicy: string;
	status: string;
	availability: {
		day: string;
		startTime: string;
		endTime: string;
	}[];
	tags: string[];
	location: {
		coordinates: [number, number];
	};
}

const initialFormState: FormState = {
	name: "",
	providerId: "",
	categoryId: "",
	subCategoryId: "",
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
};
const CreateServicePage = () => {
	const { addToast: toast } = useToast();
	const { user } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { categories, subCategories, loading } = useAppSelector(
		(state) => state.services
	);

	const [formData, setFormData] = useState(initialFormState);
	const [serviceImages, setServiceImages] = useState<ExtFile[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [filteredSubCategories, setFilteredSubCategories] = useState<
		IServiceCategory[]
	>([]);

	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const { categories: fetchedCategories } =
					await serviceManager.getCategories();
				const { subCategories: fetchedSubCategories } =
					await serviceManager.getSubCategories();

				dispatch(
					setCategories(fetchedCategories as unknown as IServiceCategory[])
				);
				dispatch(
					setSubCategories(
						fetchedSubCategories as unknown as IServiceCategory[]
					)
				);
			} catch (error) {
				toast.error("Failed to fetch categories");
			}
		};

		fetchInitialData();
	}, [dispatch]);

	useEffect(() => {
		if (formData.categoryId) {
			const filtered = subCategories.filter(
				(subCat) => subCat.parentId === formData.categoryId && subCat.isActive
			);
			setFilteredSubCategories(filtered);

			// Reset subcategory selection if current selection is not in filtered list
			if (!filtered.find((subCat) => subCat.$id === formData.subCategoryId)) {
				setFormData((prev) => ({
					...prev,
					subCategoryId: "",
				}));
			}
		} else {
			setFilteredSubCategories([]);
			setFormData((prev) => ({
				...prev,
				subCategoryId: "",
			}));
		}
	}, [formData.categoryId, formData.subCategoryId, subCategories]);

	// Memoized handlers
	const handleChange = useCallback(
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>
		) => {
			const { name, value } = e.target;
			setFormData((prev) => ({ ...prev, [name]: value }));
		},
		[]
	);

	const handleAvailabilityChange = useCallback(
		(day: string, field: "startTime" | "endTime", value: string) => {
			setFormData((prev) => ({
				...prev,
				availability: prev.availability.map((a) =>
					a.day === day ? { ...a, [field]: value } : a
				),
			}));
		},
		[]
	);

	// Memoized availability schedule component
	const AvailabilitySchedule = useMemo(
		() => (
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
							<div className="col-span-2 grid grid-cols-2 gap-4">
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
									className="form-input border-2 px-3 py-2.5 rounded-md focus:border-orange-200 focus:ring-1 focus:ring-orange-200"
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
									className="form-input border-2 px-3 py-2.5 rounded-md focus:border-orange-200 focus:ring-1 focus:ring-orange-200"
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		),
		[formData.availability, handleAvailabilityChange]
	);

	// Memoized validation
	const validateForm = useCallback(() => {
		console.info("formdata", formData);
		if (
			!formData.name ||
			!formData.categoryId ||
			!formData.price ||
			serviceImages.length === 0
		) {
			return {
				isValid: false,
				message: "Please fill all required fields and add at least one image",
			};
		}

		// Validate availability times
		const invalidSchedule = formData.availability.some(
			(schedule) =>
				!schedule.startTime ||
				!schedule.endTime ||
				schedule.startTime >= schedule.endTime
		);
		if (invalidSchedule) {
			return {
				isValid: false,
				message:
					"Please ensure all availability times are valid and end time is after start time",
			};
		}

		return { isValid: true, message: "" };
	}, [formData, serviceImages.length]);

	const updateFiles = useCallback((incommingFiles: ExtFile[]) => {
		if (incommingFiles.length > 5) {
			toast.warning("Maximum 5 images allowed!");
			return;
		}

		const validFiles = incommingFiles.filter((file) => {
			if ((file.size as number) > 500 * 1024) {
				toast.warning(`The file ${file.name} exceeds 500KB limit`);
				return false;
			}
			return true;
		});

		setServiceImages(validFiles);
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (isSubmitting) return;

			const { isValid, message } = validateForm();
			if (!isValid) {
				toast.warning(message);
				return;
			}

			setIsSubmitting(true);
			try {
				const files = serviceImages.map((img) => img.file as File);
				const result = await serviceManager.createService(
					{
						...formData,
						location: formData.location.coordinates.map((e) => e.toString()),
						providerId: user?.$id,
					} as unknown as Omit<IService, "$id" | "createdAt">,
					files
				);

				dispatch(addService(result as unknown as IService));
				toast.success("Service created successfully");
				router.push("/services");
			} catch (error) {
				toast.error("Failed to create service");
			} finally {
				setIsSubmitting(false);
			}
		},
		[dispatch, formData, isSubmitting, router, serviceImages, validateForm]
	);

	// Memoized tag handlers
	const handleAddTag = useCallback(() => {
		if (tagInput && !formData.tags.includes(tagInput)) {
			setFormData((prev) => ({
				...prev,
				tags: [...prev.tags, tagInput],
			}));
			setTagInput("");
		}
	}, [tagInput, formData.tags]);

	const removeTag = useCallback((tagToRemove: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}));
	}, []);

	// Memoized file removal
	const removeFile = useCallback((id: string | number | undefined) => {
		setServiceImages((prev) => prev.filter((x) => x.id !== id));
	}, []);

	// Memoized category options
	const categoryOptions = useMemo(
		() =>
			categories
				.filter((cat) => cat.isActive)
				.map((cat) => ({
					value: cat.$id as string,
					label: cat.name,
				})),
		[categories]
	);

	// Memoized subcategory options
	const subcategoryOptions = useMemo(
		() =>
			filteredSubCategories.map((subCat) => ({
				value: subCat.$id as string,
				label: subCat.name,
			})),
		[filteredSubCategories]
	);

	// Add price validation
	const handlePriceChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = parseFloat(e.target.value);
			setFormData((prev) => ({
				...prev,
				price: isNaN(value) ? 0 : value,
			}));
		},
		[]
	);

	return (
		<section className="flex flex-col gap-6 pb-12">
			<div className="flex justify-start items-center pl-4 lg:pl-6 bg-white w-full h-16">
				<h1 className="text-lg lg:text-lg leading-3 text-afruna-blue font-bold">
					Create Service
				</h1>
			</div>

			<div className="flex flex-col justify-start p-20 items-start max-w-[85%] ml-8 rounded-xl bg-white w-full">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-8 max-w-[70%] w-full"
				>
					{/* Basic Information */}
					<div className="space-y-6">
						<h3 className="text-sm font-semibold text-gray-900">
							Basic Information
						</h3>
						<fieldset className="gap-3 space-y-3">
							<div>Service Name</div>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Service Name *"
								className="w-full p-2 border rounded"
							/>
						</fieldset>
						{/* Set Categories and Sub categories */}
						<div className="grid grid-cols-2 gap-4">
							<fieldset className="gap-3 space-y-3">
								<div>Category Name</div>
								<select
									name="categoryId"
									value={formData.categoryId}
									onChange={handleChange}
									className="w-full p-2 border rounded"
								>
									<option value="">Select Category *</option>
									{categoryOptions.map(({ value, label }) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</select>
							</fieldset>

							<fieldset className="gap-3 space-y-3">
								<div>Sub Category</div>
								<select
									name="subCategoryId"
									value={formData.subCategoryId}
									onChange={handleChange}
									className="w-full p-2 border rounded"
									disabled={!formData.categoryId}
								>
									<option value="">
										{formData.categoryId
											? "Select Subcategory"
											: "Please select a category first"}
									</option>
									{subcategoryOptions.map(({ value, label }) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</select>
							</fieldset>
						</div>

						{/* Add Price Input */}
						<fieldset className="gap-3 space-y-3">
							<div>Price</div>
							<input
								type="number"
								name="price"
								value={formData.price}
								onChange={handlePriceChange}
								placeholder="Price *"
								min="0"
								step="0.01"
								className="w-full p-2 border rounded"
							/>
						</fieldset>

						{/* Add Description */}
						<fieldset className="gap-3 space-y-3">
							<div>Description</div>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Service Description"
								rows={4}
								className="w-full p-2 border rounded"
							/>
						</fieldset>

						{/* Duration and Max Participants */}
						<div className="grid grid-cols-2 gap-4">
							<fieldset className="gap-3 space-y-3">
								<div>Duration</div>
								<input
									type="number"
									name="duration"
									value={formData.duration}
									onChange={handleChange}
									placeholder="Duration (minutes)"
									min="1"
									className="w-full p-2 border rounded"
								/>
							</fieldset>
							<fieldset className="gap-3 space-y-3">
								<div>Max Participants</div>
								<input
									type="number"
									name="maxParticipants"
									value={formData.maxParticipants}
									onChange={handleChange}
									placeholder="Max Participants"
									min="1"
									className="w-full p-2 border rounded"
								/>
							</fieldset>
						</div>

						{/* Service Type and Cancellation Policy */}
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
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
								<label>Remote Service</label>
							</div>

							<select
								name="cancellationPolicy"
								value={formData.cancellationPolicy}
								onChange={handleChange}
								className="w-full p-2 border rounded"
							>
								<option value="flexible">Flexible</option>
								<option value="moderate">Moderate</option>
								<option value="strict">Strict</option>
							</select>
						</div>

						{/* Service Status */}
						<fieldset className="gap-3 space-y-3">
							<div>Service Status</div>
							<select
								name="status"
								value={formData.status}
								onChange={handleChange}
								className="w-full p-2 border rounded"
							>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
								<option value="draft">Draft</option>
							</select>
						</fieldset>

						{/* Location Coordinates */}
						<div className="grid grid-cols-2 gap-4">
							<fieldset className="gap-3 space-y-3">
								<div>Longitude</div>
								<input
									type="number"
									step="0.000001"
									value={formData.location.coordinates[0]}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											location: {
												coordinates: [
													parseFloat(e.target.value),
													prev.location.coordinates[1],
												],
											},
										}))
									}
									placeholder="Longitude"
									className="w-full p-2 border rounded"
								/>
							</fieldset>
							<fieldset className="gap-3 space-y-3">
								<div>Latitude</div>
								<input
									type="number"
									step="0.000001"
									value={formData.location.coordinates[1]}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											location: {
												coordinates: [
													prev.location.coordinates[0],
													parseFloat(e.target.value),
												],
											},
										}))
									}
									placeholder="Latitude"
									className="w-full p-2 border rounded"
								/>
							</fieldset>
						</div>

						{/* Tags Input */}
						<div className="space-y-2">
							<div className="flex gap-2">
								<input
									type="text"
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									onKeyPress={(e) =>
										e.key === "Enter" && (e.preventDefault(), handleAddTag())
									}
									placeholder="Add tags"
									className="w-full p-2 border rounded"
								/>
								<Button
									type="button"
									onClick={handleAddTag}
									className="bg-gray-200 hover:bg-gray-300"
								>
									Add
								</Button>
							</div>
							<div className="flex flex-wrap gap-2">
								{formData.tags.map((tag) => (
									<span
										key={tag}
										className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
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

					{/* Service Images */}
					<div className="space-y-4">
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
							className="border-2 border-dashed p-4 rounded-lg"
						>
							<div className="flex flex-col items-center gap-2">
								<TbUpload className="text-2xl" />
								<span className="text-sm">
									Drop images here or click to browse
								</span>
							</div>
						</Dropzone>

						<div className="grid grid-cols-3 gap-4">
							{serviceImages.map((file) => (
								<FileMosaic
									key={file.id}
									{...file}
									onDelete={removeFile}
									info
									preview
								/>
							))}
						</div>
					</div>

					{/* Availability Schedule */}
					{AvailabilitySchedule}

					{/* Submit Button */}
					<div className="flex justify-end gap-4 mt-8">
						<Button
							type="button"
							onClick={() => router.back()}
							variant="outline"
							className="bg-white hover:bg-gray-50"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-orange-500 text-white hover:bg-orange-600"
						>
							{isSubmitting ? (
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

export default withAuth(CreateServicePage);
