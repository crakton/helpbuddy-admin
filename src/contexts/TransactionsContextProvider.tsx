"use client";

import { FC, ReactNode, createContext, useCallback, useState } from "react";

export type T_Transactions_Tab = "Other Transactions" | "Bookings Transactions";

export const TransactionsContext = createContext<{} | null>(null);

interface TransactionsContextProviderProps {
	children: ReactNode;
}

const TransactionsContextProvider: FC<TransactionsContextProviderProps> = ({
	children,
}) => {
	const [transactionsTab, setTransactionsTab] =
		useState<T_Transactions_Tab>("Other Transactions");
	const handleTabSelect = useCallback(
		(tab: T_Transactions_Tab) => setTransactionsTab(tab),
		[]
	);

	return (
		<TransactionsContext.Provider
			value={{
				transactionsTab,
				handleTabSelect,
			}}
		>
			{children}
		</TransactionsContext.Provider>
	);
};

export default TransactionsContextProvider;
