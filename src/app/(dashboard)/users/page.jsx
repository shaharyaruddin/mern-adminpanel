"use client";
import DataTable from "@/components/DataTable";
import React, { useEffect, useReducer } from "react";
import { fetchReducer } from "../../(api-response)/reducer/FetchReducer";
import { FETCH_INITIAL_STATE } from "../../(api-response)/states/FetchInitialState";
import { FETCH_ACTION_STATE } from "../../(api-response)/states/FetchActionState";
import axios from "axios";
import { getAllUserEndPoint, userBlockOrUnblockEndPoint } from "../../../../constraint/api/auth.route";
import TableLoader from "../../../components/tableLoader";
import { toast } from "sonner";
import { DataNotFound } from "@/components/DataNotFound";
// Import DialogConfirmation for potential reuse, but not rendered here
import { DialogConfirmation } from "@/components/ui/DialogConfirmation";

const Page = () => {
  const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);

  const fetchUsers = async () => {
    dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
    try {
      const { data } = await axios.get(getAllUserEndPoint);
      dispatch({ type: FETCH_ACTION_STATE.FETCH_SUCCESS, payload: data.users || data });
    } catch (error) {
      dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
      toast.error("Failed to fetch users: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const userTableColumns = ["id", "username", "fullname", "email", "role"];

  const handleDelete = async (user) => {
    try {
      await axios.delete(`/api/users/${user.id}`); // Example delete endpoint, adjust as needed
      toast.success("User deleted");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      toast.error("Failed to delete user: " + (error.response?.data?.message || error.message));
      console.log(error);
    }
  };

  const handleBlockUser = async (user) => {
    try {
      await axios.put(userBlockOrUnblockEndPoint, {
        userId: user.id,
        isActive: false, // Blocking the user by setting isActive to false
      });
      toast.success("User blocked");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      toast.error("Failed to block user: " + (error.response?.data?.message || error.message));
      console.log(error);
    }
  };

  const getEditLink = (row) => `/users/edit/${row.id}`; // Function to generate edit link

  const actions = [
    { label: "Edit", link: getEditLink }, // Edit action with dynamic link
    {
      label: "Block",
      onClick: handleBlockUser,
      confirmMessage: "Are you sure you want to block this user? This will restrict their access.",
    },
    {
      label: "Delete",
      onClick: handleDelete,
      confirmMessage: "Are you sure you want to delete this user? This action cannot be undone.",
    },
  ];

  if (state.LOADING) {
    return <TableLoader />;
  } else if (state.ERROR) {
    return <h2 className="p-4 text-center text-red-500">Error</h2>;
  } else {
    const users = Array.isArray(state.DATA) ? state.DATA : (state.DATA?.users || []);
    if (users.length === 0) {
      return <DataNotFound title="Users not found" />;
    } else {
      return (
        <div className="p-4">
          <DataTable
            data={users}
            columns={userTableColumns}
            title="Users"
            showFooter={false}
            actions={actions}
          />
        </div>
      );
    }
  }
};

export default Page;