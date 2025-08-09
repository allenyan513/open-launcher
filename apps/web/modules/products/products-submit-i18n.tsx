'use client';
import React, {use, useEffect, useState} from 'react';
import {Tooltip, TooltipContent, TooltipTrigger} from "@repo/ui/tooltip";
import {BsGlobe} from "react-icons/bs";

export function ProductsSubmitI18N(props: {}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <BsGlobe/>
      </TooltipTrigger>
      <TooltipContent>
        <p>Automatically translate your product information into multiple languages.</p>
      </TooltipContent>
    </Tooltip>
  )
}
