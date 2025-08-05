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
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { getTags } from "../../../../../../constraint/api/auth.route";

const formSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
});

export default function EditTag() {
  const { id } = useParams(); 
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchTag = async () => {
      if (!id || isNaN(id)) {
        setError("Invalid tag ID.");
        setFetching(false);
        return;
      }

      setFetching(true);
      try {
        const response = await axios.get(`${getTags}/${id}`);
        const tag = response.data.data; 
        if (!tag || !tag.name) {
          throw new Error("Tag data is incomplete or not found.");
        }
        form.reset({
          name: tag.name || "",
        });
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching tag:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch tag. Please try again."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchTag();
  }, [id, form]);

  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await axios.put(`${getTags}/${id}`, {
        name: values.name,
      });
      if (response.status === 200) {
        toast.success("Tag updated successfully!");
        router.push("/tags"); // Redirect to tags list after update
      }
    } catch (error) {
      console.error("Form submission error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(
        error.response?.data?.message || "Failed to update tag. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="text-center py-10">
        <p>Loading tag data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push("/tags")}
            >
              Back to Tags
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
          <CardTitle>Edit Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tag name"
                        type="text"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Update Tag"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/tags")}
                  disabled={loading}
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
}