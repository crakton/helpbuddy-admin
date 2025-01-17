"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Service from "@/services/service.service";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface PageProps {}

type ServiceForm = {
	name: string;
	category: string;
	subcategory: string;
	price: number;
	description: string;
};

const CreateServicePage: FC<PageProps> = ({}) => {
	const loading = useSelector((state: RootState) => state.loading.loading);
	const [categories, setCategories] = useState<Array<any>>([]);
	const [subcategories, setSubcategories] = useState<Array<any>>([]);
	const [formData, setFormData] = useState<ServiceForm>({
		name: "",
		category: "",
		subcategory: "",
		price: 0,
		description: "",
	});

	const serviceApis = new Service();
	const router = useRouter();

	useEffect(() => {
		// Fetch categories on component mount
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.name ||
			!formData.category ||
			!formData.subcategory ||
			!formData.price
		) {
			toast.error("Please fill all required fields");
			return;
		}

		try {
			// await serviceApis.createService(formData);
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
					{/* Service Name */}
					<fieldset className="w-full">
						<label
							htmlFor="name"
							className="text-xs font-semibold text-[#232F3E] leading-6"
						>
							Service Name
						</label>
						<div className="mt-1">
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Enter Service Name"
								className="form-input w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6] 
                focus-within:shadow-md text-sm font-medium rounded-md placeholder:text-gray-400 
                focus-visible:shadow-md transition duration-300 sm:text-[0.8rem] sm:leading-6"
							/>
						</div>
					</fieldset>

					{/* Category Selection */}
					<fieldset className="w-full">
						<label
							htmlFor="category"
							className="text-xs font-semibold text-[#232F3E] leading-6"
						>
							Category
						</label>
						<div className="mt-1">
							<select
								name="category"
								value={formData.category}
								onChange={handleChange}
								className="form-select w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6] 
                focus-within:shadow-md text-sm font-medium rounded-md text-gray-700
                focus-visible:shadow-md transition duration-300 sm:text-[0.8rem] sm:leading-6"
							>
								<option value="">Select Category</option>
								{categories.map((category) => (
									<option key={category._id} value={category._id}>
										{category.name}
									</option>
								))}
							</select>
						</div>
					</fieldset>

					{/* Subcategory Selection */}
					<fieldset className="w-full">
						<label
							htmlFor="subcategory"
							className="text-xs font-semibold text-[#232F3E] leading-6"
						>
							Subcategory
						</label>
						<div className="mt-1">
							<select
								name="subcategory"
								value={formData.subcategory}
								onChange={handleChange}
								className="form-select w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6] 
                focus-within:shadow-md text-sm font-medium rounded-md text-gray-700
                focus-visible:shadow-md transition duration-300 sm:text-[0.8rem] sm:leading-6"
							>
								<option value="">Select Subcategory</option>
								{subcategories.map((subcategory) => (
									<option key={subcategory._id} value={subcategory._id}>
										{subcategory.name}
									</option>
								))}
							</select>
						</div>
					</fieldset>

					{/* Price Input */}
					<fieldset className="w-full">
						<label
							htmlFor="price"
							className="text-xs font-semibold text-[#232F3E] leading-6"
						>
							Price
						</label>
						<div className="mt-1">
							<input
								type="number"
								name="price"
								value={formData.price}
								onChange={handleChange}
								placeholder="Enter Price"
								min="0"
								step="0.01"
								className="form-input w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6] 
                focus-within:shadow-md text-sm font-medium rounded-md placeholder:text-gray-400 
                focus-visible:shadow-md transition duration-300 sm:text-[0.8rem] sm:leading-6"
							/>
						</div>
					</fieldset>

					{/* Description Textarea */}
					<fieldset className="w-full">
						<label
							htmlFor="description"
							className="text-xs font-semibold text-[#232F3E] leading-6"
						>
							Description
						</label>
						<div className="mt-1">
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Enter Service Description"
								rows={4}
								className="form-textarea w-full border-[2px] px-3 py-2.5 focus-within:border-[2px] focus-within:border-[#FFDBB6] 
                focus-within:shadow-md text-sm font-medium rounded-md placeholder:text-gray-400 
                focus-visible:shadow-md transition duration-300 sm:text-[0.8rem] sm:leading-6"
							/>
						</div>
					</fieldset>

					{/* Submit Button */}
					<div className="flex justify-end items-center gap-4 mt-6">
						<Button
							type="submit"
							variant="primary"
							className="w-[7rem] h-[2.5rem]"
						>
							{loading ? (
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

export default CreateServicePage;
