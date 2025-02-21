import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

type AddEmployeeModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (name.trim() !== "") {
      onSave(name);
      setName("");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6">Agregar Empleado</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} color="error">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEmployeeModal;
