"use client";
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUpDown, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useSidebar } from "./ui/sidebar";

// Capitalize utility
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Utility to get nested value
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, part) => current?.[part], obj);
};

const DataTable = ({
  columns: columnDefs = [],
  data = [],
  renderRow,
  children,
  title = "Data Table",
  className = "",
  numericColumns = [],
  getRowId = (row, index) => index,
  actions = [],
  sidebarOpen = false, // Controls whether sidebar is open or collapsed
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

  // Validate columns and data
  const validatedColumns = useMemo(() => {
    if (!Array.isArray(columnDefs) || columnDefs.length === 0) {
      console.warn("DataTable: 'columns' must be a non-empty array");
      return [];
    }

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("DataTable: 'data' must be a non-empty array");
      return columnDefs;
    }

    return columnDefs.map((def) => {
      if (typeof def === "string") {
        return {
          accessorKey: def,
          header: ({ column }) => (
            <div
              className="flex items-center cursor-pointer"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {capitalize(def)}
              {column.getCanSort() && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </div>
          ),
          cell: ({ row, getValue }) => {
            const value = getNestedValue(row.original, def);
            return (
              <div
                className={clsx(
                  "truncate",
                  numericColumns.includes(def.split(".")[0]) ? "text-right" : ""
                )}
              >
                {typeof value === "object" && value !== null
                  ? value.name || JSON.stringify(value)
                  : value || "N/A"}
              </div>
            );
          },
          enableSorting: true,
        };
      }
      return {
        ...def,
        header: ({ column }) => (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {def.header}
            {column.getCanSort() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </div>
        ),
        cell: ({ row }) => {
          const value = getNestedValue(row.original, def.accessorKey);
          return (
            <div
              className={clsx(
                "truncate",
                numericColumns.includes(def.accessorKey.split(".")[0])
                  ? "text-right"
                  : ""
              )}
            >
              {typeof value === "object" && value !== null
                ? value.name || JSON.stringify(value)
                : value || "N/A"}
            </div>
          );
        },
        enableSorting: true,
      };
    });
  }, [columnDefs, data, numericColumns]);

  const table = useReactTable({
    data,
    columns: validatedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getRowId,
  });

  // Determine how to render rows with actions
  const renderRows = () => {
    if (children) {
      return children(table);
    } else if (renderRow) {
      return table.getRowModel().rows.map((row) => renderRow(row));
    } else {
      return table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id} className="truncate">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
          {actions.length > 0 && (
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => {
                    const isBlockAction =
                      action.label === "block" || action.label === "unblock";
                    const label =
                      isBlockAction && row.original.isActive === false
                        ? "unblock"
                        : action.label === "unblock"
                        ? "block"
                        : action.label;
                    const confirmMessage =
                      action.confirmMessage ||
                      `Are you sure you want to ${label.toLowerCase()} this user?`;

                    if (action.link) {
                      return (
                        <DropdownMenuItem
                          key={index}
                          className="cursor-pointer"
                        >
                          <Link
                            href={
                              typeof action.link === "function"
                                ? action.link(row.original)
                                : action.link
                            }
                            rel="noopener noreferrer"
                            className="w-full block"
                          >
                            {label}
                          </Link>
                        </DropdownMenuItem>
                      );
                    } else {
                      return (
                        <AlertDialog key={index}>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              {label}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Action
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {confirmMessage} This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick?.(row.original);
                                  toast.success(`${label} action completed`);
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      );
                    }
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          )}
        </TableRow>
      ));
    }
  };

  return (
    <div className={clsx("rounded-xl border p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium capitalize text-xl">{title}</h3>
        <Input
          placeholder={`Filter ${title.toLowerCase()}...`}
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div
        className={clsx(
          "table-container max-h-[600px] overflow-x-auto border rounded-xl",
          useSidebar().open ? "max-w-[76vw]" : "max-w-[90vw]",
          "w-full box-border min-w-[300px]"
        )}
      >
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="dark:bg-[#262626] bg-[#F4F4F5]"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="truncate">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                {actions.length > 0 && <TableHead>Actions</TableHead>}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              renderRows()
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    validatedColumns.length + (actions.length > 0 ? 1 : 0)
                  }
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Rows per page <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[5, 10, 20].map((pageSize) => (
              <DropdownMenuItem
                key={pageSize}
                onClick={() => table.setPageSize(pageSize)}
              >
                {pageSize}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DataTable;
