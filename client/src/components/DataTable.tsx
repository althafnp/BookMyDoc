import React from 'react';
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
    accessor: keyof T | string | ((row: T) => unknown);
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
    /** Unique key for the filter */
    key: string;
    /** Label shown on the dropdown trigger */
    label: string;
    /** Available options */
    options: FilterOption[];
    /** Currently selected value (empty string = "All"/no filter) */
    value: string;
    /** Callback when selection changes */
    onChange: (value: string) => void;
};

export type SortOption = {
    label: string;
    value: string;
};

export type SortDef = {
    /** Available sort options */
    options: SortOption[];
    /** Currently selected sort value */
    value: string;
    /** Callback when sort changes */
    onChange: (value: string) => void;
};

type DataTableProps<T> = {
    /** Column definitions */
    columns: ColumnDef<T>[];
    /** Data array */
    data: T[];
    /** Unique key extractor for each row */
    rowKey: keyof T | ((row: T) => string | number);
    /** Optional serial number column */
    showSerialNumber?: boolean;
    /** Actions dropdown items - shown as a "⋯" menu in the last column */
    actions?: ActionItem<T>[];
    /** Quick action buttons rendered inline (e.g., Edit, Delete) */
    quickActions?: {
        edit?: (row: T) => void;
        softDelete?: (row: T) => void;
        view?: (row: T) => void;
    };
    /** Pagination */
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    /** Search */
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    };
    /** Filter dropdowns (supports multiple filters) */
    filters?: FilterDef[];
    /** Sort dropdown */
    sort?: SortDef;
    /** Loading state */
    isLoading?: boolean;
    /** Empty state message */
    emptyMessage?: string;
    /** Additional className for the container */
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

function getCellValue<T>(
    row: T,
    accessor: ColumnDef<T>['accessor']
): unknown {
    if (typeof accessor === 'function') {
        return accessor(row);
    }
    if (typeof accessor === 'string' && accessor.includes('.')) {
        return getNestedValue(row, accessor);
    }
    return (row as Record<string, unknown>)[accessor as string];
}

function getRowKeyValue<T>(
    row: T,
    rowKey: DataTableProps<T>['rowKey']
): string | number {
    if (typeof rowKey === 'function') {
        return rowKey(row);
    }
    return row[rowKey] as string | number;
}

// ─── Skeleton Row ───────────────────────────────────────

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

// ─── Cell Renderers ─────────────────────────────────────

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
                } else if (typeof column.imageAlt === 'string') {
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
            const formatted = date.toLocaleDateString(
                'en-IN',
                column.dateOptions ?? {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }
            );
            return <span>{formatted}</span>;
        }

        case 'custom': {
            return column.render ? <>{column.render(row, rowIndex)}</> : null;
        }

        case 'text':
        default:
            return (
                <span className="text-sm">
                    {value != null ? String(value) : '—'}
                </span>
            );
    }
}

// ─── Pagination Helper ──────────────────────────────────

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [1];

    if (current > 3) pages.push('ellipsis');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push('ellipsis');

    pages.push(total);
    return pages;
}

// ─── Main Component ─────────────────────────────────────

function DataTable<T>({
    columns,
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
    const totalColumns =
        columns.length +
        (showSerialNumber ? 1 : 0) +
        (hasActions ? 1 : 0);

    const hasToolbar = !!(search || filters?.length || sort);

    return (
        <div className={cn('space-y-4', className)}>
            {/* ─── Toolbar: Search (left) | Filters + Sort (right) ─── */}
            {hasToolbar && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: Search */}
                    {search ? (
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                value={search.value}
                                onChange={(e) => search.onChange(e.target.value)}
                                placeholder={search.placeholder ?? 'Search...'}
                                className='pl-9 pr-3'
                            />
                        </div>
                    ) : (
                        <div />
                    )}

                    {/* Right: Filters + Sort */}
                    {(filters?.length || sort) && (
                        <div className="flex items-center gap-2">
                            {/* Filter Dropdowns */}
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

                                            {/* "All" / reset option */}
                                            <DropdownMenuItem
                                                onClick={() => filter.onChange('')}
                                            >
                                                <span className="flex-1">All</span>
                                                {filter.value === '' && (
                                                    <Check className="size-3.5 text-primary" />
                                                )}
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

                            {/* Sort Dropdown */}
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
                                                    {sort.options.find(
                                                        (o) => o.value === sort.value
                                                    )?.label ?? sort.value}
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
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            {showSerialNumber && (
                                <TableHead className="w-12 text-center">
                                    #
                                </TableHead>
                            )}
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={col.headerClassName}
                                >
                                    {col.label}
                                </TableHead>
                            ))}
                            {hasActions && (
                                <TableHead className="w-24 text-center">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {/* Loading State */}
                        {isLoading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <SkeletonRow key={i} colCount={totalColumns} />
                            ))}

                        {/* Empty State */}
                        {!isLoading && data.length === 0 && (
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
                            data.map((row, rowIndex) => (
                                <TableRow key={getRowKeyValue(row, rowKey)}>
                                    {showSerialNumber && (
                                        <TableCell className="text-center text-muted-foreground">
                                            {pagination
                                                ? (pagination.currentPage - 1) *
                                                      data.length +
                                                  rowIndex +
                                                  1
                                                : rowIndex + 1}
                                        </TableCell>
                                    )}

                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={col.className}
                                        >
                                            <CellContent
                                                column={col}
                                                row={row}
                                                rowIndex={rowIndex}
                                            />
                                        </TableCell>
                                    ))}

                                    {hasActions && (
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                {/* Quick Action Buttons */}
                                                {quickActions?.view && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon-xs"
                                                                    onClick={() =>
                                                                        quickActions.view!(row)
                                                                    }
                                                                >
                                                                    <Eye className="size-3.5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                View
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}

                                                {quickActions?.edit && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon-xs"
                                                                    onClick={() =>
                                                                        quickActions.edit!(row)
                                                                    }
                                                                >
                                                                    <Pencil className="size-3.5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Edit
                                                            </TooltipContent>
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
                                                                    onClick={() =>
                                                                        quickActions.softDelete!(row)
                                                                    }
                                                                >
                                                                    <Trash2 className="size-3.5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Delete
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}

                                                {/* Dropdown Actions */}
                                                {actions && actions.length > 0 && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-xs"
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {actions
                                                                .filter(
                                                                    (action) =>
                                                                        !action.show ||
                                                                        action.show(row)
                                                                )
                                                                .map((action, idx, arr) => (
                                                                    <React.Fragment key={action.label}>
                                                                        <DropdownMenuItem
                                                                            variant={action.variant}
                                                                            onClick={() =>
                                                                                action.onClick(row)
                                                                            }
                                                                        >
                                                                            {action.icon}
                                                                            {action.label}
                                                                        </DropdownMenuItem>
                                                                        {/* Separator before destructive items */}
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
                                        </TableCell>
                                    )}
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
                                    pagination.currentPage === 1 &&
                                        'pointer-events-none opacity-50'
                                )}
                            />
                        </PaginationItem>

                        {getPageNumbers(
                            pagination.currentPage,
                            pagination.totalPages
                        ).map((page, idx) =>
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