"use client";
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

const Tools = () => {
  // 🔹 Example static data (you can replace with dummy rows)
  const tools = [
    {
      id: 1,
      name: "Tool A",
      description: "Short description of Tool A",
      long_description: "Detailed description of Tool A",
      visit_link: "https://example.com",
      PricingPlan: { plan_name: "Free" },
      image: null,
      background_image: null,
      slug: "tool-a",
      Category: { name: "Category 1" },
      Tags: [{ id: 1, name: "Tag1" }, { id: 2, name: "Tag2" }],
      createdAt: "2025-09-04",
    },
    {
      id: 2,
      name: "Tool B",
      description: "Short description of Tool B",
      long_description: "Detailed description of Tool B",
      visit_link: null,
      PricingPlan: { plan_name: "Pro" },
      image: null,
      background_image: null,
      slug: "tool-b",
      Category: { name: "Category 2" },
      Tags: [],
      createdAt: "2025-09-04",
    },
  ];

  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4">Tools (Static)</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Long Description</th>
              <th className="p-2 border">Visit Link</th>
              <th className="p-2 border">Pricing Plan</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Background Image</th>
              <th className="p-2 border">Slug</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Tags</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell className="p-2 border">{tool.id}</TableCell>
                <TableCell className="p-2 border">{tool.name}</TableCell>
                <TableCell className="p-2 border">{tool.description}</TableCell>
                <TableCell className="p-2 border">{tool.long_description}</TableCell>
                <TableCell className="p-2 border">
                  {tool.visit_link ? (
                    <a
                      href={tool.visit_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="p-2 border">
                  <Badge>{tool.PricingPlan?.plan_name || "N/A"}</Badge>
                </TableCell>
                <TableCell className="p-2 border">
                  {tool.image ? "Image" : <span className="text-gray-500">No Image</span>}
                </TableCell>
                <TableCell className="p-2 border">
                  {tool.background_image ? "Background Image" : <span className="text-gray-500">No Image</span>}
                </TableCell>
                <TableCell className="p-2 border">{tool.slug}</TableCell>
                <TableCell className="p-2 border">{tool.Category?.name || "N/A"}</TableCell>
                <TableCell className="p-2 border">
                  {tool.Tags?.length > 0 ? (
                    <div className="flex gap-1 flex-wrap">
                      {tool.Tags.map((tag) => (
                        <Badge key={tag.id}>{tag.name}</Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No Tags</span>
                  )}
                </TableCell>
                <TableCell className="p-2 border">{tool.createdAt}</TableCell>
                <TableCell className="p-2 border">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href="#">Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tools;
