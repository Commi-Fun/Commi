'use client'
import * as React from 'react'
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles'
import { shadows, shape, brand, orange, red, green, gray } from './themePrimitives'
import { customColors } from '@/shared-theme/themePrimitives'
import MuiSearch from './themeComponents/MuiSearch'

interface AppThemeProps {
  children: React.ReactNode
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean
}

const themeComponents = {
  ...MuiSearch,
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: '16px',
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: '48px',
        borderBottom: `1px solid ${alpha(gray[300], 0.2)}`, // 底部边框
        '& .MuiTabs-flexContainer': {
          gap: '8px', // Tab 之间的间距
        },
      },
      indicator: {
        backgroundColor: '#84cc16',
        height: '3px',
        borderRadius: '2px',
        // 移除了 transition 动画
      },
    },
  },
  MuiTab: {
    defaultProps: {
      disableRipple: true, // 禁用点击波纹效果
    },
    styleOverrides: {
      root: {
        textTransform: 'none', // 禁用大写转换
        fontWeight: 500,
        fontSize: '16px',
        color: gray[500], // 未选中状态的文本颜色（灰色）
        minHeight: '48px',
        padding: '12px 20px',
        minWidth: 0,
        // 移除了所有动画相关的属性

        // 选中状态
        '&.Mui-selected': {
          color: customColors.main.Black, // 选中状态的文本颜色（绿色）
          fontWeight: 700,
        },
      },
    },
  },
} as any

export default function AppTheme(props: AppThemeProps) {
  const { children } = props
  const theme = React.useMemo(
    () =>
      createTheme({
        breakpoints: {
          values: {
            xs: 0, // 等同于 Tailwind 的移动端默认
            sm: 640, // 对应 Tailwind 的 'sm'
            md: 768, // 对应 Tailwind 的 'md'
            lg: 1024, // 对应 Tailwind 的 'lg'
            xl: 1280, // 对应 Tailwind 的 'xl'
          },
        },
        palette: {
          primary: {
            main: '#d0f685',
            light: '#809b4d',
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
          action: {
            hover: alpha(gray[600], 0.2),
            selected: alpha(gray[600], 0.3),
          },
        },
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
  )
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
