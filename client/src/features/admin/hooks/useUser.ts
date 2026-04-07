import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getAllUsers, toggleUserStatus, type GetAllUsersParams, type UserItem } from "../api/userApi";
import { toast } from "sonner";

export const useGetAllUsers = (params: GetAllUsersParams) => {
    return useQuery({
        queryKey: ['admin', 'users', params],
        queryFn: () => getAllUsers(params)
    });
}

export const useToggleUserStatus = (queryClient: QueryClient) => {
    return useMutation<any, Error, string, { previousData?: any }>({
        mutationFn: (id: string) => toggleUserStatus(id),

        // 🔥 OPTIMISTIC UPDATE
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["admin", "users"] });

            const previousData = queryClient.getQueryData(["admin", "users"]);

            queryClient.setQueryData(["admin", "users"], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        users: oldData.data.users.map((user: UserItem) =>
                            user.id === id
                                ? {
                                      ...user,
                                      status:
                                          user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                                  }
                                : user
                        ),
                    },
                };
            });

            return { previousData };
        },

        // ❌ Rollback
        onError: (error, _id, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["admin", "users"], context.previousData);
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
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
        },
    });
};