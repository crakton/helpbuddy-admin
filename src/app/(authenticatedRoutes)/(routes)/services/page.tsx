"use client";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import Pagination from "../_components/Pagination";
import ServicesTable from "@/components/ServicesTable";
import { serviceManager } from "@/services/service.service";
import { setServices, setTotalPages } from "@/features/serviceSlice";
import { IService } from "@/interfaces/service.interface";

const Services_Tab = [
	"All Services",
	"Verified Services",
	"Pending Services",
	"Unpublished Services",
	"Blocked Services",
];

export type tableStatus =
	| "all"
	| "verified"
	| "pending"
	| "unpublished"
	| "blocked";

const Page: FC = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState<tableStatus>("all");
	const user = useAppSelector((state) => state.auth.user);
	const { services, loading } = useAppSelector((state) => state.services);

	const fetchServices = useCallback(async () => {
		const {
			services: { documents, total },
		} = await serviceManager.getServices();

		const isServiceProvider = user?.prefs.role === "provider";
		if (isServiceProvider) {
			const myServices = documents.filter((doc) => doc.providerId === user.$id);

			dispatch(setServices(myServices as unknown as IService[]));
		} else {
			dispatch(setServices(documents as unknown as IService[]));
		}
	}, [dispatch, user?.$id, user?.prefs.role]);

	useEffect(() => {
		fetchServices();
	}, [fetchServices]);

	console.log("services: ", services);

	let page = searchParams.get("page") as string;
	if (page === null) page = "1";

	// Filter services based on active tab
	const getFilteredServices = useCallback(() => {
		switch (activeTab) {
			case "verified":
				return services.filter((service) => service.isVerified);
			case "pending":
				return services.filter(
					(service) =>
						!service.isVerified &&
						!service.isBlocked &&
						service.status !== "draft"
				);
			case "unpublished":
				return services.filter((service) => service.status === "draft");
			case "blocked":
				return services.filter((service) => service.isBlocked);
			default:
				return services;
		}
	}, [activeTab, services]);

	const handleTabChange = useCallback(
		(tabStatus: tableStatus) => {
			setActiveTab(tabStatus);
			// Reset to first page when changing tabs
			if (page !== "1") {
				router.push(`?page=1`);
			}
		},
		[page, router]
	);

	const filteredServices = useMemo(
		() => getFilteredServices(),
		[getFilteredServices]
	);
	const filteredTotalPages = useMemo(
		() => Math.ceil(filteredServices.length / 10),
		[filteredServices.length]
	);

	return (
		<section className="flex flex-col gap-7 pb-12">
			<div className="flex justify-between items-center pl-4 lg:pr-16 lg:pl-6 bg-white w-full h-16">
				<div className="flex items-center justify-start gap-16">
					<h1 className="text-lg lg:pl-0 lg:text-xl leading-3 text-afruna-blue font-bold">
						{Services_Tab.find((tab) =>
							tab.toLowerCase().startsWith(activeTab)
						)}
					</h1>
				</div>
				<div className="flex justify-end items-center gap-6"></div>
			</div>

			<div className="flex flex-col gap-6 px-6 xl:pr-10 w-full">
				<div className="flex flex-col gap-1 w-full">
					<div className="flex justify-start gap-8 items-center">
						{Services_Tab.map((item, idx) => {
							const tabStatus = item.toLowerCase().split(" ")[0] as tableStatus;
							const isActive = activeTab === tabStatus;

							return (
								<button
									className={`text-afruna-blue text-sm md:text-base font-bold relative flex flex-col
                    ${isActive ? "text-afruna-blue" : "text-gray-500"}`}
									key={idx}
									onClick={() => handleTabChange(tabStatus)}
								>
									{item}
									<div
										className={`w-full h-[2px] absolute -bottom-[0.35rem] 
                      ${isActive ? "bg-[#aae0ce]" : "bg-transparent"}`}
									/>
								</button>
							);
						})}
					</div>
					<div className="bg-[#aae0ce] w-1/2 h-[2px]" />
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-afruna-blue" />
					</div>
				) : (
					<>
						<div className="flex justify-between items-center mb-4">
							<span className="text-sm text-gray-600">
								Showing {filteredServices.length} services
							</span>
						</div>

						<ServicesTable services={filteredServices} />

						{filteredTotalPages > 1 && (
							<Pagination page={page} totalPages={filteredTotalPages} />
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default Page;
