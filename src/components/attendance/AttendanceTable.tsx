import { format } from "date-fns";
import { CalendarCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AttendanceRecord, Employee } from "@/types/hrms";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  employees: Employee[];
  isLoading?: boolean;
  onEmployeeClick?: (employeeId: string) => void;
}

export function AttendanceTable({
  records,
  employees,
  isLoading,
  onEmployeeClick,
}: AttendanceTableProps) {
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e.employeeId === employeeId);
    return employee?.full_name || employee?.fullName || "Unknown";
  };

  const getEmployeeCode = (employeeId: string) => {
    const employee = employees.find((e) => e.employeeId === employeeId);
    return employee?.employeeId || "";
  };

  const getEmployeeId = (employeeId: string) => {
    const employee = employees.find((e) => e.employeeId === employeeId);
    return employee?.id || "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <CalendarCheck className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          No attendance records
        </h3>
        <p className="text-sm text-muted-foreground">
          Start marking attendance to see records here.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Employee ID</TableHead>
            <TableHead className="font-semibold">Employee Name</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-muted/30">
              <TableCell className="font-mono text-sm">
                {getEmployeeCode(record.employee.employeeId)}
              </TableCell>
              <TableCell
                className="font-medium cursor-pointer hover:text-primary hover:underline transition-colors"
                onClick={() =>
                  onEmployeeClick?.(getEmployeeId(record.employee.employeeId))
                }
                title="Click to filter by this employee"
              >
                {getEmployeeName(record.employee.employeeId)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(record.date), "PPP")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    record.status === "Present" ? "default" : "destructive"
                  }
                  className={
                    record.status === "Present"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }
                >
                  {record.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
