import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import { CardHeader, Checkbox, IconButton, TextField } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PeopleIcon from "@mui/icons-material/People";
import CardH from "./cardHeader";
import MoreMenu from "../moreMenu";
import { useToastify } from "../../hooks/useToastify";
import OrgCardSkeleton from "./skeleton";
import EmployeeModal from "../dialogs/EmployeeModal";
import { useEmployees } from "../../hooks/useEmployee";

type OrgCardProps = {
  id: string;
  title: string;
  addChild: (parentId: string, name: string) => void;
  deleteCard: (id: string) => void;
  editTitle: (id: string, title: string) => Promise<void>;
  editDescription: (id: string, description: string) => Promise<void>;
  root: string | undefined;
  isRoot: boolean;
  description?: string;
};

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StyledCard = styled(Card)`
  min-width: 325px;
  max-width: 380px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledCardActions = styled(CardActions)`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0px -1px 0px #f0f0f0;
  background-color: #dbe2e9;
`;

const AddIcon = styled(AddCircleOutlineIcon)`
  font-size: 50px;
`;

const EmployeeTitle = styled(Typography)`
  font-size: 20px;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: 0.1em;
  color: #3f51b5;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const EmployeeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  margin-top: 20px;
`;

const TitleText = styled(Typography)`
  color: #6c757d;
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: 0.1em;
  cursor: pointer;
`;

const DescriptionText = styled(Typography)`
  color: #6c757d;
  font-size: 16px;
  line-height: 1.5;
  margin-top: 8px;
  cursor: pointer;
`;

const StyledTextarea = styled(TextareaAutosize)`
  width: 100%;
  font-size: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
`;

const OrgCard = (props: OrgCardProps) => {
  const { title, id, addChild, deleteCard, editTitle, editDescription, root, isRoot, description } = props;
  const [checked, setChecked] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description || "");
  const [openModal, setOpenModal] = useState(false);
  const { employees, loading, addEmployee } = useEmployees(id);
  const { notifyError } = useToastify();

  const handleTitleClick = () => setIsEditingTitle(true);
  const handleTitleBlur = async () => {
    setIsEditingTitle(false);
    try {
      await editTitle(id, editedTitle);
    } catch (error) {
      notifyError("No se pudo actualizar el título del nodo.");
    }
  };

  const handleDescriptionClick = () => setIsEditingDescription(true);
  const handleDescriptionBlur = async () => {
    setIsEditingDescription(false);
    try {
      await editDescription(id, editedDescription);
    } catch (error) {
      notifyError("No se pudo actualizar la descripción del nodo.");
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddEmployee = async (name: string) => {
    try {
      if (employees.length >= 3) {
        notifyError("No se pueden agregar más de 3 empleados");
        return;
      }
      addEmployee(name);
    } catch (error) {
      notifyError("No se pudo agregar el empleado");
    }
  };

  if (loading) {
    return <OrgCardSkeleton />;
  }

  return (
    <Container id={id}>
      <StyledCard>
        <CardHeader
          avatar={
            <Checkbox {...label} checked={checked} onChange={() => setChecked(!checked)} />
          }
          action={<MoreMenu onAddEmployee={handleAddEmployee} />}
          title={<CardH root={root} />}
        />
        <CardContent>
          {isEditingTitle ? (
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              autoFocus
            />
          ) : (
            <TitleText onClick={handleTitleClick}>{editedTitle}</TitleText>
          )}
          {isEditingDescription ? (
            <StyledTextarea
              minRows={3}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              autoFocus
              style={{
                maxWidth: "80%",
              }}
            />
          ) : (
            <DescriptionText variant="body2" onClick={handleDescriptionClick}>
              {editedDescription || "Sin descripción. Haz clic para editar."}
            </DescriptionText>
          )}
          <EmployeeContainer>
            <EmployeeTitle variant="h6" onClick={handleOpenModal}>
              <PeopleIcon /> Empleados ({employees.length} de 3)
            </EmployeeTitle>
          </EmployeeContainer>
        </CardContent>
        <StyledCardActions>
          {!isRoot && (
            <IconButton aria-label="delete" onClick={() => deleteCard(id)}>
              <DeleteIcon />
            </IconButton>
          )}
        </StyledCardActions>
      </StyledCard>

      <IconButton aria-label="add" onClick={() => addChild(id, "Nuevo Empleado")}>
        <AddIcon color="primary" />
      </IconButton>

      <EmployeeModal open={openModal} employees={employees} onClose={handleCloseModal} />
    </Container>
  );
};

export default OrgCard;
