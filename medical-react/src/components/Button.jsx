import React from "react";
import { Button, CircularProgress, Stack } from "@mui/material";

const CustomButton = ({
    children,
    variant = "contained",
    color = "primary",
    size = "medium",
    startIcon,
    endIcon,
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    sx = {},
    ...props
}) => {
    // Custom color styles
    const colorStyles = {
        primary: {
            contained: {
                backgroundColor: "#199A8E",
                color: "#fff",
                "&:hover": {
                    backgroundColor: "#147a6e",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                },
            },
            outlined: {
                color: "#199A8E",
                borderColor: "#199A8E",
                "&:hover": {
                    backgroundColor: "rgba(25, 154, 142, 0.08)",
                    borderColor: "#147a6e",
                },
            },
            text: {
                color: "#199A8E",
                "&:hover": {
                    backgroundColor: "rgba(25, 154, 142, 0.08)",
                },
            },
        },
    };

    return (
        <Button
            variant={variant}
            size={size}
            disabled={disabled || loading}
            fullWidth={fullWidth}
            onClick={onClick}
            startIcon={!loading && startIcon}
            endIcon={!loading && endIcon}
            sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                transition: "all 0.3s ease",
                ...colorStyles[color]?.[variant],
                ...sx,
            }}
            {...props}
        >
            {loading ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <CircularProgress
                        size={20}
                        thickness={4}
                        sx={{
                            color: variant === "contained" ? "#fff" : "#199A8E",
                        }}
                    />
                    <span>{children}</span>
                </Stack>
            ) : (
                children
            )}
        </Button>
    );
};

export default CustomButton;
