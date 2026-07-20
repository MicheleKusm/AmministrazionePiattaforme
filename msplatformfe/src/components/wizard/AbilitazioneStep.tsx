type AbilitazioneStepProps = {
    tipoAbilitazione: "TICKET" | "VERTICALE";
    processoVerticale: string;
    onChangeTipo: (tipo: "TICKET" | "VERTICALE") => void;
    onChangeProcesso: (processo: string) => void;
};

export function AbilitazioneStep({ tipoAbilitazione, processoVerticale, onChangeTipo, onChangeProcesso }: AbilitazioneStepProps) {
    return (
        <section className="card">
            <h3>Tipo di abilitazione</h3>
            <div className="choices">
                <button
                    className={tipoAbilitazione === "VERTICALE" ? "btn-primary" : "btn-secondary"}
                    onClick={() => onChangeTipo("VERTICALE")}
                    type="button"
                >
                    Abilitazione Verticale
                </button>
                <button className={tipoAbilitazione === "TICKET" ? "btn-primary" : "btn-secondary"} onClick={() => onChangeTipo("TICKET")} type="button">
                    Abilitazione Ticket
                </button>
            </div>
            {tipoAbilitazione === "VERTICALE" ? (
                <input onChange={(e) => onChangeProcesso(e.target.value)} placeholder="Processo verticale" value={processoVerticale} />
            ) : (
                <p>Configura campi ticket e comunicazioni onboarding nel passo successivo.</p>
            )}
        </section>
    );
}
