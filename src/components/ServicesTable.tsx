import React, { FC } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { IService } from "@/interfaces/service.interface";

interface ServiceCardProps {
	service: IService;
	onEdit?: (service: IService) => void;
	onDelete?: (service: IService) => void;
	onView?: (service: IService) => void;
}

const ServiceCard: FC<ServiceCardProps> = ({
	service,
	onEdit,
	onDelete,
	onView,
}) => {
	return (
		<Card className="p-4 mb-4 hover:shadow-lg transition-shadow">
			<div className="flex items-start gap-4">
				<div className="w-24 h-24 relative">
					<Image
						width={100}
						height={100}
						src={service?.images[0] || "/api/placeholder/96/96"}
						alt={service.name}
						className="w-full h-full object-cover rounded"
					/>
				</div>
				<div className="flex-1">
					<div className="flex justify-between items-start">
						<div className="flex-1">
							<h3 className="text-lg font-semibold text-afruna-blue">
								{service.name}
							</h3>
							<span className="text-lg font-bold">${service.price}</span>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
								<MoreVertical className="h-5 w-5 text-gray-500" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => onView?.(service)}
									className="cursor-pointer"
								>
									<Eye className="mr-2 h-4 w-4" />
									View Details
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => onEdit?.(service)}
									className="cursor-pointer"
								>
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => onDelete?.(service)}
									className="cursor-pointer text-red-600 focus:text-red-600"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<p className="text-sm text-gray-600 mt-1">{service.description}</p>
					<div className="flex flex-wrap gap-2 mt-2">
						{service.isVerified && (
							<Badge className="bg-green-100 text-green-800">Verified</Badge>
						)}
						{service.isRemoteService && (
							<Badge className="bg-blue-100 text-blue-800">Remote</Badge>
						)}
						{service.status === "draft" && (
							<Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
						)}
						{service.isBlocked && (
							<Badge className="bg-red-100 text-red-800">Blocked</Badge>
						)}
					</div>
					<div className="flex gap-2 mt-2">
						{service.tags.map((tag, index) => (
							<span
								key={index}
								className="text-xs bg-gray-100 px-2 py-1 rounded"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</Card>
	);
};

interface ServicesTableProps {
	services: IService[];
	onEdit?: (service: IService) => void;
	onDelete?: (service: IService) => void;
	onView?: (service: IService) => void;
}

const ServicesTable: FC<ServicesTableProps> = ({
	services,
	onEdit,
	onDelete,
	onView,
}) => {
	if (!services?.length) {
		return (
			<div className="text-center py-8 text-gray-500">No services found</div>
		);
	}

	return (
		<div className="grid gap-4">
			{services.map((service) => (
				<ServiceCard
					key={service.$id}
					service={service}
					onEdit={onEdit}
					onDelete={onDelete}
					onView={onView}
				/>
			))}
		</div>
	);
};

export default ServicesTable;
