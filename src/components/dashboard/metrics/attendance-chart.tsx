
"use client"

import * as React from "react"
import { Label, Pie, PieChart, RadialBar, RadialBarChart, PolarGrid } from "recharts"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartData = [
  { name: "Asistidas", value: 92, fill: "hsl(var(--primary))" },
  { name: "Canceladas", value: 5, fill: "hsl(var(--muted))" },
  { name: "No-Shows", value: 3, fill: "hsl(var(--destructive))" },
]

const chartConfig = {
  value: {
    label: "Asistencia",
  },
  Asistidas: {
    label: "Asistidas",
    color: "hsl(var(--primary))",
    icon: CheckCircle,
  },
  Canceladas: {
    label: "Canceladas",
    color: "hsl(var(--muted-foreground))",
    icon: XCircle,
  },
  "No-Shows": {
    label: "No-Shows",
    color: "hsl(var(--destructive))",
    icon: AlertCircle,
  },
}

export function AttendanceChart() {
  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  return (
    <div className="w-full">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-[200px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={-270}
          innerRadius="70%"
          outerRadius="85%"
          barSize={12}
        >
          <RadialBar dataKey="value" background={{ fill: 'hsla(var(--muted), 0.5)' }} cornerRadius={6}/>
        </RadialBarChart>
      </ChartContainer>
      <div className="flex items-center justify-center gap-4 text-sm mt-4">
        {chartData.map((item) => {
          const Icon = chartConfig[item.name as keyof typeof chartConfig].icon
          return (
            <div key={item.name} className="flex items-center gap-1.5">
              <Icon
                className={cn("h-4 w-4", {
                  "text-primary": item.name === "Asistidas",
                  "text-muted-foreground": item.name === "Canceladas",
                  "text-destructive": item.name === "No-Shows",
                })}
              />
              <span className="text-muted-foreground">{item.name}:</span>
              <span className="font-semibold text-foreground">{item.value}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
