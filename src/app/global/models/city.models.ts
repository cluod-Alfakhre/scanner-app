import { PaginationModel } from "./pagination.model";

export interface CityItemModel {
    id: number;
    cityNumber: string;
    name: string;
    /* createdAt: Date;
    updatedAt: Date; */
    [key: string]: any;
}

export interface CitiesFilterModel extends PaginationModel {
    SearchValue?: string;
}

export interface AddCityModel {
    cityNumber: string;
    name: string;
}

export interface UpdateCityModel extends Partial<AddCityModel> {
    id: string | number;
}