import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddEmployeeModal from "../dialogs/AddEmployeeModal";

type MoreMenuProps = {
  onAddEmployee: (name: string) => void;
};

const MoreMenu: React.FC<MoreMenuProps> = ({ onAddEmployee }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    handleCloseMenu(); // Cierra el menú al abrir el modal
  };

  return (
    <>
      <IconButton aria-label="settings" onClick={handleOpenMenu}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleOpenModal}>Agregar empleado</MenuItem>
      </Menu>
      <AddEmployeeModal open={openModal} onClose={() => setOpenModal(false)} onSave={onAddEmployee} />
    </>
  );
};

export default MoreMenu;
