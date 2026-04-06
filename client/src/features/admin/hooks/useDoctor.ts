import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createDoctor,
    getAllDoctors,
    toggleDoctorStatus,
    updateDoctor,
    // toggleDoctorStatus,
    type DoctorItem,
    type GetAllDoctorsParams,
} from "../api/doctorApi";

export const useCreateDoctor = () => {
    return useMutation({
        mutationFn: createDoctor,
    });
};

export const useGetAllDoctors = (params: GetAllDoctorsParams) => {
    return useQuery({
        queryKey: ["admin", "doctors", params],
        queryFn: () => getAllDoctors(params),
    });
};

export const useUpdateDoctor = () => {
    return useMutation({
        mutationFn: updateDoctor,
    })
}

export const useToggleDoctorStatus = (queryClient: QueryClient) => {
    return useMutation<any, Error, string, { previousData?: any }>({
        mutationFn: (id: string) => toggleDoctorStatus(id),

        // 🔥 OPTIMISTIC UPDATE
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["admin", "doctors"] });

            const previousData = queryClient.getQueryData(["admin", "doctors"]);

            queryClient.setQueryData(["admin", "doctors"], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        doctors: oldData.data.doctors.map((doc: DoctorItem) =>
                            doc.id === id
                                ? {
                                      ...doc,
                                      status:
                                          doc.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                                  }
                                : doc
                        ),
                    },
                };
            });

            return { previousData };
        },

        // ❌ Rollback
        onError: (error, _id, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["admin", "doctors"], context.previousData);
            }
            toast.error(
                (error as any)?.response?.data?.message ?? "Failed to toggle status"
            );
        },

        // ✅ Success
        onSuccess: (res: any) => {
            toast.success(res.message);
        },

        // 🔄 Sync
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] });
        },
    });
};