import * as React from "react"
import {format} from "date-fns"
import {Calendar as CalendarIcon} from "lucide-react"
import {DateRange} from "react-day-picker"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

export function DatePickerWithRange(
    {
      className,
      date,
      setDate,
      label
    }: React.HTMLAttributes<HTMLDivElement> & {
      date: DateRange | undefined,
      setDate: (date: DateRange) => void,
      label?: string
    }
) {

  return (
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
                id="date"
                variant={"outline"}
                className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
            >
              <CalendarIcon className="mr-2 size-4"/>
              {date?.from ? (
                  date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                  ) : (
                      format(date.from, "LLL dd, y")
                  )
              ) : (
                  <span>{label || "Pick a date"}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
  )
}
