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
import { getPricingPlan } from "../../../../../../../constraint/api/auth.route";



const formSchema = z.object({
  plan_name: z.string().min(1, "Plan name is required"),
});

export default function EditPricingPlan() {
  const { id } = useParams();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan_name: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPricingPlan = async () => {
      if (!id || isNaN(id)) {
        setError("Invalid pricing plan ID.");
        setFetching(false);
        return;
      }

      setFetching(true);
      try {
        const response = await axios.get(`${getPricingPlan}/${id}`);
        const plan = response.data.data;
        if (!plan || !plan.plan_name) {
          throw new Error("Pricing plan data is incomplete or not found.");
        }
        form.reset({
          plan_name: plan.plan_name || "",
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching pricing plan:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch pricing plan. Please try again."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchPricingPlan();
  }, [id, form]);

  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await axios.put(`${getPricingPlan}/${id}`, {
        plan_name: values.plan_name,
      });
      if (response.status === 200) {
        toast.success("Pricing plan updated successfully!");
        router.push("/pricing-plans");
      }
    } catch (error) {
      console.error("Form submission error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(
        error.response?.data?.message || "Failed to update pricing plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="text-center py-10">
        <p>Loading pricing plan data...</p>
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
              onClick={() => router.push("/pricing-plans")}
            >
              Back to Pricing Plans
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
          <CardTitle>Edit Pricing Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="plan_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter pricing plan name"
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
                  {loading ? "Processing..." : "Update Pricing Plan"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/pricing-plans")}
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