import api from "@/core/http/api";
import type { CreateDoctorFormValues, UpdateDoctorFormValues } from "../schemas/doctorSchema";

export interface GetAllDoctorsParams {
    page: number;
    limit: number;
    sortBy: "name" | "createdAt";
    sortOrder: "asc" | "desc";
    status?: string;
    categoryId?: string;
    search?: string;
}

export interface DoctorAvailabilityItem {
    id: string;
    startTime: string;
    endTime: string;
    slotDuration: number;
    workingDays: number[];
}

export interface DoctorItem {
    id: string;
    name: string;
    email: string;
    categoryId: string;
    categoryName?: string;
    profileImage: string;
    qualification: string;
    experience: string;
    consultationFee: number;
    status: "ACTIVE" | "INACTIVE";
    availability: DoctorAvailabilityItem;
}


export const getAllDoctors = async (params: GetAllDoctorsParams) => {
    const response = await api.get("/admin/doctors", { params });
    return response.data;
};

export const createDoctor = async (data: CreateDoctorFormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("categoryId", data.categoryId);
    formData.append("qualification", data.qualification);
    formData.append("experience", data.experience);
    formData.append("consultationFee", String(data.consultationFee));
    formData.append("profileImage", data.profileImage);

    // Availability must be stringified for multipart
    formData.append("availability", JSON.stringify(data.availability));


    const response = await api.post("/admin/create-doctor", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}

export const updateDoctor = async ({ id, ...data } : { id: string } & UpdateDoctorFormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("categoryId", data.categoryId);
    formData.append("qualification", data.qualification);
    formData.append("experience", data.experience);
    formData.append("consultationFee", String(data.consultationFee));

    if(data.profileImage) {
        formData.append("profileImage", data.profileImage);
    };

    formData.append("availability", JSON.stringify(data.availability));

    const response = await api.put(`/admin/doctors/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

    return response.data;
}

export const toggleDoctorStatus = async (id: string) => {
    const response = await api.patch(`/admin/doctors/${id}/toggle-status`);
    return response.data;
};