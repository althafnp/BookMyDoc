import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react"
import type { UserItem } from "../api/userApi";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllUsers, useToggleUserStatus } from "../hooks/useUser";
import type { ActionItem, ColumnDef, FilterDef, SortDef } from "@/components/DataTable";
import { ToggleLeft, ToggleRight } from "lucide-react";
import DataTable from "@/components/DataTable";
import ConfirmationModal from "@/components/ConfirmationModal";


const User = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('');

    const debouncedSearch = useDebounce(search, 500);

    const [toggleTarget, setToggleTarget] = useState<UserItem | null>(null);

    const queryClient = useQueryClient();

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
        page: page,
        limit: 10,
        ...getSortParams(),
        ...(statusFilter && { status: statusFilter }),
        ...(debouncedSearch && { search: debouncedSearch })
    }

    const { data, isLoading } = useGetAllUsers(queryParams);
    const toggleMutation = useToggleUserStatus(queryClient);

    const users: UserItem[] = data?.data?.items ?? [];
    const totalPages = data?.data?.meta?.totalPages ?? 1;

    const handleToggleStatus = () => {
        if(!toggleTarget) return;

        toggleMutation.mutate(toggleTarget.id);
        setToggleTarget(null);
    }

    const columns: ColumnDef<UserItem>[] = [
        {
            key: 'name',
            label: 'Name',
            accessor: 'name'
        },
        {
            key: 'email',
            label: 'Email',
            accessor: 'email'
        },
        {
            key: 'status',
            label: 'Status',
            type: 'badge',
            accessor: 'status',
            badgeVariants: {
                ACTIVE: "success",
                INACTIVE: 'destructive',
            }
        }
    ];

    const actions: ActionItem<UserItem>[] = [
        {
            label: 'Deactivate',
            icon: <ToggleLeft className="size-4" />,
            onClick: (user) => setToggleTarget(user),
            variant: "destructive",
            show: (user) => user.status === 'ACTIVE'
        },
        {
            label: 'Activate',
            icon: <ToggleRight className="size-4" />,
            onClick: (user) => setToggleTarget(user),
            show: (user) => user.status === 'INACTIVE'
        }
    ]

    const filters: FilterDef[] = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { label: 'Active', value: 'ACTIVE'},
                { label: 'Inactive', value: 'INACTIVE'}
            ],
            value: statusFilter,
            onChange: (value) => {
                setStatusFilter(value)
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Users</h1>
            </div>

            <DataTable
                columns={columns}
                data={users}
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
                    placeholder: 'Search users...',
                }}
                pagination={{
                    currentPage: page,
                    totalPages,
                    onPageChange: setPage,
                }}
                isLoading={isLoading}
                emptyMessage="No users found."
            />


            {/* Toggle Status Confirmation */}
            <ConfirmationModal
                isOpen={!!toggleTarget}
                onClose={() => setToggleTarget(null)}
                onConfirm={handleToggleStatus}
                title={toggleTarget?.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                message={`Are you sure you want to ${toggleTarget?.status === 'ACTIVE' ? 'deactivate' : 'activate'} "${toggleTarget?.name}"?`}
                confirmText={toggleTarget?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                confirmButton={toggleTarget?.status === 'ACTIVE' ? 'destructive' : 'default'}
            />
        </div>
    )
}

export default User