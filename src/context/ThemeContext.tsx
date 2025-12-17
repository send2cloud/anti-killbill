import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeStyle = 'killbill' | 'wise';
type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    themeStyle: ThemeStyle;
    themeMode: ThemeMode;
    setThemeStyle: (style: ThemeStyle) => void;
    setThemeMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeStyle, setThemeStyleState] = useState<ThemeStyle>(() => {
        const saved = localStorage.getItem('app-theme-style') as ThemeStyle;
        return saved || 'killbill';
    });

    const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('app-theme-mode') as ThemeMode;
        return saved || 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;

        // Remove all theme attributes first
        root.removeAttribute('data-theme-style');
        root.removeAttribute('data-theme-mode');

        // Apply theme style and mode
        root.setAttribute('data-theme-style', themeStyle);
        root.setAttribute('data-theme-mode', themeMode);

        // Save to localStorage
        localStorage.setItem('app-theme-style', themeStyle);
        localStorage.setItem('app-theme-mode', themeMode);
    }, [themeStyle, themeMode]);

    const setThemeStyle = (style: ThemeStyle) => {
        setThemeStyleState(style);
    };

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
    };

    const toggleMode = () => {
        setThemeModeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{
            themeStyle,
            themeMode,
            setThemeStyle,
            setThemeMode,
            toggleMode
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
