type SidebarProps = {
    activeMenu: "dashboard" | "config";
    onChangeMenu: (menu: "dashboard" | "config") => void;
};

export function Sidebar({ activeMenu, onChangeMenu }: SidebarProps) {
    return (
        <aside className="sidebar">
            <h2>Administration Console</h2>
            <button className={activeMenu === "dashboard" ? "menu active" : "menu"} onClick={() => onChangeMenu("dashboard")} type="button">
                Dashboard
            </button>
            <button className={activeMenu === "config" ? "menu active" : "menu"} onClick={() => onChangeMenu("config")} type="button">
                Configurazioni Piattaforma
            </button>
        </aside>
    );
}
