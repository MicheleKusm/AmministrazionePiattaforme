import ReactDOM from "react-dom/client";
import "./styles.css";

const steps = ["Elenco", "Piattaforma", "Ruoli", "Gruppi", "Abilitazione", "Cruscotto", "Riepilogo"];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <main className="page">
        <h1>ACRGS - Amministrazione Piattaforme</h1>
        <p>Pagine da creare per Amministrazione Piattaforme</p>
        <ol className="stepper">
            {steps.map((step) => (
                <li key={step}>{step}</li>
            ))}
        </ol>
    </main>
);
