import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Checkbox, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

type OrgCardProps = {
    title: string;
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const OrgCard = (props: OrgCardProps) => {
    const { title } = props;
    const [checked, setChecked] = React.useState(true);
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardHeader
                avatar={<Checkbox {...label} checked={checked} onChange={() => setChecked(!checked)}
                />}
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
            />
            <CardContent>
                <Typography gutterBottom sx={{
                    color: 'text.secondary',
                    fontSize: 14
                }}>
                    {title}
                </Typography>
                <Typography variant="h5" component="div">

                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
                <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    )

}

export default OrgCard;