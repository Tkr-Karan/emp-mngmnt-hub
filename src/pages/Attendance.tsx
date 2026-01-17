import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { MarkAttendanceDialog } from "@/components/attendance/MarkAttendanceDialog";
import { useEmployees } from "@/hooks/useEmployees";
import { useAttendance } from "@/hooks/useAttendance";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AttendanceStatus } from "@/types/hrms";

export default function Attendance() {
  const { employees, fetchEmployees } = useEmployees();
  const {
    records,
    isLoading,
    fetchAttendance,
    markAttendance,
    getEmployeeAttendance,
    error,
  } = useAttendance();
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [filterByStatus, setFilterByStatus] = useState<string>("all");

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [fetchEmployees, fetchAttendance]);

  const handleMarkAttendance = async (
    employeeId: string,
    date: string,
    status: AttendanceStatus,
  ) => {
    try {
      await markAttendance(employeeId, date, status);
      const employee = employees.find((e) => e.employeeId === employeeId);
      toast({
        title: "Attendance Marked",
        description: `${employee?.full_name || "Employee"} marked as ${status} for ${date}.`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark attendance. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  let filteredRecords = records;

  if (selectedEmployee !== "all") {
    filteredRecords = filteredRecords.filter((r) => {
      const emp = employees.find((e) => e.id === selectedEmployee);
      return r.employee.employeeId === emp?.employeeId;
    });
  }

  if (filterByStatus !== "all") {
    filteredRecords = filteredRecords.filter(
      (r) => r.status === filterByStatus,
    );
  }

  const handleEmployeeClick = (employeeId: string) => {
    setSelectedEmployee(employeeId);
  };

  const handleClearFilter = () => {
    setSelectedEmployee("all");
    setFilterByStatus("all");
  };

  const selectedEmployeeName = employees.find(
    (e) => e.id === selectedEmployee,
  )?.full_name;

  return (
    <AppLayout
      title="Attendance"
      subtitle="Track daily attendance records"
      actions={
        <MarkAttendanceDialog
          employees={employees}
          onMark={handleMarkAttendance}
          isLoading={isLoading}
        />
      }
    >
      <div className="space-y-4">
        {/* Filter */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Filter Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Active Filters Display */}
              {(selectedEmployee !== "all" || filterByStatus !== "all") && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm text-blue-900">
                    {selectedEmployee !== "all" && (
                      <span>
                        👤 <strong>{selectedEmployeeName}</strong>
                        {filterByStatus !== "all" && " • "}
                      </span>
                    )}
                    {filterByStatus !== "all" && (
                      <span>
                        📊 Status: <strong>{filterByStatus}</strong>
                      </span>
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilter}
                    className="ml-auto h-6 px-2 text-xs"
                  >
                    Clear Filter
                  </Button>
                </div>
              )}

              {/* Filter Controls */}
              <div className="flex items-center gap-4">
                <div className="w-64">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Filter by Employee
                  </label>
                  <Select
                    value={selectedEmployee}
                    onValueChange={setSelectedEmployee}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.full_name} ({emp.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-48">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Filter by Status
                  </label>
                  <Select
                    value={filterByStatus}
                    onValueChange={setFilterByStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 self-end">
                  <p className="text-sm text-muted-foreground">
                    Showing <strong>{filteredRecords.length}</strong> record
                    {filteredRecords.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <AttendanceTable
              records={filteredRecords}
              employees={employees}
              isLoading={isLoading}
              onEmployeeClick={handleEmployeeClick}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
