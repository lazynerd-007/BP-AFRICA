"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", failed: 222, approved: 150 },
  { date: "2024-04-02", failed: 97, approved: 180 },
  { date: "2024-04-03", failed: 167, approved: 120 },
  { date: "2024-04-04", failed: 242, approved: 260 },
  { date: "2024-04-05", failed: 373, approved: 290 },
  { date: "2024-04-06", failed: 301, approved: 340 },
  { date: "2024-04-07", failed: 245, approved: 180 },
  { date: "2024-04-08", failed: 409, approved: 320 },
  { date: "2024-04-09", failed: 59, approved: 110 },
  { date: "2024-04-10", failed: 261, approved: 190 },
  { date: "2024-04-11", failed: 327, approved: 350 },
  { date: "2024-04-12", failed: 292, approved: 210 },
  { date: "2024-04-13", failed: 342, approved: 380 },
  { date: "2024-04-14", failed: 137, approved: 220 },
  { date: "2024-04-15", failed: 120, approved: 170 },
  { date: "2024-04-16", failed: 138, approved: 190 },
  { date: "2024-04-17", failed: 446, approved: 360 },
  { date: "2024-04-18", failed: 364, approved: 410 },
  { date: "2024-04-19", failed: 243, approved: 180 },
  { date: "2024-04-20", failed: 89, approved: 150 },
  { date: "2024-04-21", failed: 137, approved: 200 },
  { date: "2024-04-22", failed: 224, approved: 170 },
  { date: "2024-04-23", failed: 138, approved: 230 },
  { date: "2024-04-24", failed: 387, approved: 290 },
  { date: "2024-04-25", failed: 215, approved: 250 },
  { date: "2024-04-26", failed: 75, approved: 130 },
  { date: "2024-04-27", failed: 383, approved: 420 },
  { date: "2024-04-28", failed: 122, approved: 180 },
  { date: "2024-04-29", failed: 315, approved: 240 },
  { date: "2024-04-30", failed: 454, approved: 380 },
  { date: "2024-05-01", failed: 165, approved: 220 },
  { date: "2024-05-02", failed: 293, approved: 310 },
  { date: "2024-05-03", failed: 247, approved: 190 },
  { date: "2024-05-04", failed: 385, approved: 420 },
  { date: "2024-05-05", failed: 481, approved: 390 },
  { date: "2024-05-06", failed: 498, approved: 520 },
  { date: "2024-05-07", failed: 388, approved: 300 },
  { date: "2024-05-08", failed: 149, approved: 210 },
  { date: "2024-05-09", failed: 227, approved: 180 },
  { date: "2024-05-10", failed: 293, approved: 330 },
  { date: "2024-05-11", failed: 335, approved: 270 },
  { date: "2024-05-12", failed: 197, approved: 240 },
  { date: "2024-05-13", failed: 197, approved: 160 },
  { date: "2024-05-14", failed: 448, approved: 490 },
  { date: "2024-05-15", failed: 473, approved: 380 },
  { date: "2024-05-16", failed: 338, approved: 400 },
  { date: "2024-05-17", failed: 499, approved: 420 },
  { date: "2024-05-18", failed: 315, approved: 350 },
  { date: "2024-05-19", failed: 235, approved: 180 },
  { date: "2024-05-20", failed: 177, approved: 230 },
  { date: "2024-05-21", failed: 82, approved: 140 },
  { date: "2024-05-22", failed: 81, approved: 120 },
  { date: "2024-05-23", failed: 252, approved: 290 },
  { date: "2024-05-24", failed: 294, approved: 220 },
  { date: "2024-05-25", failed: 201, approved: 250 },
  { date: "2024-05-26", failed: 213, approved: 170 },
  { date: "2024-05-27", failed: 420, approved: 460 },
  { date: "2024-05-28", failed: 233, approved: 190 },
  { date: "2024-05-29", failed: 78, approved: 130 },
  { date: "2024-05-30", failed: 340, approved: 280 },
  { date: "2024-05-31", failed: 178, approved: 230 },
  { date: "2024-06-01", failed: 178, approved: 200 },
  { date: "2024-06-02", failed: 470, approved: 410 },
  { date: "2024-06-03", failed: 103, approved: 160 },
  { date: "2024-06-04", failed: 439, approved: 380 },
  { date: "2024-06-05", failed: 88, approved: 140 },
  { date: "2024-06-06", failed: 294, approved: 250 },
  { date: "2024-06-07", failed: 323, approved: 370 },
  { date: "2024-06-08", failed: 385, approved: 320 },
  { date: "2024-06-09", failed: 438, approved: 480 },
  { date: "2024-06-10", failed: 155, approved: 200 },
  { date: "2024-06-11", failed: 92, approved: 150 },
  { date: "2024-06-12", failed: 492, approved: 420 },
  { date: "2024-06-13", failed: 81, approved: 130 },
  { date: "2024-06-14", failed: 426, approved: 380 },
  { date: "2024-06-15", failed: 307, approved: 350 },
  { date: "2024-06-16", failed: 371, approved: 310 },
  { date: "2024-06-17", failed: 475, approved: 520 },
  { date: "2024-06-18", failed: 107, approved: 170 },
  { date: "2024-06-19", failed: 341, approved: 290 },
  { date: "2024-06-20", failed: 408, approved: 450 },
  { date: "2024-06-21", failed: 169, approved: 210 },
  { date: "2024-06-22", failed: 317, approved: 270 },
  { date: "2024-06-23", failed: 480, approved: 530 },
  { date: "2024-06-24", failed: 132, approved: 180 },
  { date: "2024-06-25", failed: 141, approved: 190 },
  { date: "2024-06-26", failed: 434, approved: 380 },
  { date: "2024-06-27", failed: 448, approved: 490 },
  { date: "2024-06-28", failed: 149, approved: 200 },
  { date: "2024-06-29", failed: 103, approved: 160 },
  { date: "2024-06-30", failed: 446, approved: 400 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  failed: {
    label: "Failed",
    color: "hsl(0, 84%, 60%)", // Red for Failed
  },
  approved: {
    label: "Approved",
    color: "hsl(142, 76%, 36%)", // Green for Approved
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("month")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7days")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 30
    if (timeRange === "7days") {
      daysToSubtract = 7
    } else if (timeRange === "today") {
      daysToSubtract = 1
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Collections</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total collections for the selected period
          </span>
          <span className="@[540px]/card:hidden">Collections overview</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="today">Today</ToggleGroupItem>
            <ToggleGroupItem value="7days">7 days</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="today" className="rounded-lg">
                Today
              </SelectItem>
              <SelectItem value="7days" className="rounded-lg">
                7 days
              </SelectItem>
              <SelectItem value="month" className="rounded-lg">
                Month
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-failed)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-failed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-approved)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-approved)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="approved"
              type="natural"
              fill="url(#fillApproved)"
              stroke="var(--color-approved)"
              stackId="a"
            />
            <Area
              dataKey="failed"
              type="natural"
              fill="url(#fillFailed)"
              stroke="var(--color-failed)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
