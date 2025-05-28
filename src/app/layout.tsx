import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "LaterPad",
	description: "Save now. Don't worry later.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<main className="flex min-h-screen items-center justify-center bg-gray-50">
					<div className="absolute top-4 left-4 text-white font-extrabold text-2xl select-none
          bg-linear-to-r bg-gray-950 shadow-md px-3 rounded">
						LaterPad
					</div>

					<div className="w-full h-screen max-w-4xl p-10">
						{children}
					</div>
				</main>
			</body>
		</html>
	);
}
