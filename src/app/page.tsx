"use client";

import { useMemo, useState } from "react";
import { markets as initialMarkets, type Market } from "@/data/markets";

type UserPrediction = {
  marketId: string;
  optionId: string;
  points: number;
};

const categories = [
  "Todos",
  "Elecciones",
  "Encuestas",
  "Movilidad",
  "Concejo",
  "Seguridad",
  "Opinión pública",
] as const;

function getOptionPercentage(market: Market, optionId: string) {
  const total = market.options.reduce((sum, option) => sum + option.points, 0);
  if (total === 0) return 0;

  const option = market.options.find((item) => item.id === optionId);
  if (!option) return 0;

  return Math.round((option.points / total) * 100);
}

function formatPoints(points: number) {
  return new Intl.NumberFormat("es-CO").format(points);
}

function getTrendLabel(trend: Market["trend"]) {
  if (trend === "up") return "Subiendo";
  if (trend === "down") return "Bajando";
  return "Estable";
}

function getStatusLabel(status: Market["status"]) {
  if (status === "open") return "Abierto";
  if (status === "closed") return "Cerrado";
  return "Resuelto";
}

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]>("Todos");
  const [selectedMarketId, setSelectedMarketId] = useState(initialMarkets[0].id);
  const [search, setSearch] = useState("");
  const [pointsToUse, setPointsToUse] = useState(100);
  const [userBalance, setUserBalance] = useState(10000);
  const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      const matchesCategory =
        selectedCategory === "Todos" || market.category === selectedCategory;

      const matchesSearch =
        market.title.toLowerCase().includes(search.toLowerCase()) ||
        market.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [markets, selectedCategory, search]);

  const selectedMarket =
    markets.find((market) => market.id === selectedMarketId) ?? markets[0];

  const totalPredictions = userPredictions.length;

  const reputation = Math.min(100, 35 + totalPredictions * 9);

  function makePrediction(marketId: string, optionId: string) {
    if (pointsToUse <= 0) {
      alert("Debes usar al menos 1 punto.");
      return;
    }

    if (pointsToUse > userBalance) {
      alert("No tienes suficientes puntos ficticios.");
      return;
    }

    const previousPrediction = userPredictions.find(
      (prediction) => prediction.marketId === marketId
    );

    const previousPoints = previousPrediction?.points ?? 0;

    setMarkets((currentMarkets) =>
      currentMarkets.map((market) => {
        if (market.id !== marketId) return market;

        return {
          ...market,
          volumePoints: market.volumePoints - previousPoints + pointsToUse,
          options: market.options.map((option) => {
            let updatedPoints = option.points;

            if (previousPrediction?.optionId === option.id) {
              updatedPoints -= previousPoints;
            }

            if (option.id === optionId) {
              updatedPoints += pointsToUse;
            }

            return {
              ...option,
              points: updatedPoints,
            };
          }),
        };
      })
    );

    setUserPredictions((currentPredictions) => {
      const withoutPrevious = currentPredictions.filter(
        (prediction) => prediction.marketId !== marketId
      );

      return [
        ...withoutPrevious,
        {
          marketId,
          optionId,
          points: pointsToUse,
        },
      ];
    });

    setUserBalance((currentBalance) => {
      return currentBalance + previousPoints - pointsToUse;
    });
  }

  function getUserPrediction(marketId: string) {
    return userPredictions.find((prediction) => prediction.marketId === marketId);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl md:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
                Predicciones Bogotá · MVP sin dinero real
              </p>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                Mercados de predicción para entender Bogotá.
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-white/65 md:text-lg">
                Una prueba pública de inteligencia colectiva. Por ahora funciona
                con puntos ficticios, reputación y ranking. No hay pagos, retiros
                ni premios en dinero.
              </p>
            </div>

            <div className="grid min-w-[280px] gap-3 rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <span className="text-white/55">Balance ficticio</span>
                <strong className="text-2xl">
                  {formatPoints(userBalance)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/55">Predicciones</span>
                <strong className="text-2xl">{totalPredictions}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/55">Reputación</span>
                <strong className="text-2xl">{reputation}/100</strong>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 md:p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold">Mercados</h2>
                <p className="mt-1 text-sm text-white/50">
                  Vista inicial tipo tabla para explorar predicciones activas.
                </p>
              </div>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar mercado..."
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300 md:max-w-xs"
              />
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-cyan-300 text-black"
                      : "bg-white/10 text-white/65 hover:bg-white/15"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="hidden grid-cols-[1.4fr_130px_120px_120px_120px] gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3 text-xs uppercase tracking-wide text-white/45 md:grid">
                <span>Mercado</span>
                <span>Probabilidad</span>
                <span>Volumen</span>
                <span>Cierre</span>
                <span>Estado</span>
              </div>

              {filteredMarkets.map((market) => {
                const yesPercentage = getOptionPercentage(market, "yes");
                const noPercentage = getOptionPercentage(market, "no");
                const prediction = getUserPrediction(market.id);

                return (
                  <button
                    key={market.id}
                    onClick={() => setSelectedMarketId(market.id)}
                    className={`grid w-full gap-3 border-b border-white/10 px-4 py-4 text-left transition last:border-b-0 hover:bg-white/[0.06] md:grid-cols-[1.4fr_130px_120px_120px_120px] md:items-center ${
                      selectedMarketId === market.id
                        ? "bg-cyan-300/10"
                        : "bg-transparent"
                    }`}
                  >
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/60">
                          {market.category}
                        </span>
                        <span className="rounded-full bg-black/30 px-2.5 py-1 text-xs text-white/45">
                          {getTrendLabel(market.trend)}
                        </span>
                        {prediction && (
                          <span className="rounded-full bg-cyan-300/15 px-2.5 py-1 text-xs text-cyan-200">
                            Tu predicción:{" "}
                            {prediction.optionId === "yes" ? "Sí" : "No"}
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold leading-snug text-white">
                        {market.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
                        {market.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm md:block">
                        <span className="text-white/45 md:hidden">
                          Probabilidad
                        </span>
                        <strong className="text-lg text-cyan-200">
                          {yesPercentage}% Sí
                        </strong>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-cyan-300"
                          style={{ width: `${yesPercentage}%` }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-white/40">
                        {noPercentage}% No
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm md:block">
                      <span className="text-white/45 md:hidden">Volumen</span>
                      <strong>{formatPoints(market.volumePoints)}</strong>
                      <p className="mt-1 text-xs text-white/40">
                        {market.liquidityLabel}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-white/65 md:block">
                      <span className="text-white/45 md:hidden">Cierre</span>
                      <span>{market.closesAt}</span>
                    </div>

                    <div className="flex items-center justify-between md:block">
                      <span className="text-sm text-white/45 md:hidden">
                        Estado
                      </span>
                      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
                        {getStatusLabel(market.status)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-6 lg:h-fit">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-200">
                {selectedMarket.category}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/55">
                {getStatusLabel(selectedMarket.status)}
              </span>
            </div>

            <h2 className="text-2xl font-black leading-tight">
              {selectedMarket.title}
            </h2>

            <div className="mt-5 grid gap-3">
              {selectedMarket.options.map((option) => {
                const percentage = getOptionPercentage(
                  selectedMarket,
                  option.id
                );

                return (
                  <div
                    key={option.id}
                    className="rounded-2xl border border-white/10 bg-black/25 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-lg">{option.label}</strong>
                      <strong className="text-xl">{percentage}%</strong>
                    </div>

                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${
                          option.id === "yes" ? "bg-cyan-300" : "bg-white"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="mt-2 text-sm text-white/45">
                      {formatPoints(option.points)} puntos ficticios
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 leading-7 text-white/60">
              {selectedMarket.description}
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm text-white/45">Reglas de resolución</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {selectedMarket.rules}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm text-white/45">Fuente</p>
              <p className="mt-2 font-medium text-white/80">
                {selectedMarket.resolutionSource}
              </p>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-white/70">
                Puntos ficticios a usar
              </label>

              <input
                type="number"
                min={1}
                max={userBalance}
                value={pointsToUse}
                onChange={(event) => setPointsToUse(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-300"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => makePrediction(selectedMarket.id, "yes")}
                className="rounded-2xl bg-cyan-300 px-5 py-4 font-black text-black transition hover:bg-cyan-200"
              >
                Predecir Sí
              </button>

              <button
                onClick={() => makePrediction(selectedMarket.id, "no")}
                className="rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:bg-white/80"
              >
                Predecir No
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm leading-6 text-yellow-100">
              Demo sin dinero real. Los puntos son ficticios y sirven solo para
              validar comportamiento, interfaz y lógica de predicción.
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <h2 className="text-2xl font-bold">Ranking demo</h2>

            <div className="mt-4 grid gap-3">
              {[
                ["Juan Granada", "8 predicciones", "78/100"],
                ["Carlos Leongómez", "5 predicciones", "67/100"],
                ["Analista Bogotá", "4 predicciones", "59/100"],
                ["Usuario Invitado", "2 predicciones", "48/100"],
              ].map((row, index) => (
                <div
                  key={row[0]}
                  className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl bg-white/[0.04] px-4 py-3"
                >
                  <strong className="text-white/60">#{index + 1}</strong>
                  <div>
                    <p className="font-semibold">{row[0]}</p>
                    <p className="text-sm text-white/45">{row[1]}</p>
                  </div>
                  <strong>{row[2]}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <h2 className="text-2xl font-bold">Próximas piezas lógicas</h2>

            <div className="mt-4 grid gap-3 text-sm leading-6 text-white/65">
              <div className="rounded-2xl bg-white/[0.04] p-4">
                <strong className="text-white">Login de usuarios</strong>
                <p className="mt-1">
                  Cada cliente tendrá cuenta, balance ficticio, historial y
                  reputación.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] p-4">
                <strong className="text-white">Base de datos</strong>
                <p className="mt-1">
                  Mercados, predicciones, transacciones ficticias, comentarios y
                  resoluciones.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] p-4">
                <strong className="text-white">Panel admin</strong>
                <p className="mt-1">
                  Crear mercados, cerrar predicciones y resolver resultados con
                  reglas claras.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}