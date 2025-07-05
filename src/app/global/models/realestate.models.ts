import { OwnerItemModel } from "./owner.models";
import { PaginationModel } from "./pagination.model";

interface BoundariesModel {
    north: string;
    south: string;
    east: string;
    west: string;
}

export interface RealestateItemModel {
    id: number;
    farmNumber: string;
    cityName: string;
    cityNumber: string;
    projectNumber: string;
    projectName: string;
    area: number;
    boundaries: BoundariesModel;
    owner: OwnerItemModel;
    /* createdAt: Date;
    updatedAt: Date; */
    [key: string]: any;
}

export interface RealestatesFilterModel extends PaginationModel {
    SearchValue: string;
    cityId: number;
    projectId: number;
}

export interface AddRealestateModel {
    farmNumber: number;
    projectId: number;
    ownerId: number;
    north: string;
    south: string;
    east: string;
    west: string;
}

export interface UpdateRealestateModel extends Partial<AddRealestateModel> {
    id: string | number;
}