import api from "@/core/http/api";


export const updateProfile = async (data: FormData) => {
    const response = await api.put("/profile", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};