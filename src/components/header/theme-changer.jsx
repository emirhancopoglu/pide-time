import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Switch onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
    </>
  );
}
