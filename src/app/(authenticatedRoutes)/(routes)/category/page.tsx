"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BsPlus } from "react-icons/bs";
import { buttonVariants } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import withAuth from "@/lib/withAuth";
import Modal from "@/components/Modal";
import { ServiceCategory, serviceManager } from "@/services/service.service";
import { Models } from "appwrite";
import EditCategoryForm from "@/components/EditCategoryForm";
import { setCategories, setSubCategories } from "@/features/serviceSlice";
import { COLLECTION_IDS } from "@/constants/collection_id";
import CategoryTable from "@/components/CategoryTable";
import { useToast } from "react-toast-plus";

const CategoryPage: FC = () => {
	const { addToast: toast } = useToast();
	const { categories, subCategories } = useAppSelector(
		(state) => state.services
	);
	const [selectedItem, setSelectedItem] = useState<{
		item: Models.Document;
		type: "category" | "subcategory";
	} | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useAppDispatch();

	// Memoize toast function to prevent unnecessary re-renders
	const showError = useCallback(
		(message: string) => {
			toast.error(message);
		},
		[toast]
	);

	const showSuccess = useCallback(
		(message: string) => {
			toast.success(message);
		},
		[toast]
	);

	// Remove toast from fetchData dependencies
	const fetchData = useCallback(async () => {
		try {
			const { categories } = await serviceManager.getCategories();
			const { subCategories } = await serviceManager.getSubCategories();
			dispatch(setCategories(categories as any));
			dispatch(setSubCategories(subCategories as any));
		} catch (error) {
			showError("Failed to fetch data");
		}
	}, [dispatch, showError]); // More stable dependencies

	// Only fetch data on mount
	useEffect(() => {
		fetchData();
	}, []); // Empty dependency array

	const handleEdit = useCallback(
		(item: Models.Document, type: "category" | "subcategory") => {
			setSelectedItem({ item, type });
			setIsModalOpen(true);
		},
		[]
	);

	const handleDelete = useCallback(
		async (id: string, type: "category" | "subcategory") => {
			try {
				const collectionId =
					type === "category"
						? COLLECTION_IDS.CATEGORIES
						: COLLECTION_IDS.SUB_CATEGORIES;

				await serviceManager.deleteCategory(id, collectionId);
				showSuccess(`${type} deleted successfully`);
				await fetchData();
			} catch (error) {
				showError(`Failed to delete ${type}`);
			}
		},
		[fetchData, showError, showSuccess]
	);

	const handleSubmit = useCallback(
		async (data: any) => {
			try {
				if (!selectedItem) return;

				const collectionId =
					selectedItem.type === "category"
						? COLLECTION_IDS.CATEGORIES
						: COLLECTION_IDS.SUB_CATEGORIES;

				await serviceManager.editCategory(
					data as Partial<ServiceCategory>,
					selectedItem.item.$id,
					collectionId
				);

				showSuccess("Updated successfully");
				setIsModalOpen(false);
				await fetchData();
			} catch (error) {
				showError("Failed to update");
			}
		},
		[selectedItem, fetchData, showSuccess, showError]
	);

	return (
		<section className="flex flex-col gap-7 pb-12">
			<div className="flex justify-between items-center pl-4 lg:pr-16 lg:pl-6 bg-white w-full h-16">
				<div className="flex items-center gap-2">
					<h1 className="text-lg font-semibold text-afruna-blue">Services</h1>
					<h1 className="text-lg font-semibold text-gray-300">Categories</h1>
				</div>
				<div className="flex items-center gap-4">
					<Link
						href="/create_category"
						className={buttonVariants({ variant: "greenbutton" })}
					>
						<BsPlus className="text-xl" /> Add Category
					</Link>
					<Link
						href="/create_subcategory"
						className={buttonVariants({ variant: "greenbutton" })}
					>
						<BsPlus className="text-xl" /> Add Subcategory
					</Link>
				</div>
			</div>

			<div className="px-6 xl:pr-96 w-full">
				<CategoryTable
					categories={categories as any}
					subCategories={subCategories as any}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			</div>

			{isModalOpen && selectedItem && (
				<Modal
					height
					onClose={() => setIsModalOpen(false)}
					isOpen={isModalOpen}
				>
					<EditCategoryForm
						selectedService={selectedItem.item}
						type={selectedItem.type}
						onSubmit={handleSubmit}
					/>
				</Modal>
			)}
		</section>
	);
};

export default withAuth(CategoryPage);
