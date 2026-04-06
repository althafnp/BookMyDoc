import DataTable, { type ColumnDef, type ActionItem, type FilterDef, type SortDef } from '@/components/DataTable';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Ban, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

type User = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
    status: 'active' | 'blocked';
    createdAt: string;
};

const UsersPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

    // Replace with your Tanstack Query hook
    const users: User[] = [{ _id: "1", name: "Althaf", email: "npmalthaf@gmail.com", phone: "9037072863", status: 'blocked', createdAt: '2026-03-24T13:34:45.111+00:00' }];
    const totalPages = 1;
    const isLoading = false;

    const columns: ColumnDef<User>[] = [
        {
            key: 'profileImage',
            label: 'Avatar',
            type: 'image',
            accessor: 'profileImage',
            imageAlt: 'name',
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
            key: 'phone',
            label: 'Phone',
            accessor: 'phone',
        },
        {
            key: 'status',
            label: 'Status',
            type: 'badge',
            accessor: 'status',
            badgeVariants: {
                active: 'default',
                blocked: 'destructive',
            },
        },
        {
            key: 'createdAt',
            label: 'Joined',
            type: 'date',
            accessor: 'createdAt',
        },
    ];

    const actions: ActionItem<User>[] = [
        {
            label: 'Block User',
            icon: <Ban className="size-4" />,
            onClick: (user) => setDeleteTarget(user),
            variant: 'destructive',
            show: (user) => user.status === 'active',
        },
        {
            label: 'Unblock User',
            icon: <RotateCcw className="size-4" />,
            onClick: (user) => console.log('Unblock:', user._id),
            show: (user) => user.status === 'blocked',
        },
    ];

    const filters: FilterDef[] = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Blocked', value: 'blocked' },
            ],
            value: statusFilter,
            onChange: (value) => {
                setStatusFilter(value);
                setPage(1); // Reset to first page on filter change
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
        onChange: setSortBy,
    };

    // console.log('Statusfilter:', statusFilter)
    // console.log('Sortby:', sortBy)

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">Users</h1>
            {/* <div className='mb-6 flex justify-between'>
                <Button>Add Category</Button>
            </div> */}

            <DataTable
                columns={columns}
                data={users}
                rowKey="_id"
                showSerialNumber
                actions={actions}
                filters={filters}
                sort={sort}
                search={{
                    value: search,
                    onChange: setSearch,
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

            <ConfirmationModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    // Call your block mutation here
                    console.log('Block:', deleteTarget?._id);
                }}
                title="Block User"
                message={`Are you sure you want to block ${deleteTarget?.name}?`}
                confirmText="Block"
                confirmButton="destructive"
            />
        </div>
    );
};

export default UsersPage;
