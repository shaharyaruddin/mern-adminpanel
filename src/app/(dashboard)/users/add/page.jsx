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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRoleEndPoint, registerUserEndPoint, verifyEmailEndPoint } from "../../../../../constraint/api/auth.route";

const formSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    fullname: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cpassword: z.string().min(6, "Confirm password must match"),
    roleId: z.number().min(1, "Role is required"),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords do not match",
    path: ["cpassword"],
  });

export default function AddUserPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
      cpassword: "",
      roleId: undefined,
    },
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempUserId, setTempUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(getRoleEndPoint);
        setRoles(response.data.roles || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await axios.post(registerUserEndPoint, {
        username: values.username,
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        roleId: values.roleId, // Include roleId in registration if supported by API
      });
      if (response.status === 201) {
        setTempUserId(response.data.tempUserId);
        setShowOtpModal(true);
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(verifyEmailEndPoint, {
        code: otp,
        tempUserId,
      });
      if (response.status === 200) {
        setShowOtpModal(false);
        toast.success("User added successfully!");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" type="text" {...field} disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" type="text" {...field} disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Email" type="email" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" type="password" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm password" type="password" {...field} disabled={loading} />
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() || ""}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loading ? "Loading roles..." : "Select a role"} />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id.toString()}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Add User"}
              </Button>
            </form>
          </Form>

          {showOtpModal && (
            <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Enter OTP</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <InputOTP
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      maxLength={6}
                      disabled={loading}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    <div className="flex justify-center gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowOtpModal(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}