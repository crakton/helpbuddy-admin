import React, { FC, useCallback, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash } from "lucide-react";
import { Models } from "appwrite";

interface Category {
	$id: string;
	name: string;
	description: string;
}

interface SubCategory {
	$id: string;
	name: string;
	description: string;
	parentId: string;
}

interface CategoryTableProps {
	categories: Category[];
	subCategories: SubCategory[];
	onEdit: (item: Models.Document, type: "category" | "subcategory") => void;
	onDelete: (id: string, type: "category" | "subcategory") => void;
}

const CategoryTable: FC<CategoryTableProps> = ({
	categories,
	subCategories,
	onEdit,
	onDelete,
}) => {
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);

	const toggleCategory = useCallback((categoryId: string) => {
		setExpandedCategories((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(categoryId)) {
				newSet.delete(categoryId);
			} else {
				newSet.add(categoryId);
			}
			return newSet;
		});
	}, []);

	const getSubcategoriesForCategory = (categoryId: string) => {
		return subCategories.filter(
			(subCategory) => subCategory.parentId === categoryId
		);
	};

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							ID
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Name
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Description
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{categories.map((category) => (
						<React.Fragment key={category.$id}>
							<tr className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap">
									<button
										onClick={() => toggleCategory(category.$id)}
										className="mr-2 inline-flex items-center"
									>
										{expandedCategories.has(category.$id) ? (
											<ChevronDown className="h-4 w-4" />
										) : (
											<ChevronRight className="h-4 w-4" />
										)}
									</button>
									#{category.$id.slice(-5)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
								<td className="px-6 py-4">{category.description}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<button
										onClick={() =>
											onEdit(category as unknown as Models.Document, "category")
										}
										className="text-blue-500 hover:text-blue-700 mr-2"
									>
										<Pencil className="h-4 w-4" />
									</button>
									<button
										onClick={() => onDelete(category.$id, "category")}
										className="text-red-500 hover:text-red-700"
									>
										<Trash className="h-4 w-4" />
									</button>
								</td>
							</tr>
							{expandedCategories.has(category.$id) &&
								getSubcategoriesForCategory(category.$id).map((subcategory) => (
									<tr
										key={subcategory.$id}
										className="bg-gray-50 hover:bg-gray-100"
									>
										<td className="px-6 py-4 whitespace-nowrap pl-12">
											#{subcategory.$id.slice(-5)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{subcategory.name}
										</td>
										<td className="px-6 py-4">{subcategory.description}</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<button
												onClick={() =>
													onEdit(
														subcategory as unknown as Models.Document,
														"subcategory"
													)
												}
												className="text-blue-500 hover:text-blue-700 mr-2"
											>
												<Pencil className="h-4 w-4" />
											</button>
											<button
												onClick={() => onDelete(subcategory.$id, "subcategory")}
												className="text-red-500 hover:text-red-700"
											>
												<Trash className="h-4 w-4" />
											</button>
										</td>
									</tr>
								))}
						</React.Fragment>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default CategoryTable;
