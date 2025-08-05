"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react";

export function DropdownMenuRadioGroupComponent({value,onValueChange}) {
  const subjects = [
    {
      subject : "mathematics",
    },
    {
      subject : "chemistry",
    },
    {
      subject : "physics",
    },
    {
      subject : "computer",
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={'capitalize rounded-full! shadow-none'}>{value || 'empty'}<ChevronDown/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select subject</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {
            subjects.map((item, index) => (
              <DropdownMenuRadioItem className={'capitalize'} key={index} value={item.subject}>
                {item.subject}
              </DropdownMenuRadioItem>
            ))
          }
     
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
