import { Status } from "../../../domain/enums/Auth";
import { PaginatedResponseDTO, PaginationRequestDTO } from "../shared/pagination.dto";

// ── Create ──
export interface CreateCategoryRequestDTO {
    name: string;
};

export interface CreateCategoryResponseDTO {
    id: string;
    name: string;
    status: Status;
};


// ── Get All (List) ──
export interface GetAllCategoriesRequestDTO extends PaginationRequestDTO {
    sortBy: "name" | "createdAt";
    sortOrder: "asc" | "desc";
    status?: Status;
    search?: string;
}

export interface CategoryItemDTO {
    id: string;
    name: string;
    status: Status;
}

export type GetAllCategoriesResponseDTO = PaginatedResponseDTO<CategoryItemDTO>;


// ── Update (Edit) ──
export interface UpdateCategoryRequestDTO {
    id: string;
    name: string;
}
export interface UpdateCategoryResponseDTO {
    id: string;
    name: string;
    status: Status;
}


// ── Toggle Status ──
export interface ToggleCategoryStatusRequestDTO {
    id: string;
}
export interface ToggleCategoryStatusResponseDTO {
    id: string;
    name: string;
    status: Status;
}


