import api from "@/core/http/api";

export interface GetAllUsersParams {
    page: number;
    limit: number;
    sortBy: "name" | "createdAt";
    sortOrder: "asc" | "desc";
    status?: string;
    search?: string;
};

export interface UserItem {
    id: string;
    name: string;
    email: string;
    status: "ACTIVE" | "INACTIVE";
}

export interface GetAllUsersResponse {
    categories: UserItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};


export const getAllUsers = async(params: GetAllUsersParams) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
};

export const toggleUserStatus = async(id: string) => {
    const response = await api.patch(`/admin/users/${id}/toggle-status`);
    return response.data;
}

