import {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";

import { Button } from "./button";
import React from "react";
import { Input } from "./input";
import { ArrowDown, ArrowUp, ArrowUpDown, FunnelIcon } from "lucide-react";
import Pagination from "./pagination";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters?: {
    query?: { column: string; placeholder: string };
    column?: { columns: string[] };
  };
  visibility: boolean;
  onRowSelect?: (row: TData | null) => void;
  selectedRowId?: string | number | null;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
  visibility,
  onRowSelect,
  selectedRowId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [animateInComplete, setAnimateInComplete] = React.useState(false);
  const [triggerAnimation, setTriggerAnimation] = React.useState(false);

  // Track the last processed selectedRowId to prevent infinite loops
  const lastProcessedSelectedRowId = React.useRef<
    string | number | null | undefined
  >(null);

  const initialPageSizeForAnimation = React.useRef(pagination.pageSize).current;

  React.useEffect(() => {
    const triggerTimer = setTimeout(() => {
      setTriggerAnimation(true);
    }, 50);

    const staggerMs = 50;
    const durationMs = 300;
    const animationTimeForOneRow = durationMs;
    const maxDelayForLastRow =
      (initialPageSizeForAnimation > 0 ? initialPageSizeForAnimation - 1 : 0) *
      staggerMs;
    const totalEstimatedTimeUntilLastAnimationFinishes =
      maxDelayForLastRow + animationTimeForOneRow;
    const bufferMs = 200;

    const completeTimer = setTimeout(
      () => {
        setAnimateInComplete(true);
      },
      50 + totalEstimatedTimeUntilLastAnimationFinishes + bufferMs,
    );

    return () => {
      clearTimeout(triggerTimer);
      clearTimeout(completeTimer);
    };
  }, [initialPageSizeForAnimation]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Handle row selection changes and notify parent
  React.useEffect(() => {
    if (!onRowSelect) return;

    const selectedRowKeys = Object.keys(rowSelection).filter(
      (key) => rowSelection[key],
    );

    if (selectedRowKeys.length === 1) {
      const selectedRow = table.getRow(selectedRowKeys[0]);
      if (selectedRow) {
        onRowSelect(selectedRow.original as TData);
        return;
      }
    }

    if (selectedRowKeys.length === 0) {
      onRowSelect(null);
    }
  }, [rowSelection, table, onRowSelect]);

  // Handle external selectedRowId changes
  React.useEffect(() => {
    // Only process if selectedRowId has actually changed
    if (lastProcessedSelectedRowId.current === selectedRowId) {
      return;
    }

    lastProcessedSelectedRowId.current = selectedRowId;

    if (selectedRowId !== undefined && selectedRowId !== null) {
      const rowToSelect = table
        .getCoreRowModel()
        .rows.find((row) => (row.original as any).id === selectedRowId);

      if (rowToSelect && !rowToSelect.getIsSelected()) {
        setRowSelection({ [rowToSelect.id]: true });
      }
    } else {
      // Only clear selection if there's currently a selection
      if (Object.keys(rowSelection).length > 0) {
        setRowSelection({});
      }
    }
  }, [selectedRowId, table, rowSelection]);

  // Handle manual row clicks
  const handleRowClick = React.useCallback(
    (rowId: string, currentSelectedState: boolean) => {
      const newSelection = !currentSelectedState ? { [rowId]: true } : {};
      setRowSelection(newSelection);
    },
    [],
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center pb-3">
        {filters && filters.query && (
          <Input
            placeholder={filters.query.placeholder}
            value={
              (table
                .getColumn(filters.query.column)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(filters.query!.column)
                ?.setFilterValue(event.target.value)
            }
          />
        )}
        {visibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {filters && filters.column && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-2 text-muted-foreground font-semibold"
              >
                <FunnelIcon className="w-3 h-3" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="rounded-md border border-data-table-border grow flex flex-col justify-between overflow-hidden">
        <Table className="bg-data-table-background">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-data-table-header-background text-data-table-header-text hover:bg-data-table-header-background"
              >
                {headerGroup.headers.map((header, i) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center gap-2",
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                  ? "Sort descending"
                                  : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() &&
                            ({
                              asc: <ArrowUp className="ml-2 h-4 w-4" />,
                              desc: <ArrowDown className="ml-2 h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                            ))}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    i % 2 == 0
                      ? "bg-data-table-even-row-background"
                      : "bg-data-table-odd-row-background",
                    "hover:bg-data-table-accent/20 data-[state=selected]:bg-data-table-accent/30",
                    "cursor-pointer",
                  )}
                  style={{
                    opacity: triggerAnimation ? 1 : 0,
                    borderBottomWidth:
                      i === table.getRowModel().rows.length - 1 ? "0px" : "1px",
                    borderBottomStyle: "solid",
                    borderBottomColor:
                      i === table.getRowModel().rows.length - 1
                        ? "transparent"
                        : triggerAnimation
                          ? " oklch(0.922 0 0)"
                          : "transparent",
                    transition: !animateInComplete
                      ? `opacity 0.3s ease-in-out ${i * 50}ms, border-bottom-color 0.3s ease-in-out ${i * 50}ms`
                      : "none",
                  }}
                  onClick={() => handleRowClick(row.id, row.getIsSelected())}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination table={table} divProps={{ className: "border-t" }} />
      </div>
    </div>
  );
}
