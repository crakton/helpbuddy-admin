"use client";

import withReduxProvider from "@/lib/withReduxProvider";
import { FC, ReactNode, createContext, useContext, useState } from "react";
import { ToastProvider } from "react-toast-plus";

interface ModalProviderProps {
	children: ReactNode;
}

interface ModalContextType {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
}

const WrapperContext = createContext<ModalContextType | undefined>(undefined);

const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const contextValue = {
		isOpen,
		openModal,
		closeModal,
	};
	return (
		<WrapperContext.Provider value={contextValue}>
			{children}
		</WrapperContext.Provider>
	);
};

export default withReduxProvider(ModalProvider);

export function useModal() {
	const context = useContext(WrapperContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
}
