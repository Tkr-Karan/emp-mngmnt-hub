import { useState, useCallback } from "react";
import type { Employee } from "@/types/hrms";
import axiosInstance from "@/services/api";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/employees/");
      setEmployees(response.data.data || response.data);
      setCount(response.data.count || 0);
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch employees";
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  const addEmployee = useCallback(
    async (employee: Omit<Employee, "id" | "createdAt">) => {
      setIsLoading(true);
      setError(null);

      const payload = {
        employeeId: employee.employeeId,
        full_name: employee.fullName,
        email: employee.email,
        department: employee.department,
      };
      try {
        const response = await axiosInstance.post("/employees/", payload);

        setEmployees((prev) => [...prev, response.data.data || response.data]);
        setIsLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add employee";
        console.error(err);
        setError(errorMessage);
        setIsLoading(false);
        throw err;
      }
    },
    [],
  );

  const deleteEmployee = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/employees/${id}`);

      setEmployees((prev) => prev.filter((e) => e.id !== id));
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete employee";
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    employees,
    isLoading,
    error,
    fetchEmployees,
    addEmployee,
    deleteEmployee,
    count,
  };
}
