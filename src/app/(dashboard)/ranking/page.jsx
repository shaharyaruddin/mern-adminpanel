"use client";
import React, { useEffect, useReducer } from "react";
import { fetchReducer } from "../../(api-response)/reducer/FetchReducer";
import { FETCH_INITIAL_STATE } from "../../(api-response)/states/FetchInitialState";
import { FETCH_ACTION_STATE } from "../../(api-response)/states/FetchActionState";
import axios from "axios";
import TableLoader from "@/components/tableLoader";
import { toast } from "sonner";
import { DataNotFound } from "@/components/DataNotFound";
import DataTable from "@/components/DataTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { getRankedTools } from "../../../../constraint/api/auth.route";


const RankingTool = () => {
  const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);

  const fetchRankedTools = async () => {
    dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
    try {
      const response = await axios.get(getRankedTools);
      dispatch({ type: FETCH_ACTION_STATE.FETCH_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
      toast.error(
        "Failed to fetch ranked tools: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchRankedTools();
  }, []);

  const columnDefs = [
    { accessorKey: "name", header: "Tool Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "averageRating", header: "Average Rating" },
    { accessorKey: "Tags", header: "Tags" },
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
      return <DataNotFound title="Ranked tools not found" />;
    }

    return (
      <div className="p-4 w-full">
        <DataTable
          columns={columnDefs}
          data={tools}
          title="Ranked Tools"
          showFooter={false}
        >
          {(table) =>
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="truncate">{row.original.name || "N/A"}</TableCell>
                <TableCell className="truncate">{row.original.description || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {row.original.averageRating ? (
                      <>
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < Math.round(parseFloat(row.original.averageRating))
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm">
                          ({parseFloat(row.original.averageRating).toFixed(1)})
                        </span>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </TableCell>
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
              </TableRow>
            ))
          }
        </DataTable>
      </div>
    );
  }
};

export default RankingTool;