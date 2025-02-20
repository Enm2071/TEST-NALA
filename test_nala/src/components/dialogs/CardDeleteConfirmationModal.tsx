import React, { FC } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

type CardDeleteConfirmationModalProps = {
    openModal: boolean;
    handleCloseModal: () => void;
    handleConfirmDelete: () => void;
};

const CardDeleteConfirmationModal: FC<CardDeleteConfirmationModalProps> = ({
    openModal,
    handleCloseModal,
    handleConfirmDelete,
}) => {
    return (
        <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
                ¿Estás seguro de que deseas eliminar este card?
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancelar</Button>
                <Button onClick={handleConfirmDelete} color="error">
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CardDeleteConfirmationModal;