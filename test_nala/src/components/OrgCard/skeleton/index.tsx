import React from "react";
import styled from "@emotion/styled";
import { Card, CardActions, CardContent, CardHeader, IconButton, Skeleton } from "@mui/material";

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

const OrgCardSkeleton = () => {
  return (
    <Container>
      <StyledCard>
        <CardHeader
          avatar={<Skeleton variant="circular" width={40} height={40} />}
          action={<Skeleton variant="rectangular" width={40} height={40} />}
          title={<Skeleton variant="text" width="60%" height={24} />}
        />
        <CardContent>
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="rectangular" width="100%" height={50} sx={{ marginTop: 2 }} />
        </CardContent>
        <StyledCardActions>
          <IconButton disabled>
            <Skeleton variant="circular" width={30} height={30} />
          </IconButton>
          <IconButton disabled>
            <Skeleton variant="circular" width={30} height={30} />
          </IconButton>
        </StyledCardActions>
      </StyledCard>
    </Container>
  );
};

export default OrgCardSkeleton;
