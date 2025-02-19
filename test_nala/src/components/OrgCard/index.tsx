import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { Checkbox, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

type OrgCardProps = {
    id: number;
    title: string;
    addChild: (parentId: number) => void;
};

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const OrgCard = (props: OrgCardProps) => {
    const { title, id, addChild } = props;
    const [checked, setChecked] = React.useState(true);

    return (
        <div
            id={id.toString()}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 10,
            }}>
            <Card sx={{
                minWidth: 325,
                minHeight: 350,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                <CardHeader
                    avatar={<Checkbox {...label} checked={checked} onChange={() => setChecked(!checked)} />}
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    <Typography gutterBottom sx={{
                        color: 'text.secondary',
                        fontSize: 24,
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        letterSpacing: '0.1em',
                    }}>
                        {title}
                    </Typography>
                    <Typography variant="body2">
                        Example content for the OrgCard.
                    </Typography>
                </CardContent>
                <CardActions sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    borderTop: '1px solid #f0f0f0',
                    boxShadow: '0px -1px 0px #f0f0f0',
                    backgroundColor: '#DBE2E9'
                }}>
                    <IconButton aria-label="save">
                        <SaveIcon />
                    </IconButton>
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            </Card>
            <IconButton aria-label="add" onClick={() => addChild(id)}>
                <AddCircleOutlineIcon color="primary" sx={{ fontSize: 50 }} />
            </IconButton>
        </div>
    );
};

export default OrgCard;
