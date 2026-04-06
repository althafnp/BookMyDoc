import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    type ColumnDef as TanStackColumnDef,
    type Row,
} from '@tanstack/react-table';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    Search,
    ListFilter,
    ArrowUpDown,
    Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

// ─── Types ──────────────────────────────────────────────

export type ColumnType = 'text' | 'image' | 'badge' | 'date' | 'custom';

export type BadgeVariant =
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success';

export type ColumnDef<T> = {
    /** Unique key for the column */
    key: string;
    /** Column header label */
    label: string;
    /** Type of content to render */
    type?: ColumnType;
    /** Accessor: path to nested value (e.g. "profile.name") or a function */
    accessor?: keyof T | string | ((row: T) => unknown);
    /** For 'badge' type - map values to badge variants */
    badgeVariants?: Record<string, BadgeVariant>;
    /** For 'date' type - date format options */
    dateOptions?: Intl.DateTimeFormatOptions;
    /** For 'image' type - alt text accessor */
    imageAlt?: keyof T | string | ((row: T) => string);
    /** For 'custom' type - custom render function */
    render?: (row: T, rowIndex: number) => React.ReactNode;
    /** Additional className for the cell */
    className?: string;
    /** Additional className for the header */
    headerClassName?: string;
};

export type ActionItem<T> = {
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    variant?: 'default' | 'destructive';
    /** Conditionally show this action */
    show?: (row: T) => boolean;
};

export type FilterOption = {
    label: string;
    value: string;
};

export type FilterDef = {
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
};

export type SortOption = {
    label: string;
    value: string;
};

export type SortDef = {
    options: SortOption[];
    value: string;
    onChange: (value: string) => void;
};

type DataTableProps<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    rowKey: keyof T | ((row: T) => string | number);
    showSerialNumber?: boolean;
    actions?: ActionItem<T>[];
    quickActions?: {
        edit?: (row: T) => void;
        softDelete?: (row: T) => void;
        view?: (row: T) => void;
    };
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    };
    filters?: FilterDef[];
    sort?: SortDef;
    isLoading?: boolean;
    emptyMessage?: string;
    className?: string;
};

// ─── Helpers ────────────────────────────────────────────

function getNestedValue<T>(obj: T, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object' && key in acc) {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj);
}

function getCellValue<T>(row: T, accessor: ColumnDef<T>['accessor']): unknown {
    if (!accessor) return undefined;
    if (typeof accessor === 'function') return accessor(row);
    if (typeof accessor === 'string' && accessor.includes('.')) {
        return getNestedValue(row, accessor);
    }
    return (row as Record<string, unknown>)[accessor as string];
}

// ─── Skeleton Row ────────────────────────────────────────

function SkeletonRow({ colCount }: { colCount: number }) {
    return (
        <TableRow>
            {Array.from({ length: colCount }).map((_, i) => (
                <TableCell key={i}>
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                </TableCell>
            ))}
        </TableRow>
    );
}

// ─── Cell Renderer ───────────────────────────────────────

function CellContent<T>({
    column,
    row,
    rowIndex,
}: {
    column: ColumnDef<T>;
    row: T;
    rowIndex: number;
}) {
    const value = getCellValue(row, column.accessor);
    const type = column.type ?? 'text';

    switch (type) {
        case 'image': {
            const src = value as string;
            let alt = 'Image';
            if (column.imageAlt) {
                if (typeof column.imageAlt === 'function') {
                    alt = column.imageAlt(row);
                } else {
                    alt = String(getCellValue(row, column.imageAlt));
                }
            }
            return src ? (
                <img
                    src={src}
                    alt={alt}
                    className="size-10 rounded-full object-cover ring-1 ring-border"
                />
            ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                    N/A
                </div>
            );
        }

        case 'badge': {
            const strValue = String(value ?? '');
            const variant = column.badgeVariants?.[strValue] ?? 'secondary';
            return (
                <Badge variant={variant} className="capitalize">
                    {strValue}
                </Badge>
            );
        }

        case 'date': {
            if (!value) return <span className="text-muted-foreground">—</span>;
            const date = new Date(value as string | number);
            const formatted = date.toLocaleDateString('en-IN', column.dateOptions ?? {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
            return <span>{formatted}</span>;
        }

        case 'custom':
            return column.render ? <>{column.render(row, rowIndex)}</> : null;

        case 'text':
        default:
            return (
                <span className="text-sm">
                    {value != null ? String(value) : '—'}
                </span>
            );
    }
}

// ─── Pagination Helper ───────────────────────────────────

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [1];
    if (current > 3) pages.push('ellipsis');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('ellipsis');
    pages.push(total);
    return pages;
}

// ─── Actions Cell ────────────────────────────────────────

function ActionsCell<T>({
    row,
    actions,
    quickActions,
}: {
    row: T;
    actions?: ActionItem<T>[];
    quickActions?: DataTableProps<T>['quickActions'];
}) {
    return (
        <div className="flex items-center justify-center gap-1">
            {quickActions?.view && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-xs" onClick={() => quickActions.view!(row)}>
                                <Eye className="size-3.5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>View</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

            {quickActions?.edit && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-xs" onClick={() => quickActions.edit!(row)}>
                                <Pencil className="size-3.5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

            {quickActions?.softDelete && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                className="text-destructive hover:text-destructive"
                                onClick={() => quickActions.softDelete!(row)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

            {actions && actions.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {actions
                            .filter((action) => !action.show || action.show(row))
                            .map((action, idx, arr) => (
                                <React.Fragment key={action.label}>
                                    <DropdownMenuItem
                                        variant={action.variant}
                                        onClick={() => action.onClick(row)}
                                    >
                                        {action.icon}
                                        {action.label}
                                    </DropdownMenuItem>
                                    {action.variant !== 'destructive' &&
                                        idx < arr.length - 1 &&
                                        arr[idx + 1]?.variant === 'destructive' && (
                                            <DropdownMenuSeparator />
                                        )}
                                </React.Fragment>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────

function DataTable<T extends object>({
    columns: columnDefs,
    data,
    rowKey,
    showSerialNumber = false,
    actions,
    quickActions,
    pagination,
    search,
    filters,
    sort,
    isLoading = false,
    emptyMessage = 'No data found.',
    className,
}: DataTableProps<T>) {
    const hasActions = !!(actions?.length || quickActions);
    const hasToolbar = !!(search || filters?.length || sort);

    // Build TanStack column definitions from our custom ColumnDef format
    const tanstackColumns = useMemo<TanStackColumnDef<T>[]>(() => {
        const cols: TanStackColumnDef<T>[] = [];

        if (showSerialNumber) {
            cols.push({
                id: '__serial',
                header: '#',
                cell: ({ row }) => {
                    const serial = pagination
                        ? (pagination.currentPage - 1) * data.length + row.index + 1
                        : row.index + 1;
                    return (
                        <span className="text-center text-muted-foreground block">
                            {serial}
                        </span>
                    );
                },
                meta: { headerClassName: 'w-12 text-center' },
            });
        }

        for (const colDef of columnDefs) {
            cols.push({
                id: colDef.key,
                header: colDef.label,
                accessorFn: (row) => getCellValue(row, colDef.accessor),
                cell: ({ row }) => (
                    <CellContent
                        column={colDef}
                        row={row.original}
                        rowIndex={row.index}
                    />
                ),
                meta: {
                    className: colDef.className,
                    headerClassName: colDef.headerClassName,
                },
            });
        }

        if (hasActions) {
            cols.push({
                id: '__actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <ActionsCell
                        row={row.original}
                        actions={actions}
                        quickActions={quickActions}
                    />
                ),
                meta: { headerClassName: 'w-24 text-center' },
            });
        }

        return cols;
    }, [columnDefs, showSerialNumber, hasActions, actions, quickActions, pagination, data.length]);

    const table = useReactTable({
        data,
        columns: tanstackColumns,
        getCoreRowModel: getCoreRowModel(),
        // Pagination, filtering, and sorting are handled server-side,
        // so we disable the built-in TanStack handlers for those.
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        pageCount: pagination?.totalPages ?? -1,
        getRowId: (row, index) => {
            if (typeof rowKey === 'function') return String(rowKey(row));
            return String((row as Record<string, unknown>)[rowKey as string] ?? index);
        },
    });

    const totalColumns = table.getAllColumns().length;

    return (
        <div className={cn('space-y-4', className)}>
            {/* ─── Toolbar ─── */}
            {hasToolbar && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {search ? (
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                value={search.value}
                                onChange={(e) => search.onChange(e.target.value)}
                                placeholder={search.placeholder ?? 'Search...'}
                                className="pl-9 pr-3"
                            />
                        </div>
                    ) : (
                        <div />
                    )}

                    {(filters?.length || sort) && (
                        <div className="flex items-center gap-2">
                            {filters?.map((filter) => {
                                const activeOption = filter.options.find(
                                    (opt) => opt.value === filter.value
                                );
                                return (
                                    <DropdownMenu key={filter.key}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn(
                                                    'gap-1.5',
                                                    filter.value && 'border-primary/50 bg-primary/5'
                                                )}
                                            >
                                                <ListFilter className="size-3.5" />
                                                {filter.label}
                                                {activeOption && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-0.5 px-1.5 py-0 text-[10px] leading-4"
                                                    >
                                                        {activeOption.label}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="min-w-[150px]">
                                            <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => filter.onChange('')}>
                                                <span className="flex-1">All</span>
                                                {filter.value === '' && <Check className="size-3.5 text-primary" />}
                                            </DropdownMenuItem>
                                            {filter.options.map((option) => (
                                                <DropdownMenuItem
                                                    key={option.value}
                                                    onClick={() => filter.onChange(option.value)}
                                                >
                                                    <span className="flex-1">{option.label}</span>
                                                    {filter.value === option.value && (
                                                        <Check className="size-3.5 text-primary" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            })}

                            {sort && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={cn(
                                                'gap-1.5',
                                                sort.value && 'border-primary/50 bg-primary/5'
                                            )}
                                        >
                                            <ArrowUpDown className="size-3.5" />
                                            Sort
                                            {sort.value && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-0.5 px-1.5 py-0 text-[10px] leading-4"
                                                >
                                                    {sort.options.find((o) => o.value === sort.value)?.label ?? sort.value}
                                                </Badge>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="min-w-[180px]">
                                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {sort.options.map((option) => (
                                            <DropdownMenuItem
                                                key={option.value}
                                                onClick={() => sort.onChange(option.value)}
                                            >
                                                <span className="flex-1">{option.label}</span>
                                                {sort.value === option.value && (
                                                    <Check className="size-3.5 text-primary" />
                                                )}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ─── Table ─── */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={(header.column.columnDef.meta as any)?.headerClassName}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {/* Loading State */}
                        {isLoading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <SkeletonRow key={i} colCount={totalColumns} />
                            ))}

                        {/* Empty State */}
                        {!isLoading && table.getRowModel().rows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={totalColumns}
                                    className="h-32 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Data Rows */}
                        {!isLoading &&
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={(cell.column.columnDef.meta as any)?.className}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            {/* ─── Pagination ─── */}
            {pagination && pagination.totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() =>
                                    pagination.currentPage > 1 &&
                                    pagination.onPageChange(pagination.currentPage - 1)
                                }
                                className={cn(
                                    'cursor-pointer',
                                    pagination.currentPage === 1 && 'pointer-events-none opacity-50'
                                )}
                            />
                        </PaginationItem>

                        {getPageNumbers(pagination.currentPage, pagination.totalPages).map(
                            (page, idx) =>
                                page === 'ellipsis' ? (
                                    <PaginationItem key={`ellipsis-${idx}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            isActive={page === pagination.currentPage}
                                            onClick={() => pagination.onPageChange(page)}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                        )}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    pagination.currentPage < pagination.totalPages &&
                                    pagination.onPageChange(pagination.currentPage + 1)
                                }
                                className={cn(
                                    'cursor-pointer',
                                    pagination.currentPage === pagination.totalPages &&
                                    'pointer-events-none opacity-50'
                                )}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

export default DataTable;