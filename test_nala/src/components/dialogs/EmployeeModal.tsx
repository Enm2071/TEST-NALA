import React from "react";
import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { blue } from "@mui/material/colors";
import PeopleIcon from "@mui/icons-material/People";

type EmployeeModalProps = {
  open: boolean;
  employees: { id: string; name: string }[];
  onClose: () => void;
};

const EmployeeModal: React.FC<EmployeeModalProps> = ({ open, employees, onClose }) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <PeopleIcon sx={{ marginRight: 1 }} /> Lista de Empleados
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {employees.map((employee) => (
          <ListItem disablePadding key={employee.id}>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={employee.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default EmployeeModal;
