import { PaginationModel } from "./pagination.model";

export interface UserItemModel {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    adress: string;
    isActive: boolean;
    roleName: string;
    roleId: number;
}

export interface UsersFilterModel extends PaginationModel {
    SearchValue?: string;
}

export interface AddUserModel {
    username: string;
    password: string;
    fullName: string;
    email: string;
    phone: string;
    adress: string;
    isActive: boolean;
    roleId: number;
}

export interface UpdateUserModel extends Partial<AddUserModel> {
    id: string | number;
}