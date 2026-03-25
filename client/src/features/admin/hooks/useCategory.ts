import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createCategory, getAllCategories, toggleCategoryStatus, updateCategory, type CategoryItem, type GetAllCategoriesParams } from "../api/categoryApi";
import { toast } from "sonner";

export const useCreateCategory = () => {
    return useMutation({
        mutationFn: createCategory,
    });
};


export const useGetAllCategories = (params: GetAllCategoriesParams) => {
    return useQuery({
        queryKey: ["admin", "categories", params],
        queryFn: () => getAllCategories(params),
    });
};


export const useToggleCategoryStatus = (queryClient: QueryClient) => {
    return useMutation<any, Error, string, { previousData?: any }>({
        mutationFn: (id: string) => toggleCategoryStatus(id),
 
        // 🔥 OPTIMISTIC UPDATE
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'categories'] });

            const previousData = queryClient.getQueryData(['admin', 'categories']);

            queryClient.setQueryData(['admin', 'categories'], (oldData: any) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        categories: oldData.data.categories.map((cat: CategoryItem) =>
                            cat.id === id
                                ? {
                                      ...cat,
                                      status:
                                          cat.status === 'ACTIVE'
                                              ? 'INACTIVE'
                                              : 'ACTIVE',
                                  }
                                : cat
                        ),
                    },
                };
            });

            return { previousData };
        },

        // ❌ rollback
        onError: (error, _id, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['admin', 'categories'], context.previousData);
            }

            toast.error(
                (error as any)?.response?.data?.message ?? 'Failed to toggle status'
            );
        },

        // ✅ success
        onSuccess: (res: any) => {
            toast.success(res.message);
        },

        // 🔄 sync
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });
};


export const useUpdateCategory = () => {
    return useMutation({
        mutationFn: updateCategory,
    });
};
