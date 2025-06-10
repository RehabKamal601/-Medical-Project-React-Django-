import React, { useState } from "react";
import { Pagination, Stack, ThemeProvider } from "@mui/material";
import theme from "../theme";

const CustomPagination = ({ totalPages, onPageChange }) => {
    const [page, setPage] = useState(1);

    const handleChange = (event, value) => {
        setPage(value);
        if (onPageChange) {
            onPageChange(value);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChange}
                    color="primary"
                    shape="rounded"
                    size="medium"
                />
            </Stack>
        </ThemeProvider>
    );
};

export default CustomPagination;
