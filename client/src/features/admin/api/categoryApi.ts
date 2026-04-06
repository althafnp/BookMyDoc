import api from "@/core/http/api";
import type { CategoryFormValues } from "../schemas/categorySchema";

// ── Types ──
export interface GetAllCategoriesParams {
    page: number;
    limit: number;
    sortBy: "name" | "createdAt";
    sortOrder: "asc" | "desc";
    status?: string;
    search?: string;
}

export interface CategoryItem {
    id: string;
    name: string;
    status: "ACTIVE" | "INACTIVE";
}

export interface GetAllCategoriesResponse {
    categories: CategoryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ── API Functions ──

export const getAllCategories = async (params: GetAllCategoriesParams) => {
    const response = await api.get("/admin/categories", { params });
    return response.data;
};

export const createCategory = async (data: CategoryFormValues) => {
    const response = await api.post("/admin/create-category", data);
    return response.data;
};

export const updateCategory = async ({ id, name }: { id: string; name: string }) => {
    const response = await api.put(`/admin/categories/${id}`, { name });
    return response.data;
};

export const toggleCategoryStatus = async (id: string) => {
    const response = await api.patch(`/admin/categories/${id}/toggle-status`);
    return response.data;
};
