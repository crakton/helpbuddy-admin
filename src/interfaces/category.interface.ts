export interface ICategory {
	$id: string;
	name: string;
	image_url: string;
}

export interface ISubcategory {
	$id: string;
	name: string;
	categoryId: string;
}
