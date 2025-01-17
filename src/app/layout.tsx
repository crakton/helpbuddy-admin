import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/redux/Provider";
import ModalProvider from "@/components/context/ModalContext";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Help Buddy",
	description: "Book your services from the proffessionals",
};
// ConnectDB();
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<ModalProvider>{children}</ModalProvider>
				</Providers>
			</body>
			{/* <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js"></script> */}
		</html>
	);
}
