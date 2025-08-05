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
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addCategory,  } from "../../../../../constraint/api/auth.route";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
});

export default function AddCategory() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await axios.post(addCategory, values, { timeout: 5000 });
      if (response.status === 201) {
        toast.success("Category added successfully!");
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      let errorMessage = "Failed to add category.";
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Invalid input data.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        type="text"
                        aria-describedby="name-error"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage id="name-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        aria-describedby="description-error"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage id="description-error" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                    Processing...
                  </>
                ) : (
                  "Add Category"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}