import type { Metadata } from "next";
import "./globals.css";
import ModalProvider from "@/components/context/ModalContext";
import { Bounce, ToastContainer } from "react-toastify";

export const metadata: Metadata = {
	title: "Help Buddy",
	description: "Book your services from the proffessionals",
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<ModalProvider>{children}</ModalProvider>
			</body>
		</html>
	);
}
