"use client";
import React, { useEffect, useReducer } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { fetchReducer } from "@/app/(api-response)/reducer/FetchReducer";
import { FETCH_INITIAL_STATE } from "@/app/(api-response)/states/FetchInitialState";
import { FETCH_ACTION_STATE } from "@/app/(api-response)/states/FetchActionState";
import { getCategories } from "../../../../../../constraint/api/auth.route";


const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
});

const EditCategory = () => {
  const { id } = useParams();
  const router = useRouter();
  const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Fetch category data by ID
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id || isNaN(id)) {
        dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
        toast.error("Invalid category ID.");
        return;
      }

      dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
      try {
        const { data } = await axios.get(`${getCategories}/${id}`, { timeout: 10000 });
        const category = data.data;
        if (!category || !category.name || !category.description) {
          throw new Error("Category data is incomplete or not found.");
        }
        form.reset({
          name: category.name || "",
          description: category.description || "",
        });
        dispatch({ type: FETCH_ACTION_STATE.FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
        toast.error(error.response?.data?.message || "Failed to fetch category.");
      }
    };

    fetchCategory();
  }, [id, form]);

  async function onSubmit(values) {
    dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
    try {
      const { data } = await axios.put(`${getCategories}/${id}`, values, { timeout: 10000 });
      dispatch({ type: FETCH_ACTION_STATE.FETCH_SUCCESS, payload: data });
      toast.success("Category updated successfully!");
      router.push("/categories");
    } catch (error) {
      dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
      toast.error(error.response?.data?.message || "Failed to update category.");
    }
  }

  const isLoading = state.LOADING;
  const categoryData = state.DATA?.data || {};

  if (isLoading && (!categoryData || Object.keys(categoryData).length === 0)) {
    return <div className="text-center py-10">Loading category data...</div>;
  }

  if (state.ERROR || !categoryData.name) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{state.ERROR ? "Failed to load category." : "Category not found"}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push("/categories")}
            >
              Back to Categories
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Category: {categoryData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        type="text"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Update Category"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/categories")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;