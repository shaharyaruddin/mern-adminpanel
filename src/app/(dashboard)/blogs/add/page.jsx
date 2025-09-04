"use client";
import React from "react";

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

import clsx from "clsx";

const AddTool = () => {
  return (
    <div className={clsx("p-4 rounded-xl border", "w-full min-w-[300px]")}>
      <h3 className="font-medium capitalize text-xl mb-4">Add Blogs</h3>
      <form className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" placeholder="Enter tool name" required />
        </div>
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter short description"
            required
          />
        </div>
        <div>
          <Label htmlFor="long_description">Long Description *</Label>
          <Textarea
            id="long_description"
            name="long_description"
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
            placeholder="Enter visit link (e.g., https://example.com)"
            required
          />
        </div>
        <div>
          <Label htmlFor="pricing_plan_id">Pricing Plan *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select pricing plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem>test</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem>categories</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tagIds">Tags</Label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="github_uri">GitHub URL</Label>
          <Input
            id="github_uri"
            name="github_uri"
            type="url"
            placeholder="Enter GitHub URL (optional)"
          />
        </div>
        <div>
          <Label htmlFor="youtube_uri">YouTube URL</Label>
          <Input
            id="youtube_uri"
            name="youtube_uri"
            type="url"
            placeholder="Enter YouTube URL (optional)"
          />
        </div>
        <div>
          <Label htmlFor="x_uri">X URL</Label>
          <Input
            id="x_uri"
            name="x_uri"
            type="url"
            placeholder="Enter X URL (optional)"
          />
        </div>
        <div>
          <Label htmlFor="facebook_uri">Facebook URL</Label>
          <Input
            id="facebook_uri"
            name="facebook_uri"
            type="url"
            placeholder="Enter Facebook URL (optional)"
          />
        </div>
        <div>
          <Label htmlFor="instagram_uri">Instagram URL</Label>
          <Input
            id="instagram_uri"
            name="instagram_uri"
            type="url"
            placeholder="Enter Instagram URL (optional)"
          />
        </div>
        <div>
          <Label htmlFor="image">Image *</Label>
          <Input id="image" type="file" accept="image/*" required />
        </div>
        <div>
          <Label htmlFor="background_image">Background Image *</Label>
          <Input id="background_image" type="file" accept="image/*" required />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default AddTool;
