export interface IService {
  additionalService?: any;
  availability: IAvailability;
  category: IServiceCategory;
  country: string;
  customId?: string;
  desc: string;
  insuranceCoverage: any[];
  licenseAndCertification: any[];
  name: string;
  photos: any;
  price: number;
  status: string;
  providerId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string
  };
  ratedBy: number;
  ratings: number;
  state: string;
  subCategory: IServiceSubCategory;
  _id: string;
  createdAt: string;
  updatedAt: string;
  verified?: boolean;
  publish?: boolean;
  blocked: boolean;
}

export interface IDeleteCategory {
  _id: string;
  name: string;
  children: [];
  options: [];
  __v: number;
}
export interface IServiceCategory {
  id: number;
  _id: string;
  name: string;
  customId: string;
  featured: boolean;
  children: IServiceSubCategory;
  icon : string
}

export interface IServiceSubCategory {
  _id: string;
  name: string;
  customId: string;
}

export interface ICreateService {
  name: string;
  category: string;
  subCategory: string;
  country: string;
  state: string;
  price: number;
  desc: string;
  additionalService: [];
  availability: IAvailability;
  media: any[];
}

interface IAvailability {
  days: string[];
  hours: {
    from: string;
    to: string;
  };
}
