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
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addPricingPlan } from "../../../../../../constraint/api/auth.route";



const formSchema = z.object({
  plan_name: z.string().min(1, "Plan name is required"),
});

export default function AddPricingPlan() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      plan_name: "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await axios.post(addPricingPlan, values, { timeout: 5000 });
      if (response.status === 201) {
        toast.success("Pricing plan added successfully!");
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      let errorMessage = "Failed to add pricing plan.";
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
          <CardTitle>Add New Pricing Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="plan_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter pricing plan name"
                        type="text"
                        aria-describedby="plan-name-error"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage id="plan-name-error" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>  
                    Processing...
                  </>
                ) : (
                  "Add Pricing Plan"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}