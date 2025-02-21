import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import styled from "@emotion/styled";

type AddEmployeeModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
};

// 🔹 Estilos con Emotion
const StyledModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: white;
  box-shadow: 24px;
  padding: 24px;
  border-radius: 8px;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

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
      <StyledModalBox>
        <Typography variant="h6">Agregar Empleado</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ButtonContainer>
          <Button onClick={onClose} color="error">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Guardar
          </Button>
        </ButtonContainer>
      </StyledModalBox>
    </Modal>
  );
};

export default AddEmployeeModal;
