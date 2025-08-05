"use client";
import React, { useEffect, useReducer } from "react";
import { fetchReducer } from "../../(api-response)/reducer/FetchReducer";
import { FETCH_INITIAL_STATE } from "../../(api-response)/states/FetchInitialState";
import { FETCH_ACTION_STATE } from "../../(api-response)/states/FetchActionState";
import { getTools } from "../../../../constraint/api/auth.route";
import TableLoader from "@/components/tableLoader";
import { toast } from "sonner";
import axios from "axios";
import { DataNotFound } from "@/components/DataNotFound";
import DataTable from "@/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";

const Tools = () => {
  const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);

  const fetchTools = async () => {
    dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
    try {
      const response = await axios.get(getTools);
      dispatch({ type: FETCH_ACTION_STATE.FETCH_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
      toast.error(
        "Failed to fetch tools: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleDelete = async (tool) => {
    try {
      await axios.delete(`${getTools}/${tool.id}`);
      toast.success("Tool deleted");
      fetchTools();
    } catch (error) {
      toast.error(
        "Failed to delete tool: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const getEditLink = (row) => `/tools/edit/${row.id}`;

  const actions = [
    { label: "Edit", link: getEditLink },
    {
      label: "Delete",
      onClick: handleDelete,
      confirmMessage:
        "Are you sure you want to delete this tool? This action cannot be undone.",
    },
  ];
  
  

  const columnDefs = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "long_description", header: "Long Description" },
    { accessorKey: "visit_link", header: "Visit Link" },
    { accessorKey: "PricingPlan.plan_name", header: "Pricing Plan" },
    { accessorKey: "image", header: "Image" },
    { accessorKey: "background_image", header: "Background Image" },
    { accessorKey: "slug", header: "Slug" },
    { accessorKey: "Category.name", header: "Category" },
    { accessorKey: "Tags", header: "Tags" },
    { accessorKey: "createdAt", header: "Created At" },
  ];

  if (state.LOADING) {
    return <TableLoader />;
  } else if (state.ERROR) {
    return <h2 className="p-4 text-center text-red-500">Error</h2>;
  } else {
    const tools = Array.isArray(state.DATA)
      ? state.DATA
      : state.DATA?.data || [];
    if (tools.length === 0) {
      return <DataNotFound title="Tools not found" />;
    }

    return (
      <div className="p-4 w-full">
        <DataTable
          columns={columnDefs}
          data={tools}
          title="Tools"
          actions={actions}
          sidebarOpen={open}
        >
          {(table) =>
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="truncate">{row.original.id || "N/A"}</TableCell>
                <TableCell className="truncate">{row.original.name || "N/A"}</TableCell>
                <TableCell className="truncate">{row.original.description || "N/A"}</TableCell>
                <TableCell className="truncate">{row.original.long_description || "N/A"}</TableCell>
                <TableCell className="truncate">
                  {row.original.visit_link ? (
                    <a
                      href={row.original.visit_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="truncate"><Badge>{row.original.PricingPlan?.plan_name || "N/A"}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {row.original.image ? (
                      <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URI}/${row.original.image.replace(/\\/g, "/")}`}
                          alt="Tool Image"
                          className="w-full h-full object-cover"
                          onError={() =>
                            console.error(
                              "Avatar Image failed to load:",
                              `${process.env.NEXT_PUBLIC_API_BASE_URI}/${row.original.image.replace(/\\/g, "/")}`
                            )
                          }
                        />
                        <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700">
                          CN
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {row.original.background_image ? (
                      <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URI}/${row.original.background_image.replace(/\\/g, "/")}`}
                          alt="Background Image"
                          className="w-full h-full object-cover"
                          onError={() =>
                            console.error(
                              "Background Image failed to load:",
                              `${process.env.NEXT_PUBLIC_API_BASE_URI}/${row.original.background_image.replace(/\\/g, "/")}`
                            )
                          }
                        />
                        <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700">
                          CN
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="truncate">{row.original.slug || "N/A"}</TableCell>
                <TableCell className="truncate">{row.original.Category?.name || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2 max-w-[150px]">
                    {row.original.Tags?.length > 0 ? (
                      row.original.Tags.map((tag) => (
                        <Badge key={tag.id} variant="default" className="truncate">
                          {tag.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No Tags</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="truncate">{row.original.createdAt || "N/A"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action, index) =>
                        action.link ? (
                          <DropdownMenuItem key={index} className="cursor-pointer">
                            <Link
                              href={action.link(row.original)}
                              className="w-full block"
                            >
                              {action.label}
                            </Link>
                          </DropdownMenuItem>
                        ) : (
                          <AlertDialog key={index}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                {action.label}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {action.confirmMessage}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => action.onClick(row.original)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          }
        </DataTable>
      </div>
    );
  }
};

export default Tools;