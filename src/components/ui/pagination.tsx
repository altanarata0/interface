import React from "react";
import { Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import { DropdownMenuTrigger } from "node_modules/@radix-ui/react-dropdown-menu/dist";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";

type PaginationProps<T> = {
  table: Table<T>;
  divProps?: React.ComponentProps<"div">;
};

function Pagination<T>({ table, divProps }: PaginationProps<T>) {
  const {
    getState,
    setPageSize,
    nextPage,
    previousPage,
    getCanNextPage,
    getCanPreviousPage,
    getPageCount,
    setPageIndex,
    getFilteredRowModel,
  } = table;

  const pagination = getState().pagination;
  const pageSize = pagination.pageSize;
  const pageIndex = pagination.pageIndex;
  const rowCount = getFilteredRowModel().rows.length;
  const pageCount = getPageCount();

  const from = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <div
      className={cn(
        "flex justify-around items-center text-sm py-2 px-2",
        divProps?.className,
      )}
    >
      {/* Page Size Dropdown */}
      <div className="hidden xl:flex items-center">
        <span className="mr-2">Page Size:</span>
        <Select
          value={pageSize?.toString()}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger className="px-1.5 py-1 gap-0.5 data-[size=default]:h-fit cursor-pointer">
            {pageSize}
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden lg:block w-fit">{`${from} to ${to} of ${rowCount}`}</div>

      {/* Pagination Controls */}
      <div className="flex items-center">
        <button
          onClick={() => setPageIndex(0)}
          disabled={!getCanPreviousPage()}
          className="disabled:opacity-50 cursor-pointer hover:bg-muted rounded p-0.5 disabled:hover:bg-transparent disabled:hover:cursor-not-allowed"
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!getCanPreviousPage()}
          className="disabled:opacity-50 cursor-pointer hover:bg-muted rounded p-0.5 disabled:hover:bg-transparent disabled:hover:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <div className="hidden sm:block px-1">{`Page ${pageIndex + 1} of ${pageCount}`}</div>
        <button
          onClick={() => nextPage()}
          disabled={!getCanNextPage()}
          className="disabled:opacity-50 cursor-pointer hover:bg-muted rounded p-0.5 disabled:hover:bg-transparent disabled:hover:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setPageIndex(pageCount - 1)}
          disabled={!getCanNextPage()}
          className="disabled:opacity-50 cursor-pointer hover:bg-muted rounded p-0.5 disabled:hover:bg-transparent disabled:hover:cursor-not-allowed"
        >
          <ChevronsRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
