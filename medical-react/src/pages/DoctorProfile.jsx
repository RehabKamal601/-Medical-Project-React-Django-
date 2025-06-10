import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import UserList from "../components/users/UserList";
import UserForm from "../components/users/UserForm";

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([
        {
            id: 1,
            name: "Dr. Ahmed Mohamed",
            email: "ahmed@example.com",
            specialty: "Cardiology",
            consultationFee: 200,
            status: "active",
        },
        // More doctors...
    ]);

    const [openForm, setOpenForm] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(null);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: "#199A8E" }}>
                Doctors Management
            </Typography>

            <UserList
                users={doctors}
                userType="doctor"
                loading={false}
                onAdd={() => {
                    setCurrentDoctor(null);
                    setOpenForm(true);
                }}
                onEdit={(doctor) => {
                    setCurrentDoctor(doctor);
                    setOpenForm(true);
                }}
            />

            <UserForm
                open={openForm}
                userType="doctor"
                user={currentDoctor}
                onClose={() => setOpenForm(false)}
                onSave={(data) => {
                    // Handle save logic
                    setOpenForm(false);
                }}
            />
        </Box>
    );
};

export default DoctorsPage;
