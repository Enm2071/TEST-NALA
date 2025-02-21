import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import { CardHeader, Checkbox, IconButton, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PeopleIcon from "@mui/icons-material/People";
import CardH from "./cardHeader";
import MoreMenu from "../moreMenu";
import { API_URL } from "../../libs/config";
import { useToastify } from "../../hooks/useToastify";
import OrgCardSkeleton from "./skeleton";
import EmployeeModal from "../dialogs/EmployeeModal";

type OrgCardProps = {
  id: string;
  title: string;
  addChild: (parentId: string, name: string) => void;
  deleteCard: (id: string) => void;
  editTitle: (id: string, title: string) => void;
  root: string | undefined;
  isRoot: boolean;
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

const OrgCard = (props: OrgCardProps) => {
  const { title, id, addChild, deleteCard, editTitle, root, isRoot } = props;
  const [checked, setChecked] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const { notifyError } = useToastify();

  const handleTitleClick = () => setIsEditing(true);
  const handleTitleBlur = () => setIsEditing(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddEmployee = async (name: string) => {
    try {
      if (employees.length >= 3) {
        notifyError("No se pueden agregar más de 3 empleados");
        return;
      }
      const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nodeId: id }),
      });
      const data = await response.json();
      setEmployees([...employees, { id: data._id, name: data.name }]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/employees/${id}`);
        const data = await response.json();
        setEmployees(data.map((emp: any) => ({ id: emp._id, name: emp.name })));
        setLoading(false);
      } catch (error) {
        console.error(error);
        notifyError("Error al cargar empleados");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [id]);

  if (loading) {
    return <OrgCardSkeleton />;
  }

  return (
    <Container id={id?.toString()}>
      <StyledCard>
        <CardHeader
          avatar={
            <Checkbox
              {...label}
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
          }
          action={<MoreMenu onAddEmployee={handleAddEmployee} />}
          title={<CardH root={root} />}
        />
        <CardContent>
          {isEditing ? (
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              autoFocus
            />
          ) : (
            <TitleText onClick={handleTitleClick}>{editedTitle}</TitleText>
          )}
          <Typography variant="body2">
            Card description goes here. This is a longer description of the card.
          </Typography>
          <EmployeeContainer>
            <EmployeeTitle variant="h6" onClick={handleOpenModal}>
              <PeopleIcon /> Empleados ({employees.length} de 3)
            </EmployeeTitle>
          </EmployeeContainer>
        </CardContent>
        <StyledCardActions>
          <IconButton aria-label="save" onClick={() => editTitle(id, editedTitle)}>
            <SaveIcon />
          </IconButton>
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
