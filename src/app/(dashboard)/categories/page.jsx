"use client";
import React, { useEffect, useReducer } from "react";
import TableLoader from "@/components/tableLoader";
import { toast } from "sonner";
import axios from "axios";
import { DataNotFound } from "@/components/DataNotFound";
import DataTable from "@/components/DataTable";
import { fetchReducer } from "../../(api-response)/reducer/FetchReducer";
import { FETCH_INITIAL_STATE } from "../../(api-response)/states/FetchInitialState";
import { FETCH_ACTION_STATE } from "../../(api-response)/states/FetchActionState";
import { getCategories } from "../../../../constraint/api/auth.route";

const Categories = () => {
  const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);

  const fetchCategories = async () => {
    dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
    try {
      const { data } = await axios.get(getCategories, { timeout: 10000 });
      dispatch({ type: FETCH_ACTION_STATE.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
      toast.error("Failed to fetch categories: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (category) => {
    try {
      await axios.delete(`${getCategories}/${category.id}`, { timeout: 10000 });
      fetchCategories(); 
    } catch (error) {
      toast.error("Failed to delete category: " + (error.response?.data?.message || error.message));
    }
  };

  const getEditLink = (row) => `/categories/edit/${row.id}`;

  const actions = [
    { label: "Edit", link: getEditLink },
    {
      label: "Delete",
      onClick: handleDelete,
      confirmMessage: "Are you sure you want to delete this category? This action cannot be undone.",
    },
  ];

  const categoryTableColumns = ["id", "name", "description"];

  if (state.LOADING) {
    return <TableLoader />;
  } else if (state.ERROR) {
    return <h2 className="p-4 text-center text-red-500">Error</h2>;
  } else {
    const categories = Array.isArray(state.DATA) ? state.DATA : (state.DATA?.data || []);
    if (categories.length === 0) {
      return <DataNotFound title="Categories not found" />;
    } else {
      return (
        <div className="p-4">
          <DataTable
            data={categories}
            columns={categoryTableColumns}
            title="Categories"
            showFooter={false}
            actions={actions}
          />
        </div>
      );
    }
  }
};

export default Categories;