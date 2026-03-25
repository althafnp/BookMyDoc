import { Status } from "../../../domain/enums/Auth";

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
export interface GetAllCategoriesRequestDTO {
    page: number;
    limit: number;
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
export interface GetAllCategoriesResponseDTO {
    categories: CategoryItemDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}


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


