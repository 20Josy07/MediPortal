"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartData = [
  { name: "Asistidas", value: 92, fill: "hsl(var(--chart-1))" },
  { name: "Canceladas", value: 5, fill: "hsl(var(--chart-3))" },
  { name: "No-Shows", value: 3, fill: "hsl(var(--chart-5))" },
]

const chartConfig = {
  value: {
    label: "Asistencia",
  },
  Asistidas: {
    label: "Asistidas: 92%",
    color: "hsl(var(--chart-1))",
  },
  Canceladas: {
    label: "Canceladas: 5%",
    color: "hsl(var(--chart-3))",
  },
  "No-Shows": {
    label: "No-Shows: 3%",
    color: "hsl(var(--chart-5))",
  },
}

export function AttendanceChart() {
  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
           {chartData.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} className="-mt-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center" />
      </PieChart>
    </ChartContainer>
  )
}
