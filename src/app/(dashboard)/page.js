import React from "react";
import DashboardCards from "@/components/DashboardCards";
import DataTable from "@/components/DataTable";
const products = JSON.stringify([
  { id: "P001", name: "Laptop", category: "Electronics", price: "$1200.00" },
  { id: "P002", name: "Phone", category: "Electronics", price: "$800.00" },
  { id: "P001", name: "Laptop", category: "Electronics", price: "$1200.00" },
  { id: "P002", name: "Phone", category: "Electronics", price: "$800.00" },
]);

const productColumns = ["id", "name", "category", "price"];
const page = () => {
  return (
    <div className="w-full">
      <DashboardCards />
      {/* <DataTable
        className="mt-5"
        columns={productColumns}
        data={products}
        title="Recent Tools"
        showFooter={false}
        numericColumns={["price"]}
      /> */}
      {/* <DataTable data={data} /> */}
    </div>
  );
};

export default page;
