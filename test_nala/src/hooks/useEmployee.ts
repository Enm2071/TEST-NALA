import { useState, useEffect } from "react";
import { useToastify } from "./useToastify";
import { API_URL } from "../libs/config";


export type Employee = {
  id: string;
  name: string;
};

export const useEmployees = (nodeId: string) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const { notifyError } = useToastify();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/employees/${nodeId}`);
      const data = await response.json();
      setEmployees(data.map((emp: any) => ({ id: emp._id, name: emp.name })));
    } catch (error) {
      notifyError("Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [nodeId]);

  const addEmployee = async (name: string) => {
    try {
      if (employees.length >= 3) {
        notifyError("No se pueden agregar más de 3 empleados");
        return;
      }
      const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nodeId }),
      });
      const data = await response.json();
      setEmployees([...employees, { id: data._id, name: data.name }]);
    } catch (error) {
      notifyError("No se pudo agregar el empleado");
    }
  };

  return { employees, loading, fetchEmployees, addEmployee };
};
