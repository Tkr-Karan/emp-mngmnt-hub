import { useState, useCallback } from "react";
import type { AttendanceRecord, AttendanceStatus } from "@/types/hrms";
import axiosInstance from "@/services/api";

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/attendance/");
      setRecords(response.data.data || response.data);
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch attendance records";
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  const markAttendance = useCallback(
    async (employeeId: string, date: string, status: AttendanceStatus) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.post("/attendance/", {
          employeeId,
          date,
          status,
        });

        console.log("Marked Attendance:", response.data);
        setRecords((prev) => [...prev, response.data.data || response.data]);
        setIsLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to mark attendance";
        console.log("Error marking attendance:", errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        throw err;
      }
    },
    [],
  );

  const getEmployeeAttendance = useCallback(
    (employeeId: string) => {
      return records.filter((r) => r.employee.employeeId === employeeId);
    },
    [records],
  );

  return {
    records,
    isLoading,
    error,
    fetchAttendance,
    markAttendance,
    getEmployeeAttendance,
  };
}
