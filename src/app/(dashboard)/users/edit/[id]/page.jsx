"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useReducer, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "next/navigation";
import { getRoleEndPoint, getUserUpdateEndPoint, getUserWithIdORUsernameEndPoint } from "../../../../../../constraint/api/auth.route";
import { combinedFetchReducer, COMBINED_FETCH_INITIAL_STATE, COMBINED_FETCH_ACTION_STATE } from "../../../../(api-response)/reducer/CombinedFetchReducer";

// Spinner styles (inline for simplicity, move to CSS file if preferred)
const spinnerStyles = `
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
    display: inline-block;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  fullname: z.string().min(1, "Full name is required"),
  roleId: z.number().min(1, "Role is required"),
});

export default function EditUserPage() {
  const params = useParams();
  const param = params.id; 

  

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullname: "",
      roleId: undefined,
    },
  });

  // Use single combined reducer for both user and roles
  const [state, dispatch] = useReducer(combinedFetchReducer, COMBINED_FETCH_INITIAL_STATE);

  // Fetch roles
  useEffect(() => {
    dispatch({ type: COMBINED_FETCH_ACTION_STATE.FETCH_START });
    const fetchRoles = async () => {
      try {
        const response = await axios.get(getRoleEndPoint);
        dispatch({ type: COMBINED_FETCH_ACTION_STATE.FETCH_SUCCESS, resource: "roles", payload: response.data.roles || [] });
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles: " + (error.response?.data?.message || error.message));
        dispatch({ type: COMBINED_FETCH_ACTION_STATE.FETCH_ERROR });
      }
    };
    fetchRoles();
  }, []);

  // Fetch user data
  useEffect(() => {
    if (param) {
      dispatch({ type: COMBINED_FETCH_ACTION_STATE.FETCH_START });
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${getUserWithIdORUsernameEndPoint}/${param}`);
          const user = response.data.data;
          if (!user) throw new Error("No user data in response");
          dispatch({ type: COMBINED_FETCH_ACTION_STATE.FETCH_SUCCESS, resource: "user", payload: user });
          form.reset({
            username: user.username,
            fullname: user.fullname,
            roleId: user.Role?.id || undefined, // Set default roleId from user data
          });
        } catch (error) {
          console.error("Error fetching user:", error);
          dispatch({ type: COMBINED_FETCH_ACTION_STATE.FETCH_ERROR, payload: error.response?.data?.message || "Failed to fetch user data" });
          toast.error(error.response?.data?.message || "Failed to fetch user data: " + error.message);
        }
      };
      fetchUser();
    } else {
      dispatch({ type: COMBINED_FETCH_ACTION_STATE.FETCH_ERROR, payload: "No user parameter provided" });
    }
  }, [param, form]);

  async function onSubmit(values) {
    dispatch({ type: COMBINED_FETCH_ACTION_STATE.FETCH_START });
    try {
      const updateData = {
        userId: state.user?.id,
        username: values.username,
        fullname: values.fullname,
        roleId: Number(values.roleId), 
      };
      const response = await axios.put(`${getUserUpdateEndPoint}`, updateData);
      if (response.status === 200) {
        toast.success("User updated successfully!");
        dispatch({ type: COMBINED_FETCH_ACTION_STATE.FETCH_SUCCESS, resource: "user", payload: { ...state.user, ...updateData } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user. Please try again. Status: " + error.response?.status);
      dispatch({ type: COMBINED_FETCH_ACTION_STATE.FETCH_ERROR, payload: error.response?.data?.message || "Failed to update user" });
    }
  }

  const isLoading = state.loading;
  const userData = state.user || {};
  const rolesData = state.roles || [];
  const errorMessage = state.error || "";

  if (isLoading && (!userData || Object.keys(userData).length === 0)) {
    return (
      <div className="text-center py-10">
        <div className="spinner" /> Loading...
      </div>
    );
  }

  if (state.error || !userData) {
    return (
      <div className="text-center py-10">
        User not found{errorMessage ? `: ${errorMessage}` : ""}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <style>{spinnerStyles}</style> {/* Inject spinner styles */}
      <Card>
        <CardHeader>
          <CardTitle>Edit User: {userData.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      {isLoading ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className="spinner" style={{ marginRight: "10px" }} />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <Input placeholder="Enter your username" type="text" {...field} disabled={isLoading} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      {isLoading ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className="spinner" style={{ marginRight: "10px" }} />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <Input placeholder="Enter your name" type="text" {...field} disabled={isLoading} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      {isLoading ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className="spinner" style={{ marginRight: "10px" }} />
                          <span>Loading roles...</span>
                        </div>
                      ) : (
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))} // Convert to number
                          value={field.value?.toString() || ""} // Use form value as default
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {rolesData.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update User"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}