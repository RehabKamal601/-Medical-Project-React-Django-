import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const UserCard = ({ id, img, title, desc, page, fullUser }) => {
    return (
        <Card sx={{ boxShadow: 0, border: "1px solid #e0e0e0" }}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body1">{desc}</Typography>
                <Box sx={{ mt: 2 }}>
                    <Button component={Link} to={page} variant="outlined" sx={{ mr: 1 }}>
                        View Details
                    </Button>
                    <Button variant="outlined" sx={{ mr: 1 }}>
                        Edit
                    </Button>
                    <Button variant="outlined">Delete</Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;
