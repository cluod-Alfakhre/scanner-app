import { PaginationModel } from "./pagination.model";

export interface ProjectItemModel {
    id: number;
    projectNumber: string;
    name: string;
    farmsCount: number;
    cityId: number;
    cityName: number;
    createdAt: Date;
    /* updatedAt: Date; */
    [key: string]: any;
}

export interface ProjectsFilterModel extends PaginationModel {
    SearchValue?: string;
}

export interface AddProjectModel {
    name: string;
    projectNumber: number;
    cityId: number;
}

export interface UpdateProjectModel extends Partial<AddProjectModel> {
    id: string | number;
}