import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const colorMap = {
  blue: {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700"
  },
  emerald: {
    bg: "bg-emerald-500", 
    light: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700"
  },
  amber: {
    bg: "bg-amber-500",
    light: "bg-amber-50", 
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700"
  },
  purple: {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    text: "text-purple-600", 
    badge: "bg-purple-100 text-purple-700"
  }
};

export default function StatCard({ title, value, icon: Icon, color = "blue", trend }) {
  const colors = colorMap[color];
  
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {trend && (
              <Badge className={`mt-2 ${colors.badge} text-xs`}>
                {trend}
              </Badge>
            )}
          </div>
          <div className={`p-4 rounded-xl ${colors.light}`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}