import React from "react";
import DashboardCards from "@/components/DashboardCards";

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
