"use client";
import React, { useEffect, useReducer, useState } from "react";
import { fetchReducer } from "@/app/(api-response)/reducer/FetchReducer";
import { FETCH_INITIAL_STATE } from "@/app/(api-response)/states/FetchInitialState";
import { FETCH_ACTION_STATE } from "@/app/(api-response)/states/FetchActionState";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import clsx from "clsx";
import TableLoader from "@/components/tableLoader";
import { DataNotFound } from "@/components/DataNotFound";
import { addTool, getCategories, getPricingPlan, getTags } from "../../../../../constraint/api/auth.route";
import { useRouter } from "next/navigation";

const API_ENDPOINTS = {
  TAGS: getTags,
  CATEGORIES: getCategories,
  PRICING_PLANS: getPricingPlan,
  ADD_TOOL: addTool,
};

const AddTool = () => {
  const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    long_description: "",
    visit_link: "",
    pricing_plan_id: "",
    github_uri: "",
    youtube_uri: "",
    x_uri: "",
    facebook_uri: "",
    instagram_uri: "",
    categoryId: "",
    tagIds: [],
  });
  const [image, setImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tags, categories, and pricing plans
  const fetchData = async () => {
    dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
    try {
      const [tagsResponse, categoriesResponse, pricingPlansResponse] =
        await Promise.all([
          axios.get(API_ENDPOINTS.TAGS),
          axios.get(API_ENDPOINTS.CATEGORIES),
          axios.get(API_ENDPOINTS.PRICING_PLANS),
        ]);
      dispatch({
        type: FETCH_ACTION_STATE.FETCH_SUCCESS,
        payload: {
          tags: tagsResponse.data?.data || [],
          categories: categoriesResponse.data?.data || [],
          pricingPlans: pricingPlansResponse.data?.data.map((plan) => ({
            id: plan.id,
            name: plan.plan_name,
          })) || [],
        },
      });
    } catch (error) {
      dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
      toast.error(
        "Failed to fetch data: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (value) => {
    setFormData((prev) => {
      const tagIds = prev.tagIds.includes(value)
        ? prev.tagIds.filter((id) => id !== value)
        : [...prev.tagIds, value];
      return { ...prev, tagIds };
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "image") {
      setImage(file);
    } else if (type === "background_image") {
      setBackgroundImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.long_description ||
      !formData.visit_link ||
      !formData.pricing_plan_id ||
      !image ||
      !backgroundImage
    ) {
      toast.error("Please fill all required fields, including image and background image.");
      setIsSubmitting(false);
      return;
    }

    // Prepare FormData for multipart/form-data
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("long_description", formData.long_description);
    data.append("visit_link", formData.visit_link);
    data.append("pricing_plan_id", formData.pricing_plan_id);
    data.append("github_uri", formData.github_uri || "");
    data.append("youtube_uri", formData.youtube_uri || "");
    data.append("x_uri", formData.x_uri || "");
    data.append("facebook_uri", formData.facebook_uri || "");
    data.append("instagram_uri", formData.instagram_uri || "");
    data.append("categoryId", formData.categoryId || "");
    data.append("tagIds", JSON.stringify(formData.tagIds));
    data.append("image", image);
    data.append("background_image", backgroundImage);



    try {
      const response = await axios.post(API_ENDPOINTS.ADD_TOOL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message || "Tool added successfully.");
      // Reset form
      setFormData({
        name: "",
        description: "",
        long_description: "",
        visit_link: "",
        pricing_plan_id: "",
        github_uri: "",
        youtube_uri: "",
        x_uri: "",
        facebook_uri: "",
        instagram_uri: "",
        categoryId: "",
        tagIds: [],
      });
      setImage(null);
      setBackgroundImage(null);
       router.push("/tools")
    } catch (error) {
      toast.error(
        "Failed to add tool: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.LOADING) {
    return <TableLoader />;
  }

  if (state.ERROR) {
    return <h2 className="p-4 text-center text-red-500">Error loading data</h2>;
  }

  const tags = Array.isArray(state.DATA?.tags) ? state.DATA.tags : [];
  const categories = Array.isArray(state.DATA?.categories)
    ? state.DATA.categories
    : [];
  const pricingPlans = Array.isArray(state.DATA?.pricingPlans)
    ? state.DATA.pricingPlans
    : [];

  if (tags.length === 0 || categories.length === 0 || pricingPlans.length === 0) {
    return <DataNotFound title="Required data not found" />;
  }

  return (
    <div
      className={clsx(
        "p-4 rounded-xl border",
        "w-full min-w-[300px]"
      )}
    >
      <h3 className="font-medium capitalize text-xl mb-4">Add Tool</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter tool name"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter short description"
            required
          />
        </div>
        <div>
          <Label htmlFor="long_description">Long Description *</Label>
          <Textarea
            id="long_description"
            name="long_description"
            value={formData.long_description}
            onChange={handleInputChange}
            placeholder="Enter detailed description"
            rows={5}
            required
          />
        </div>
        <div>
          <Label htmlFor="visit_link">Visit Link *</Label>
          <Input
            id="visit_link"
            name="visit_link"
            type="url"
            value={formData.visit_link}
            onChange={handleInputChange}
            placeholder="Enter visit link (e.g., https://example.com)"
            required
          />
        </div>
        <div>
          <Label htmlFor="pricing_plan_id">Pricing Plan *</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("pricing_plan_id", value)
            }
            value={formData.pricing_plan_id}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pricing plan" />
            </SelectTrigger>
            <SelectContent>
              {pricingPlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id.toString()}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select
            onValueChange={(value) => handleSelectChange("categoryId", value)}
            value={formData.categoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tagIds">Tags</Label>
          <div className="space-y-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`tag-${tag.id}`}
                  value={tag.id.toString()}
                  checked={formData.tagIds.includes(tag.id.toString())}
                  onChange={() => handleTagChange(tag.id.toString())}
                  className="mr-2"
                />
                <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="github_uri">GitHub URL</Label>
          <Input
            id="github_uri"
            name="github_uri"
            type="url"
            value={formData.github_uri}
            onChange={handleInputChange}
            placeholder="Enter GitHub URL (optional)"
          />
        </div>
        <div>
          <Label htmlFor="youtube_uri">YouTube URL</Label>
          <Input
            id="youtube_uri"
            name="youtube_uri"
            type="url"
            value={formData.youtube_uri}
            onChange={handleInputChange}
            placeholder="Enter YouTube URL (optional)"
          />
        </div>
        <div>
          <Label htmlFor="x_uri">X URL</Label>
          <Input
            id="x_uri"
            name="x_uri"
            type="url"
            value={formData.x_uri}
            onChange={handleInputChange}
            placeholder="Enter X URL (optional)"
          />
        </div>
        <div>
          <Label htmlFor="facebook_uri">Facebook URL</Label>
          <Input
            id="facebook_uri"
            name="facebook_uri"
            type="url"
            value={formData.facebook_uri}
            onChange={handleInputChange}
            placeholder="Enter Facebook URL (optional)"
          />
        </div>
        <div>
          <Label htmlFor="instagram_uri">Instagram URL</Label>
          <Input
            id="instagram_uri"
            name="instagram_uri"
            type="url"
            value={formData.instagram_uri}
            onChange={handleInputChange}
            placeholder="Enter Instagram URL (optional)"
          />
        </div>
        <div>
          <Label htmlFor="image">Image *</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
            required
          />
        </div>
        <div>
          <Label htmlFor="background_image">Background Image *</Label>
          <Input
            id="background_image"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "background_image")}
            required
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Tool"}
        </Button>
      </form>
    </div>
  );
};

export default AddTool;