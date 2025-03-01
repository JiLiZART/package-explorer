"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PackageData } from "@/types/package-types";
import { usePackage } from "@/context/package-context";

export function PackageDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { packageData } = usePackage();

  // This would normally come from an API that checks for updates
  // For demo purposes, we'll generate some sample data
  const outdatedPackages = [
    {
      name: "@happy-dom/global-registrator",
      current: "17.0.3",
      wanted: "17.1.8",
      latest: "17.1.8",
      type: "minor",
      updateType: "dependencies",
    },
    {
      name: "@remix-run/react",
      current: "2.10.3",
      wanted: "2.15.3",
      latest: "2.15.3",
      type: "minor",
      updateType: "dependencies",
    },
    {
      name: "@remix-run/serve",
      current: "2.10.3",
      wanted: "2.15.3",
      latest: "2.15.3",
      type: "minor",
      updateType: "dependencies",
    },
    {
      name: "@resvg/resvg-js",
      current: "2.4.1",
      wanted: "2.6.2",
      latest: "2.6.2",
      type: "minor",
      updateType: "dependencies",
    },
    {
      name: "@swc/core",
      current: "1.3.38",
      wanted: "1.11.1",
      latest: "1.11.1",
      type: "minor",
      updateType: "dependencies",
    },
    {
      name: "@azure/service-bus",
      current: "7.9.4",
      wanted: "7.9.5",
      latest: "7.9.5",
      type: "patch",
      updateType: "dependencies",
    },
    {
      name: "@electric-sql/pglite",
      current: "0.2.16",
      wanted: "0.2.17",
      latest: "0.2.17",
      type: "patch",
      updateType: "dependencies",
    },
    {
      name: "@grpc/grpc-js",
      current: "1.12.0",
      wanted: "1.12.6",
      latest: "1.12.6",
      type: "patch",
      updateType: "dependencies",
    },
    {
      name: "@grpc/proto-loader",
      current: "0.7.10",
      wanted: "0.7.13",
      latest: "0.7.13",
      type: "patch",
      updateType: "dependencies",
    },
    {
      name: "@napi-rs/canvas",
      current: "0.1.65",
      wanted: "0.1.67",
      latest: "0.1.67",
      type: "patch",
      updateType: "dependencies",
    },
    {
      name: "@nestjs/common",
      current: "11.0.3",
      wanted: "11.0.10",
      latest: "11.0.10",
      type: "patch",
      updateType: "dependencies",
    },
    {
      name: "@nestjs/core",
      current: "11.0.3",
      wanted: "11.0.10",
      latest: "11.0.10",
      type: "patch",
      updateType: "dependencies",
    },
    {
      name: "@duckdb/node-api",
      current: "1.1.3-alpha.7",
      wanted: "1.2.0-alpha.15",
      latest: "1.2.0-alpha.15",
      type: "none",
      updateType: "dependencies",
    },
    {
      name: "@prisma/client",
      current: "5.8.0",
      wanted: "6.4.1",
      latest: "6.4.1",
      type: "major",
      updateType: "dependencies",
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getVersionColor = (version: string) => {
    if (version.startsWith("0")) return "text-blue-400";
    if (version.startsWith("1")) return "text-green-400";
    if (version.startsWith("2")) return "text-green-400";
    if (
      version.startsWith("5") ||
      version.startsWith("6") ||
      version.startsWith("7")
    )
      return "text-purple-400";
    if (version.startsWith("11") || version.startsWith("17"))
      return "text-yellow-400";
    return "text-blue-400";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-red-500/10 text-red-500";
      case "minor":
        return "bg-yellow-500/10 text-yellow-500";
      case "patch":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-blue-500/10 text-blue-500";
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Dependency Dashboard</h1>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Outdated Dependencies</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">PACKAGE</TableHead>
                <TableHead>CURRENT</TableHead>
                <TableHead>WANTED</TableHead>
                <TableHead>LATEST</TableHead>
                <TableHead>TYPE</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outdatedPackages.map((pkg) => (
                <TableRow key={pkg.name}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell className={getVersionColor(pkg.current)}>
                    {pkg.current}
                  </TableCell>
                  <TableCell className={getVersionColor(pkg.wanted)}>
                    {pkg.wanted}
                  </TableCell>
                  <TableCell className={getVersionColor(pkg.latest)}>
                    {pkg.latest}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant="outline"
                        className={getTypeColor(pkg.type)}
                      >
                        {pkg.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Update to 17.1.8 (preserves current range)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      → Compatible
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Deprecated Dependencies</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <p>No deprecated packages found</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Security Vulnerabilities</CardTitle>
          <Button variant="outline" size="sm">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Scan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <p>No security vulnerabilities found</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
