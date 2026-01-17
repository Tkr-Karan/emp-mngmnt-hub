import { Users, CalendarCheck, UserCheck, UserX } from "lucide-react";
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployees } from "@/hooks/useEmployees";
import { useAttendance } from "@/hooks/useAttendance";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { employees, fetchEmployees } = useEmployees();
  const { records, fetchAttendance } = useAttendance();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [fetchEmployees, fetchAttendance]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRecords = records.filter((r) => r.date === todayStr);
  const presentToday = todayRecords.filter(
    (r) => r.status === "Present",
  ).length;
  const absentToday = todayRecords.filter((r) => r.status === "Absent").length;

  return (
    <AppLayout title="Dashboard" subtitle="Overview of your HR operations">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Employees"
            value={employees.length}
            icon={Users}
            description="Active employees"
          />
          <StatCard
            title="Present Today"
            value={presentToday}
            icon={UserCheck}
            description="Marked present"
          />
          <StatCard
            title="Absent Today"
            value={absentToday}
            icon={UserX}
            description="Marked absent"
          />
          <StatCard
            title="Total Records"
            value={records.length}
            icon={CalendarCheck}
            description="Attendance entries"
          />
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                onClick={() => navigate("/employees")}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Manage Employees</p>
                  <p className="text-xs text-muted-foreground">
                    Add, view or remove employees
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                onClick={() => navigate("/attendance")}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Mark Attendance</p>
                  <p className="text-xs text-muted-foreground">
                    Record daily attendance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
