import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { AddEmployeeDialog } from "@/components/employees/AddEmployeeDialog";
import { useEmployees } from "@/hooks/useEmployees";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function Employees() {
  const { employees, isLoading, error, fetchEmployees, addEmployee, deleteEmployee } = useEmployees();
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = async (employee: Parameters<typeof addEmployee>[0]) => {
    try {
      await addEmployee(employee);
      toast({
        title: "Employee Added",
        description: `${employee.fullName} has been added successfully.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id);
      toast({
        title: "Employee Deleted",
        description: "Employee has been removed successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout
      title="Employees"
      subtitle="Manage your workforce"
      actions={<AddEmployeeDialog onAdd={handleAddEmployee} isLoading={isLoading} />}
    >
      <Card className="shadow-card">
        <CardContent className="p-0">
          <EmployeeTable
            employees={employees}
            onDelete={handleDeleteEmployee}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
