import { PaginationModel } from "./pagination.model";

export interface OwnerItemModel {
    id: number;
    fullName: string;
    nationalId: string;
    phoneNumber: string;
    farmsCount: number;
    /* createdAt: Date;
    updatedAt: Date; */
    [key: string]: any;
}

export interface OwnersFilterModel extends PaginationModel {
    SearchValue?: string;
}

export interface AddOwnerModel {
    fullName: string;
    nationalId: string;
    phoneNumber: string;
}

export interface UpdateOwnerModel extends Partial<AddOwnerModel> {
    id: string | number;
}