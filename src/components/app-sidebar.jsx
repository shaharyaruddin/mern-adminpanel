"use client";
import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Book, Gauge, SquareKanban, Tag, Users } from "lucide-react";
import Cookies from "js-cookie";


export function AppSidebar({ ...props }) {
  const [user,setUser] = React.useState({});
  // This is sample data.
  React.useEffect(()=>{
      const cookieUser = Cookies.get('userInfo')
      setUser(JSON.parse(cookieUser))
  },[])
const data = {
  user: {
    name: user.username ,
    email: user.email,
    // name: 'coder' ,
    // email: 'coder',
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title:'Dashboard',
      url:'/',
      icon: Gauge 
    },
    {
      title: "Users",
      url: "#",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Users",
          url: "/users",
        },
        {
          title: "Block Users",
          url: "/users/block",
        },
        {
          title: "Add User",
          url: "/users/add",
        },
        
      ],
    },
    {
      title: "Tools",
      url: "#",
      icon: Tag,
      isActive: false,
      items: [
        {
          title: "Tools",
          url: "/tools",
        },
        {
          title: "Add Tools",
          url: "/tools/add",
        },
        
        
      ],
    },
    {
      title: "Tags",
      url: "#",
      icon: Tag,
      isActive: false,
      items: [
        {
          title: "Tags",
          url: "/tags",
        },
        {
          title: "Add Tag",
          url: "/tags/add",
        },
        
        
      ],
    },
    {
      title: "Cateogories",
      url: "#",
      icon: Tag,
      isActive: false,
      items: [
        {
          title: "Cateogories",
          url: "/categories",
        },
        {
          title: "Add Cateogories",
          url: "/categories/add",
        }, 
      ],
    },
    {
      title: "Pricing plan",
      url: "#",
      icon: Tag,
      isActive: false,
      items: [
        {
          title: "plan",
          url: "/pricing-plans",
        },
        {
          title: "Add Pricing plan",
          url: "/pricing-plans/add",
        }, 
      ],
    },
    {
      title: "Ranking",
      url: "/ranking",
      icon: Tag,
      isActive: false,
      
    },
  ],
};

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="w-full flex justify-center items-center mt-3">
         <span className="group-data-[state=collapsed]:hidden">Freemium Admin</span>
        <span className="hidden group-data-[state=collapsed]:inline">F</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} labelHeading="explore" />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
