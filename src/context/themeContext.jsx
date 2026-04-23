import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => {
		return localStorage.getItem("invoice_theme") || "light";
	});

	useEffect(() => {
		localStorage.setItem("invoice_theme", theme);
	}, [theme]);

	const toggleTheme = () =>
		setTheme((prev) => (prev === "light" ? "dark" : "light"));

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
	return ctx;
}
