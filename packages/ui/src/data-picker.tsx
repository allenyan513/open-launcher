'use client';
import {Button} from './button';
import React, {useState, useRef} from 'react';

import {CalendarIcon, ChevronDownIcon} from 'lucide-react';
import {Calendar} from './calendar';
import {Popover, PopoverContent, PopoverTrigger} from './popover';

function getFormatData3(date: Date | string | undefined) {
  if (!date) {
    return '';
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
  return date.toLocaleDateString('en-US', options);
}

export function DatePicker(props: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled: (date: Date) => boolean;
}) {
  const {value, onChange, disabled} = props;
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-full justify-between font-normal"
        >
          {props.value ? getFormatData3(props.value) : 'Select date'}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={onChange}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
