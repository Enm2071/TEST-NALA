import React from "react";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

type CardHeaderProps = {
  root?: string;
};

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

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CardH: React.FC<CardHeaderProps> = ({ root }) => {
  if (!root) return null;

  return (
    <HeaderContainer>
      <span>Responde a</span>
      <Title>
        <SupervisorAccountIcon /> {root}
      </Title>
    </HeaderContainer>
  );
};

export default CardH;
