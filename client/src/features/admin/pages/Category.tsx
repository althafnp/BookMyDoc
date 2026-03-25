import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import DataTable, {
    type ColumnDef,
    type ActionItem,
    type FilterDef,
    type SortDef,
} from '@/components/DataTable';
import ConfirmationModal from '@/components/ConfirmationModal';
import CategoryFormModal from '../components/CategoryFormModal';
import type { CategoryItem } from '../api/categoryApi';
import type { CategoryFormValues } from '../schemas/categorySchema';
import { useDebounce } from '@/hooks/useDebounce';
import { useCreateCategory, useGetAllCategories, useToggleCategoryStatus, useUpdateCategory } from '../hooks/useCategory';

const Category = () => {
    // ── Table state ──
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('');

    const debouncedSearch = useDebounce(search, 500);

    // ── Modal state ──
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CategoryItem | null>(null);
    const [toggleTarget, setToggleTarget] = useState<CategoryItem | null>(null);

    const queryClient = useQueryClient();

    // ── Build sort params ──
    const getSortParams = () => {
        switch (sortBy) {
            case 'name_asc':
                return { sortBy: 'name' as const, sortOrder: 'asc' as const };
            case 'name_desc':
                return { sortBy: 'name' as const, sortOrder: 'desc' as const };
            case 'createdAt_asc':
                return { sortBy: 'createdAt' as const, sortOrder: 'asc' as const };
            case 'createdAt_desc':
                return { sortBy: 'createdAt' as const, sortOrder: 'desc' as const };
            default:
                return { sortBy: 'createdAt' as const, sortOrder: 'desc' as const };
        }
    };

    const queryParams = {
        page,
        limit: 10,
        ...getSortParams(),
        ...(statusFilter && { status: statusFilter }),
        ...(debouncedSearch && { search: debouncedSearch }),
    };

    // ── Query & Mutations ──
    const { data, isLoading } = useGetAllCategories(queryParams);
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const toggleMutation = useToggleCategoryStatus(queryClient);

    const categories: CategoryItem[] = data?.data?.categories ?? [];
    const totalPages = data?.data?.totalPages ?? 1;

    const invalidateCategories = () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    }

    // ── Handlers ──
    const handleCreate = (formData: CategoryFormValues) => {
        createMutation.mutate(formData, {
            onSuccess: (res) => {
                toast.success(res.message);
                setIsFormOpen(false);
                invalidateCategories();
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message ?? 'Failed to create category');
            },
        });
    };

    const handleUpdate = (formData: CategoryFormValues) => {
        if (!editTarget) return;
        updateMutation.mutate(
            { id: editTarget.id, name: formData.name },
            {
                onSuccess: (res) => {
                    toast.success(res.message);
                    setEditTarget(null);
                    invalidateCategories();
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message ?? 'Failed to update category');
                },
            }
        );
    };

    const handleToggleStatus = () => {
        if (!toggleTarget) return;

        toggleMutation.mutate(toggleTarget.id);
        setToggleTarget(null);
    };


    // ── Table config ──
    const columns: ColumnDef<CategoryItem>[] = [
        {
            key: 'name',
            label: 'Category Name',
            accessor: 'name',
        },
        {
            key: 'status',
            label: 'Status',
            type: 'badge',
            accessor: 'status',
            badgeVariants: {
                ACTIVE: 'success',
                INACTIVE: 'destructive',
            },
        },
    ];

    const actions: ActionItem<CategoryItem>[] = [
        {
            label: 'Edit',
            icon: <Pencil className="size-4" />,
            onClick: (category) => setEditTarget(category),
        },
        {
            label: 'Deactivate',
            icon: <ToggleLeft className="size-4" />,
            onClick: (category) => setToggleTarget(category),
            variant: 'destructive',
            show: (category) => category.status === 'ACTIVE',
        },
        {
            label: 'Activate',
            icon: <ToggleRight className="size-4" />,
            onClick: (category) => setToggleTarget(category),
            show: (category) => category.status === 'INACTIVE',
        },
    ];

    const filters: FilterDef[] = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
            ],
            value: statusFilter,
            onChange: (value) => {
                setStatusFilter(value);
                setPage(1);
            },
        },
    ];

    const sort: SortDef = {
        options: [
            { label: 'Name (A-Z)', value: 'name_asc' },
            { label: 'Name (Z-A)', value: 'name_desc' },
            { label: 'Newest First', value: 'createdAt_desc' },
            { label: 'Oldest First', value: 'createdAt_asc' },
        ],
        value: sortBy,
        onChange: (value) => {
            setSortBy(value);
            setPage(1);
        },
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button onClick={() => setIsFormOpen(true)}>Add Category</Button>
            </div>

            <DataTable
                columns={columns}
                data={categories}
                rowKey="id"
                showSerialNumber
                actions={actions}
                filters={filters}
                sort={sort}
                search={{
                    value: search,
                    onChange: (value) => {
                        setSearch(value);
                        setPage(1);
                    },
                    placeholder: 'Search categories...',
                }}
                pagination={{
                    currentPage: page,
                    totalPages,
                    onPageChange: setPage,
                }}
                isLoading={isLoading}
                emptyMessage="No categories found."
            />

            {/* Create Category Modal */}
            <CategoryFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreate}
                isLoading={createMutation.isPending}
            />

            {/* Edit Category Modal */}
            <CategoryFormModal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                onSubmit={handleUpdate}
                isLoading={updateMutation.isPending}
                defaultValues={editTarget ? { name: editTarget.name } : undefined}
            />

            {/* Toggle Status Confirmation */}
            <ConfirmationModal
                isOpen={!!toggleTarget}
                onClose={() => setToggleTarget(null)}
                onConfirm={handleToggleStatus}
                title={toggleTarget?.status === 'ACTIVE' ? 'Deactivate Category' : 'Activate Category'}
                message={`Are you sure you want to ${toggleTarget?.status === 'ACTIVE' ? 'deactivate' : 'activate'} "${toggleTarget?.name}"?`}
                confirmText={toggleTarget?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                confirmButton={toggleTarget?.status === 'ACTIVE' ? 'destructive' : 'default'}
            />
        </div>
    );
};

export default Category;