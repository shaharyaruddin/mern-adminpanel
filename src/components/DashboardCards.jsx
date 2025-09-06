import React from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Layers2, LayoutGrid, User } from "lucide-react";

const DashboardCards = ({
  customerCount = 30,
  toolCount = 20,
  categoryCount = 30,
}) => {
  const DASHBOARD_CARDS = [
    {
      heading: "total customers",
      description: "total customer or all time",
      count: customerCount,
      icon: <User />,
    },
    {
      heading: "total tool",
      description: "total toll or all time",
      count: toolCount,
      icon: <LayoutGrid />,
    },
    {
      heading: "total tool categories",
      description: "total toll or all time",
      count: categoryCount,
      icon: <Layers2 />,
    },
  ];
  return (
    <div className="grid grid-cols-3 max-md:grid-cols-1 w-full gap-3 ">
      {/* customers */}
      {DASHBOARD_CARDS.map((item, index) => {
        return (
          <Card className={"h-[9rem] capitalize"} key={index}>
            <CardHeader>
              <CardDescription>{item.heading}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {item.count}
              </CardTitle>
              <CardAction>{item.icon}</CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium capitalize">
                {item.description}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardCards;
