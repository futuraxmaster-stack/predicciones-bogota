"use client";

import { useMemo, useState } from "react";

type Market = {
  id: number;
  category: string;
  title: string;
  description: string;
  closesAt: string;
  resolutionSource: string;
  yesPoints: number;
  noPoints: number;
  userPrediction?: "YES" | "NO";
  userPoints?: number;
};

const initialMarkets: Market[] = [
  {
    id: 1,
    category: "Alcaldía de Bogotá",
    title:
      "¿El candidato X liderará la próxima encuesta publicada antes del 30 de junio?",
    description:
      "Este mercado se resolverá con la primera encuesta pública reconocida que mida intención de voto para Alcaldía de Bogotá y sea publicada antes de la fecha límite.",
    closesAt: "30 junio 2026",
    resolutionSource: "Encuesta pública verificable",
    yesPoints: 6200,
    noPoints: 3800,
  },
  {
    id: 2,
    category: "Movilidad",
    title:
      "¿Bogotá anunciará una nueva medida de pico y placa antes del 31 de julio?",
    description:
      "Se resolverá como SÍ si la Alcaldía o Secretaría de Movilidad anuncia oficialmente una modificación nueva al pico y placa antes de la fecha límite.",
    closesAt: "31 julio 2026",
    resolutionSource: "Comunicado oficial Alcaldía / Secretaría de Movilidad",
    yesPoints: 4100,
    noPoints: 5900,
  },
  {
    id: 3,
    category: "Concejo",
    title:
      "¿El Concejo aprobará un proyecto importante de seguridad antes de agosto?",
    description:
      "Se resolverá como SÍ si el Concejo de Bogotá aprueba en debate final un proyecto relacionado directamente con seguridad ciudadana.",
    closesAt: "15 agosto 2026",
    resolutionSource: "Registro oficial del Concejo de Bogotá",
    yesPoints: 5200,
    noPoints: 4800,
  },
  {
    id: 4,
    category: "Opinión pública",
    title:
      "¿La aprobación del alcalde estará por encima del 45% en la próxima medición?",
    description:
      "Se resolverá con la siguiente encuesta pública que mida aprobación del alcalde de Bogotá y publique resultados completos.",
    closesAt: "Próxima encuesta disponible",
    resolutionSource: "Encuesta pública verificable",
    yesPoints: 3500,
    noPoints: 6500,
  },
];

function getProbability(yesPoints: number, noPoints: number) {
  const total = yesPoints + noPoints;
  if (total === 0) return 50;
  return Math.round((yesPoints / total) * 100);
}

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedMarketId, setSelectedMarketId] = useState<number>(
    initialMarkets[0].id
  );
  const [pointsToUse, setPointsToUse] = useState(100);
  const [userBalance, setUserBalance] = useState(10000);

  const selectedMarket = markets.find(
    (market) => market.id === selectedMarketId
  );

  const totalPredictions = useMemo(() => {
    return markets.filter((market) => market.userPrediction).length;
  }, [markets]);

  const reputation = useMemo(() => {
    return Math.min(100, 35 + totalPredictions * 8);
  }, [totalPredictions]);

  function makePrediction(marketId: number, prediction: "YES" | "NO") {
    if (pointsToUse <= 0) {
      alert("Debes usar al menos 1 punto.");
      return;
    }

    if (pointsToUse > userBalance) {
      alert("No tienes suficientes puntos ficticios.");
      return;
    }

    const currentMarket = markets.find((market) => market.id === marketId);
    const previousPoints = currentMarket?.userPoints ?? 0;

    setMarkets((currentMarkets) =>
      currentMarkets.map((market) => {
        if (market.id !== marketId) return market;

        let updatedYes = market.yesPoints;
        let updatedNo = market.noPoints;

        if (market.userPrediction === "YES") updatedYes -= previousPoints;
        if (market.userPrediction === "NO") updatedNo -= previousPoints;

        if (prediction === "YES") updatedYes += pointsToUse;
        if (prediction === "NO") updatedNo += pointsToUse;

        return {
          ...market,
          yesPoints: updatedYes,
          noPoints: updatedNo,
          userPrediction: prediction,
          userPoints: pointsToUse,
        };
      })
    );

    setUserBalance((currentBalance) => {
      return currentBalance + previousPoints - pointsToUse;
    });
  }

  return (
    <main className="min-h-screen bg-[#080A12] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 md:px-8 lg:py-12">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
                MVP Bogotá · Predicciones con puntos ficticios
              </p>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
                Predice lo que pasará en Bogotá.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                Una plataforma experimental de inteligencia colectiva. Sin
                dinero real, sin apuestas, sin retiros: solo predicciones,
                reputación y ranking.
              </p>
            </div>

            <div className="grid min-w-[260px] gap-3 rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Puntos ficticios</span>
                <strong className="text-2xl">
                  {userBalance.toLocaleString()}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/60">Predicciones</span>
                <strong className="text-2xl">{totalPredictions}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/60">Reputación</span>
                <strong className="text-2xl">{reputation}/100</strong>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/10 pt-5 md:grid-cols-3">
            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-white/50">Fase actual</p>
              <p className="mt-1 font-semibold">Validar interés</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-white/50">Modelo</p>
              <p className="mt-1 font-semibold">Puntos + reputación</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-white/50">Próximo paso</p>
              <p className="mt-1 font-semibold">Login + base de datos</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mercados destacados</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/60">
                Demo
              </span>
            </div>

            {markets.map((market) => {
              const yesProbability = getProbability(
                market.yesPoints,
                market.noPoints
              );

              return (
                <button
                  key={market.id}
                  onClick={() => setSelectedMarketId(market.id)}
                  className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:bg-white/[0.06] ${
                    selectedMarketId === market.id
                      ? "border-cyan-300/60 bg-cyan-300/10"
                      : "border-white/10 bg-white/[0.035]"
                  }`}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                      {market.category}
                    </span>
                    <span className="rounded-full bg-black/30 px-3 py-1 text-xs text-white/50">
                      Cierra: {market.closesAt}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold leading-snug">
                    {market.title}
                  </h3>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-white/60">Probabilidad SÍ</span>
                      <strong>{yesProbability}%</strong>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-300"
                        style={{ width: `${yesProbability}%` }}
                      />
                    </div>
                  </div>

                  {market.userPrediction && (
                    <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/70">
                      Tu predicción:{" "}
                      <strong className="text-white">
                        {market.userPrediction === "YES" ? "SÍ" : "NO"}
                      </strong>{" "}
                      con {market.userPoints} puntos ficticios.
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 lg:sticky lg:top-6 lg:h-fit">
            {selectedMarket ? (
              <>
                <p className="mb-3 w-fit rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-200">
                  {selectedMarket.category}
                </p>

                <h2 className="text-2xl font-black leading-tight">
                  {selectedMarket.title}
                </h2>

                <p className="mt-4 leading-7 text-white/65">
                  {selectedMarket.description}
                </p>

                <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div>
                    <p className="text-sm text-white/50">
                      Fuente de resolución
                    </p>
                    <p className="font-semibold">
                      {selectedMarket.resolutionSource}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/50">Fecha de cierre</p>
                    <p className="font-semibold">{selectedMarket.closesAt}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-medium text-white/70">
                    Puntos ficticios a usar
                  </label>

                  <input
                    type="number"
                    min={1}
                    max={userBalance}
                    value={pointsToUse}
                    onChange={(event) =>
                      setPointsToUse(Number(event.target.value))
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-300"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => makePrediction(selectedMarket.id, "YES")}
                    className="rounded-2xl bg-cyan-300 px-5 py-4 font-black text-black transition hover:bg-cyan-200"
                  >
                    Predecir SÍ
                  </button>

                  <button
                    onClick={() => makePrediction(selectedMarket.id, "NO")}
                    className="rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:bg-white/80"
                  >
                    Predecir NO
                  </button>
                </div>

                <div className="mt-6 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm leading-6 text-yellow-100">
                  Esta demo no usa dinero real, premios, pagos ni retiros. Es
                  una prueba de producto basada en puntos ficticios y
                  reputación.
                </div>
              </>
            ) : (
              <p>Selecciona un mercado.</p>
            )}
          </aside>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-bold">Ranking demo</h2>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            {[
              ["Juan Granada", "8 predicciones", "78/100"],
              ["Carlos Leongómez", "5 predicciones", "67/100"],
              ["Analista Bogotá", "4 predicciones", "59/100"],
              ["Usuario Invitado", "2 predicciones", "48/100"],
            ].map((row, index) => (
              <div
                key={row[0]}
                className="grid grid-cols-[50px_1fr_140px_100px] gap-3 border-b border-white/10 px-4 py-4 last:border-b-0 max-sm:grid-cols-1"
              >
                <strong>#{index + 1}</strong>
                <span>{row[0]}</span>
                <span className="text-white/60">{row[1]}</span>
                <span className="font-semibold">{row[2]}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}