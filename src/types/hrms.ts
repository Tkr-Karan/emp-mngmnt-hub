export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  full_name: string;
  email: string;
  department: string;
  createdAt?: string;
}

export interface AttendanceRecord {
  id: string;
  employee: {
    id: string;
    employeeId: string;
    full_name: string;
    email: string;
    department: string;
  };
  date: string;
  status: "Present" | "Absent";
}

export type AttendanceStatus = "Present" | "Absent";
