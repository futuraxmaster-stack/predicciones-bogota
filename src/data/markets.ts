export type MarketStatus = "open" | "closed" | "resolved";

export type MarketCategory =
  | "Elecciones"
  | "Encuestas"
  | "Movilidad"
  | "Concejo"
  | "Seguridad"
  | "Opinión pública";

export type MarketOption = {
  id: string;
  label: string;
  points: number;
};

export type Market = {
  id: string;
  slug: string;
  title: string;
  category: MarketCategory;
  status: MarketStatus;
  closesAt: string;
  resolutionSource: string;
  description: string;
  rules: string;
  volumePoints: number;
  liquidityLabel: string;
  trend: "up" | "down" | "flat";
  options: MarketOption[];
};

export const markets: Market[] = [
  {
    id: "bog-alcaldia-001",
    slug: "lider-proxima-encuesta-alcaldia-bogota",
    title:
      "¿El candidato X liderará la próxima encuesta de Alcaldía de Bogotá?",
    category: "Elecciones",
    status: "open",
    closesAt: "30 junio 2026",
    resolutionSource: "Primera encuesta pública verificable publicada antes del cierre",
    description:
      "Este mercado mide si el candidato X aparece en primer lugar en la próxima encuesta pública reconocida sobre intención de voto para la Alcaldía de Bogotá.",
    rules:
      "Se resolverá como SÍ si el candidato X aparece primero en intención de voto. Si hay empate técnico, se usará el porcentaje publicado, no la interpretación del medio. Si no hay encuesta válida antes del cierre, el mercado se cancela.",
    volumePoints: 12800,
    liquidityLabel: "Alta actividad",
    trend: "up",
    options: [
      { id: "yes", label: "Sí", points: 7600 },
      { id: "no", label: "No", points: 5200 },
    ],
  },
  {
    id: "bog-encuestas-002",
    slug: "aprobacion-alcalde-mayor-45",
    title: "¿La aprobación del alcalde estará por encima del 45%?",
    category: "Encuestas",
    status: "open",
    closesAt: "Próxima medición pública",
    resolutionSource: "Encuesta pública con ficha técnica disponible",
    description:
      "Predicción sobre si la próxima medición pública de aprobación del alcalde de Bogotá mostrará un resultado superior al 45%.",
    rules:
      "Se resolverá como SÍ si la cifra publicada de aprobación es mayor a 45.0%. Si la encuesta publica varios escenarios, se usará la medición principal de aprobación general.",
    volumePoints: 9400,
    liquidityLabel: "Actividad media",
    trend: "down",
    options: [
      { id: "yes", label: "Sí", points: 3600 },
      { id: "no", label: "No", points: 5800 },
    ],
  },
  {
    id: "bog-movilidad-003",
    slug: "nueva-medida-pico-y-placa",
    title: "¿Bogotá anunciará una nueva medida de pico y placa antes de julio?",
    category: "Movilidad",
    status: "open",
    closesAt: "31 julio 2026",
    resolutionSource: "Comunicado oficial de Alcaldía o Secretaría de Movilidad",
    description:
      "Este mercado predice si la administración distrital anunciará una modificación nueva al esquema de pico y placa antes de la fecha de cierre.",
    rules:
      "Se resolverá como SÍ si existe un anuncio oficial de cambio, ampliación, reducción o modificación del pico y placa. Rumores, entrevistas no oficiales o propuestas no cuentan.",
    volumePoints: 7300,
    liquidityLabel: "Actividad media",
    trend: "flat",
    options: [
      { id: "yes", label: "Sí", points: 4100 },
      { id: "no", label: "No", points: 3200 },
    ],
  },
  {
    id: "bog-concejo-004",
    slug: "concejo-aprueba-proyecto-seguridad",
    title: "¿El Concejo aprobará un proyecto importante de seguridad?",
    category: "Concejo",
    status: "open",
    closesAt: "15 agosto 2026",
    resolutionSource: "Registro oficial del Concejo de Bogotá",
    description:
      "Predicción sobre si el Concejo de Bogotá aprueba en debate final un proyecto relacionado directamente con seguridad ciudadana.",
    rules:
      "Se resolverá como SÍ si el proyecto es aprobado en debate final antes del cierre. Proyectos radicados, debates iniciales o anuncios sin aprobación final no cuentan.",
    volumePoints: 6100,
    liquidityLabel: "Baja actividad",
    trend: "up",
    options: [
      { id: "yes", label: "Sí", points: 3300 },
      { id: "no", label: "No", points: 2800 },
    ],
  },
  {
    id: "bog-seguridad-005",
    slug: "homicidios-bogota-bajan-trimestre",
    title: "¿Los homicidios en Bogotá bajarán en el próximo trimestre reportado?",
    category: "Seguridad",
    status: "open",
    closesAt: "Cuando se publique el próximo reporte trimestral",
    resolutionSource: "Reporte oficial de autoridad competente",
    description:
      "Este mercado busca medir si el próximo reporte trimestral muestra una reducción frente al trimestre inmediatamente anterior.",
    rules:
      "Se resolverá como SÍ si la cifra total de homicidios del trimestre reportado es menor a la cifra del trimestre inmediatamente anterior, usando la misma fuente.",
    volumePoints: 4800,
    liquidityLabel: "Baja actividad",
    trend: "flat",
    options: [
      { id: "yes", label: "Sí", points: 2100 },
      { id: "no", label: "No", points: 2700 },
    ],
  },
  {
    id: "bog-opinion-006",
    slug: "tema-metro-dominara-agenda",
    title: "¿El metro será el tema político dominante de Bogotá esta semana?",
    category: "Opinión pública",
    status: "open",
    closesAt: "Domingo 11:59 p.m.",
    resolutionSource: "Revisión editorial interna con fuentes públicas",
    description:
      "Predicción semanal sobre si el metro de Bogotá domina la conversación política local en medios, redes y declaraciones públicas.",
    rules:
      "Se resolverá usando una revisión editorial de medios y fuentes públicas. Este tipo de mercado es experimental y debe migrar luego a una fuente más objetiva.",
    volumePoints: 3900,
    liquidityLabel: "Experimental",
    trend: "up",
    options: [
      { id: "yes", label: "Sí", points: 2600 },
      { id: "no", label: "No", points: 1300 },
    ],
  },
];