import { Models } from "appwrite";
import { useState, useEffect, useMemo } from "react";
export default function useSearchUsers<
	T extends Models.User<Models.Preferences>
>({
	data = [],
}: {
	data: T[];
}): {
	searchInput: string;
	setSearchInput: (value: string) => void;
	sortingType: "ascending" | "descending";
	setSortingType: (value: "ascending" | "descending") => void;
	searchResult: T[];
} {
	const [searchInput, setSearchInput] = useState<string>("");
	const [sortingType, setSortingType] = useState<"ascending" | "descending">(
		"ascending"
	);
	const [searchResult, setSearchResult] = useState<T[]>([]);

	const filteredUsers = useMemo(() => {
		if (!searchInput) {
			return data;
		}
		const normalizedSearchInput = searchInput.toLowerCase();

		const filtered = data.filter((user) => {
			const normalizedUserFullName = user.name.toLowerCase();
			const normalizedUserRole = user.prefs.role.toLowerCase();
			return (
				normalizedUserFullName.includes(normalizedSearchInput) ||
				normalizedUserRole.includes(normalizedSearchInput)
			);
		});
		return filtered;
	}, [searchInput, data]);
	const filteredData = filteredUsers;

	useEffect(() => {
		if (sortingType.toLowerCase()) {
			// Sorting logic
			const sortedData = sorting(filteredData, sortingType);
			setSearchResult(sortedData);
		} else {
			setSearchResult(filteredData);
		}
	}, [filteredUsers, sortingType, filteredData]);

	return {
		searchInput,
		setSearchInput,
		sortingType,
		setSortingType,
		searchResult,
	};
}

function sorting<T extends Models.User<Models.Preferences>>(
	items: T[],
	sortingType: "ascending" | "descending"
) {
	return items.slice().sort((a, b) => {
		// Create a copy using slice()
		const multiplier = sortingType.toLowerCase() === "ascending" ? 1 : -1;
		return (
			multiplier *
			(new Date(a.$createdAt as string).getTime() -
				new Date(b.$createdAt as string).getTime())
		);
	});
}
