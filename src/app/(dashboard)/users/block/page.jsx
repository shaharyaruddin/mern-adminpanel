"use client";
import DataTable from "@/components/DataTable";
import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getAllBlockUserEndPoint, userBlockOrUnblockEndPoint } from "../../../../../constraint/api/auth.route";
import { FETCH_ACTION_STATE } from "@/app/(api-response)/states/FetchActionState";
import TableLoader from "@/components/tableLoader";
import { fetchReducer } from "@/app/(api-response)/reducer/FetchReducer";
import { FETCH_INITIAL_STATE } from "@/app/(api-response)/states/FetchInitialState";
import { DataNotFound } from "@/components/DataNotFound";

const Page = () => {
  const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);

  const fetchUsers = async () => {
    dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
    try {
      const { data } = await axios.get(getAllBlockUserEndPoint);
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

  const handleBlockUser = async (user) => {
    try {
      await axios.put(userBlockOrUnblockEndPoint, {
        userId: user.id,
        isActive: true, // Unblock the user by setting isActive to true
      });
      toast.success("User unblocked");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      toast.error("Failed to unblock user: " + (error.response?.data?.message || error.message));
      console.log(error);
    }
  };

  const actions = [
    {
      label: "unblock",
      onClick: handleBlockUser,
      confirmMessage: "Are you sure you want to unblock this user? This will restore their access.",
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
            title="Block User"
            showFooter={false}
            actions={actions}
          />
        </div>
      );
    }
  }
};

export default Page;