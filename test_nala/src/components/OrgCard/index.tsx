import React, { useState } from "react";
import styled from "@emotion/styled";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import { Checkbox, IconButton, TextField } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CardH from "./cardHeader";

type OrgCardProps = {
  id: string;
  title: string;
  addChild: (parentId: string) => void;
  deleteCard: (id: string) => void;
  editTitle: (id: string, title: string) => void;
  root: string | undefined;
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

const Title = styled(Typography)`
  color: #3f51b5;
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  text-align: center;
  justify-content: center;
`;

const OrgCard = (props: OrgCardProps) => {
  const { title, id, addChild, deleteCard, editTitle, root  } = props;
  const [checked, setChecked] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
  };

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
          title={<CardH root={root} />}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
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
            <Typography
              gutterBottom
              sx={{
                color: "text.secondary",
                fontSize: 24,
                fontWeight: "bold",
                lineHeight: 1.2,
                letterSpacing: "0.1em",
              }}
              onClick={handleTitleClick}
            >
              {editedTitle}
            </Typography>
          )}
          <Typography variant="body2">
            Example content for the OrgCard.
          </Typography>
        </CardContent>
        <StyledCardActions>
          <IconButton aria-label="save" onClick={() => editTitle(id, editedTitle)}>
            <SaveIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => deleteCard(id)}>
            <DeleteIcon />
          </IconButton>
        </StyledCardActions>
      </StyledCard>

      <IconButton aria-label="add" onClick={() => addChild(id)}>
        <AddIcon color="primary" />
      </IconButton>
    </Container>
  );
};

export default OrgCard;
