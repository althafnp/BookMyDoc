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
import DoctorFormModal from '../components/DoctorFormModal';
import type { DoctorItem } from '../api/doctorApi';
import type { CreateDoctorFormValues, UpdateDoctorFormValues } from '../schemas/doctorSchema';
import { useDebounce } from '@/hooks/useDebounce';
import { useCreateDoctor, useGetAllDoctors, useToggleDoctorStatus, useUpdateDoctor } from '../hooks/useDoctor';
import { useGetAllCategories } from '../hooks/useCategory';

const Doctor = () => {
    // ── Table state ──
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortBy, setSortBy] = useState('');

    const debouncedSearch = useDebounce(search, 500);

    // ── Modal state ──
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<DoctorItem | null>(null);
    const [toggleTarget, setToggleTarget] = useState<DoctorItem | null>(null);
    console.log(editTarget)

    const queryClient = useQueryClient();

    const { data: categoriesData } = useGetAllCategories({
        page: 1,
        limit: 100,
        sortBy: "name",
        sortOrder: "asc",
        status: "ACTIVE"
    });

    const categoriesOptions = (categoriesData?.data?.items ?? []).map(
        (cat: { id: string, name: string}) => ({
            label: cat.name,
            value: cat.id,
        })
    );

    const categoryMap = Object.fromEntries(
        (categoriesData?.data?.items ?? []).map(
            (cat: { id: string, name: string}) => [cat.id, cat.name]
        )
    );

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
        ...(categoryFilter && { categoryId: categoryFilter }),
        ...(debouncedSearch && { search: debouncedSearch }),
    };

    // ── Query & Mutations ──
    const { data, isLoading } = useGetAllDoctors(queryParams);
    const createMutation = useCreateDoctor();
    const updateMutation = useUpdateDoctor();
    const toggleMutation = useToggleDoctorStatus(queryClient);

    const doctors: DoctorItem[] = (data?.data?.items ?? []).map((doc: DoctorItem) => ({
        ...doc,
        categoryName: categoryMap[doc.categoryId] ?? 'Unknown'
    }));
    const totalPages = data?.data?.meta.totalPages ?? 1;

    const invalidateDoctors = () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
    };

    // ── Handlers ──
    const handleCreate = (formData: CreateDoctorFormValues) => {
        createMutation.mutate(formData, {
            onSuccess: (res) => {
                toast.success(res.message);
                setIsFormOpen(false);
                invalidateDoctors();
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message ?? 'Failed to create doctor');
            },
        });
    };

    const handleUpdate = (formData: UpdateDoctorFormValues) => {
        if(!editTarget) return;
        updateMutation.mutate(
            { id: editTarget.id, ...formData },
            {
                onSuccess: (res) => {
                    toast.success(res.message);
                    setEditTarget(null);
                    invalidateDoctors();
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message ?? 'Failed to update doctor')
                }
            }
        )
    }

    const handleToggleStatus = () => {
        if (!toggleTarget) return;
        toggleMutation.mutate(toggleTarget.id);
        setToggleTarget(null);
    };

    // ── Table config ──
    const columns: ColumnDef<DoctorItem>[] = [
        {
            key: 'profileImage',
            label: '',
            type: 'custom' as const,
            render: (doctor) => (
                <img
                    src={doctor.profileImage}
                    alt={doctor.name}
                    className="w-9 h-9 rounded-full bg-primary object-cover border border-border"
                />
            ),
        },
        {
            key: 'name',
            label: 'Name',
            accessor: 'name',
        },
        {
            key: 'email',
            label: 'Email',
            accessor: 'email',
        },
        {
            key: 'categoryName',
            label: 'Category',
            accessor: 'categoryName',
        },
        {
            key: 'consultationFee',
            label: 'Fee (₹)',
            accessor: 'consultationFee',
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

    const actions: ActionItem<DoctorItem>[] = [
        {
            label: 'Edit',
            icon: <Pencil className='size-4' />,
            onClick: (doctor) => setEditTarget(doctor),
        },
        {
            label: 'Deactivate',
            icon: <ToggleLeft className="size-4" />,
            onClick: (doctor) => setToggleTarget(doctor),
            variant: 'destructive',
            show: (doctor) => doctor.status === 'ACTIVE',
        },
        {
            label: 'Activate',
            icon: <ToggleRight className="size-4" />,
            onClick: (doctor) => setToggleTarget(doctor),
            show: (doctor) => doctor.status === 'INACTIVE',
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
        {
            key: 'category',
            label: 'Category',
            options: categoriesOptions,
            value: categoryFilter,
            onChange: (value) => {
                setCategoryFilter(value);
                setPage(1)
            }
        }
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
                <h1 className="text-2xl font-bold">Doctors</h1>
                <Button onClick={() => setIsFormOpen(true)}>Add Doctor</Button>
            </div>

            <DataTable
                columns={columns}
                data={doctors}
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
                    placeholder: 'Search doctors...',
                }}
                pagination={{
                    currentPage: page,
                    totalPages,
                    onPageChange: setPage,
                }}
                isLoading={isLoading}
                emptyMessage="No doctors found."
            />

            {/* Create Doctor Modal */}
            <DoctorFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreate}
                isLoading={createMutation.isPending}
            />

            {/* Update Doctor Modal */}
            <DoctorFormModal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                onSubmit={handleUpdate}
                isLoading={updateMutation.isPending}
                defaultValues={editTarget ?? undefined}
            />

            {/* Toggle Status Confirmation */}
            <ConfirmationModal
                isOpen={!!toggleTarget}
                onClose={() => setToggleTarget(null)}
                onConfirm={handleToggleStatus}
                title={toggleTarget?.status === 'ACTIVE' ? 'Deactivate Doctor' : 'Activate Doctor'}
                message={`Are you sure you want to ${toggleTarget?.status === 'ACTIVE' ? 'deactivate' : 'activate'} "${toggleTarget?.name}"?`}
                confirmText={toggleTarget?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                confirmButton={toggleTarget?.status === 'ACTIVE' ? 'destructive' : 'default'}
            />
        </div>
    );
};

export default Doctor;