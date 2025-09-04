"use client";
import React, { useReducer, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { fetchReducer } from "@/app/(api-response)/reducer/FetchReducer";
import { FETCH_INITIAL_STATE } from "@/app/(api-response)/states/FetchInitialState";
import { FETCH_ACTION_STATE } from "@/app/(api-response)/states/FetchActionState";
import { addCategory } from "../../../../../constraint/api/auth.route";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(5, "Description is required"),
});

const AddCategory = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });


  async function onSubmit(values, event) {
    event.preventDefault(); // Prevent default submission
    dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
    toast.info("Creating category...", { id: "creating-category" });
    try {
      const { data } = await axios.post(addCategory, values, { timeout: 5000 });
      dispatch({ type: FETCH_ACTION_STATE.FETCH_SUCCESS, payload: data });
      toast.success("Category created successfully!");
      toast.dismiss("creating-category");
      form.reset();
      router.push("/categories");
    } catch (error) {
      console.error("Error creating category:", {
        message: error,
        status: error.response?.status,
        data: error.response?.data,
      });
      dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
      let errorMessage = "Failed to create category.";
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Invalid input data.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      toast.error(errorMessage);
      toast.dismiss("creating-category");
    } finally {
      dispatch({ type: FETCH_ACTION_STATE.FETCH_COMPLETE });
    }
  }

  const isLoading = !state.LOADING;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values, event) => onSubmit(values, event))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent Enter key submission
                }
              }}
              className="space-y-8"
              autoComplete="off"
            >
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
                        aria-describedby="name-error"
                        {...field}
                        disabled={isLoading}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage id="name-error" />
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
                        aria-describedby="description-error"
                        {...field}
                        disabled={isLoading}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage id="description-error" />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      Processing...
                    </>
                  ) : (
                    "Add Category"
                  )}
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

export default AddCategory;