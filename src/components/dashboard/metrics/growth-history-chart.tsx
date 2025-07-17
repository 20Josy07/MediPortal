"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "Ene", income: 1200 },
  { month: "Feb", income: 1500 },
  { month: "Mar", income: 1800 },
  { month: "Abr", income: 1700 },
  { month: "May", income: 2400 },
  { month: "Jun", income: 3100 },
]

const chartConfig = {
  income: {
    label: "Ingresos",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function GrowthHistoryChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: -20,
          right: 10,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
          cursor={true}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <defs>
            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
            </linearGradient>
        </defs>
        <Area
          dataKey="income"
          type="natural"
          fill="url(#fillIncome)"
          stroke="hsl(var(--primary))"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}