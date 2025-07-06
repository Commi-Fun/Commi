'use client'
import * as React from "react";
import {ThemeProvider, createTheme, alpha} from "@mui/material/styles";
import type {ThemeOptions} from "@mui/material/styles";
import {typography, shadows, shape, brand, orange, red, green, gray} from "./themePrimitives";
import {customColors} from '@/shared-theme/themePrimitives';
import MuiSearch from './themeComponents/MuiSearch';

interface AppThemeProps {
    children: React.ReactNode;
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean;
}

const themeComponents = {
    ...MuiSearch
}

export default function AppTheme(props: AppThemeProps) {
    const {children} = props;
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    primary: {
                        main: "#d0f685",
                        light: '#809b4d'
                    },
                    info: {
                        contrastText: brand[300],
                        light: brand[500],
                        main: brand[700],
                        dark: brand[900],
                    },
                    warning: {
                        light: orange[400],
                        main: orange[500],
                        dark: orange[700],
                    },
                    error: {
                        light: red[400],
                        main: red[500],
                        dark: red[700],
                    },
                    success: {
                        light: green[400],
                        main: green[500],
                        dark: green[700],
                    },
                    grey: {
                        ...gray,
                    },
                    divider: alpha(gray[700], 0.6),
                    background: {
                        default: gray[900],
                        paper: 'hsl(220, 30%, 7%)',
                    },
                    text: {
                        primary: 'hsl(0, 0%, 100%)',
                        secondary: gray[400],
                    },
                    action: {
                        hover: alpha(gray[600], 0.2),
                        selected: alpha(gray[600], 0.3),
                    }
                },
                typography,
                shadows,
                shape,
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                textTransform: 'capitalize',
                            },
                            outlined: {
                                borderColor: customColors.main.Green01,
                                fontWeight: 700,
                                fontSize: '1rem',
                                height: '2.5rem',
                                lineHeight: '2.5rem',
                                borderRadius: '1.25rem',
                            },
                        },
                    },
                    MuiSelect: {
                        styleOverrides: {
                            root: {
                                backgroundColor: '#19191A',
                            },
                        },
                    },
                    ...themeComponents,
                },
            }),
        [],
    );
    return (
        <ThemeProvider theme={theme} defaultMode={'dark'} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}
