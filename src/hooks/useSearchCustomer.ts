import { Models } from "appwrite";
import { useState, useEffect, useMemo } from "react";
export default function useSearchCustomer<
	T extends Models.User<Models.Preferences>
>({ data = [] }: { data: T[] }) {
	const [searchCustomerInput, setSearchCustomerInput] = useState<string>("");
	const [searchCustomerResult, setSearchCustomerResult] = useState<T[]>([]);

	const filteredUsers = useMemo(() => {
		if (!searchCustomerInput) {
			return data;
		}
		const normalizedSearchInput = searchCustomerInput.toLowerCase();
		const filtered = data.filter((user) => {
			const normalizedUserFullName = user.name.toLowerCase();
			const normalizedUserNumber = `${user.phone}`;
			return (
				normalizedUserFullName.includes(normalizedSearchInput) ||
				normalizedUserNumber.includes(normalizedSearchInput)
			);
		});
		return filtered;
	}, [searchCustomerInput, data]);

	useEffect(() => {
		setSearchCustomerResult(filteredUsers);
	}, [filteredUsers]);

	return {
		searchCustomerInput,
		setSearchCustomerInput,
		searchCustomerResult,
	};
}
