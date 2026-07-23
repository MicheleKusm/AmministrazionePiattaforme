
import type { Piattaforma, RiepilogoStepProps } from "../../types/type"
import { CardCommon } from "../../components/common/CardCommon"

export function RiepilogoStep({ piattaforma, ruoli, gruppi, tipoAbilitazione }: RiepilogoStepProps) {

    const visibleRuoli = ruoli.filter((r) => !r.daEliminare)
    const visibleGruppi = gruppi.filter((g) => !g.daEliminare)

    const toggleLabel = (key: keyof Piattaforma) => {
        const map: Record<string, string> = {
            readOnly: "In sola lettura",
            ripetibile: "Ripetibile",
            utilizzoModelloAutorizzativo: "Utilizzo modello autorizzativo"
        }
        return map[key] || key
    }
    const togglesToShow: (keyof Piattaforma)[] = ["readOnly", "ripetibile", "utilizzoModelloAutorizzativo"]
    const abilitazioniCount = { TICKET: 0, VERTICALE: 0 }

    if (piattaforma?.abilitazione === "TICKET") abilitazioniCount.TICKET = 1
    else if (piattaforma?.abilitazione === "VERTICALE") abilitazioniCount.VERTICALE = 1

    return (
        <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Piattaforma */}
                <CardCommon title="Piattaforma">
                    <div className="text-sm">
                        <p>
                            <span className="font-bold">Nome:</span> {piattaforma?.nome}
                        </p>
                        <p>
                            <span className="font-bold">ObjClass:</span> {piattaforma?.objClass}
                        </p>
                        <p>
                            <span className="font-bold">OAM Metadata:</span> {piattaforma?.oamMetadataName} / {piattaforma?.oamMetadataValue}
                        </p>
                        <div className="mt-2 space-y-1">
                            {togglesToShow.map((key) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-2">
                                    <span className="w-32 text-gray-600">{toggleLabel(key)}:</span>
                                    <span className={piattaforma?.[key] ? "text-green-600" : "text-gray-400"}>{piattaforma?.[key] ? "Sì" : "No"}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardCommon>
                {/* Ruoli */}
                <CardCommon title={`Ruoli (${visibleRuoli.length})`}>
                    {visibleRuoli.length === 0 ? (
                        <p className="text-sm text-gray-500">Nessun ruolo configurato</p>
                    ) : (
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {visibleRuoli.map((r) => (
                                <li key={r.id}>{r.nome}</li>
                            ))}
                        </ul>
                    )}
                </CardCommon>
                {/* Gruppi */}
                <CardCommon title={`Gruppi (${visibleGruppi.length})`}>
                    {visibleGruppi.length === 0 ? (
                        <p className="text-sm text-gray-500">Nessun gruppo configurato</p>
                    ) : (
                        <ul className="space-y-2 text-sm">
                            {visibleGruppi.map((g) => (
                                <li key={g.id}>
                                    <span className="font-bold">{g.nome}</span>
                                    {g.ruoliIds && g.ruoliIds.length > 0 && (
                                        <span className="text-gray-500 ml-2">
                                            (ruoli:{" "}
                                            {g.ruoliIds
                                                .map((id) => ruoli.find((r) => r.id === id)?.nome)
                                                .filter(Boolean)
                                                .join(", ")}
                                            )
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardCommon>
                {/* Abilitazione */}
                <CardCommon title="Abilitazione">
                    <div className="text-sm">
                        <p>
                            <span className="font-medium">Tipo:</span> {tipoAbilitazione || "Non definito"}
                        </p>
                        <p>
                            <span className="font-medium">Ticket:</span> {abilitazioniCount.TICKET}
                        </p>
                        <p>
                            <span className="font-medium">Verticali:</span> {abilitazioniCount.VERTICALE}
                        </p>
                        {tipoAbilitazione === "TICKET" && <p className="text-gray-500 mt-1">Dettagli ticket: (da implementare)</p>}
                        {tipoAbilitazione === "VERTICALE" && <p className="text-gray-500 mt-1">Processi verticali: (da implementare)</p>}
                    </div>
                </CardCommon>
            </div>
        </div>
    )
}
