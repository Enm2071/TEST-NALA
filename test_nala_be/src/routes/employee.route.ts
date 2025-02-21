import { Router } from "express";
import { createEmployee, getEmployeesByNode } from "../services/employee.service";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, nodeId } = req.body;
    if (!name || !nodeId) {
      throw new Error("Faltan datos requeridos.");
    }
    const newEmployee = await createEmployee(name, nodeId);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("❌ Error al crear empleado:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

router.get("/:nodeId", async (req, res) => {
  try {
    const employees = await getEmployeesByNode(req.params.nodeId);
    res.json(employees);
  } catch (error) {
    console.error("❌ Error al obtener empleados del nodo:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

export default router;
