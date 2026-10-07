import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";
import { MarcoPagina } from "./MarcoPagina";

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error al cargar las criaturas.");
      })
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  return (
    <MarcoPagina>
      <div className="space-y-8">
        <section className="panel relative isolate overflow-hidden p-7 sm:p-10">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-32 -z-10 h-80 w-80 rounded-full border border-signal/10 bg-gradient-to-br from-signal/10 to-earth/10 blur-[1px]"
          />
          <div
            aria-hidden="true"
            className="absolute right-20 top-7 -z-10 h-36 w-36 rounded-full border border-white/[0.06]"
          />
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-signal/20 bg-signal/[0.08] text-xl">
              <span aria-hidden="true">🧭</span>
            </span>
            <h1 className="text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">
              Criaturas de Pawnee
            </h1>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/criaturas/nueva" className="primary-button">
                Registrar criatura nueva
              </Link>
              <Link to="/avistamientos" className="secondary-button">
                Ver avistamientos
              </Link>
            </div>
          </div>
        </section>

        <section className="panel flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="filtro-tipo" className="mb-2 block text-xs font-semibold text-mist">
              Filtrar por tipo:
            </label>
            <select
              id="filtro-tipo"
              className="field"
              value={filtroTipo}
              onChange={(evento) => setFiltroTipo(evento.target.value as TipoCriatura | "")}
            >
              <option value="">Todos los tipos</option>
              {TIPOS_CRIATURA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </section>

        {cargando && (
          <div className="panel flex items-center gap-4 p-8 text-sm text-mist">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-signal shadow-[0_0_18px_rgba(217,164,65,0.8)]" />
            Cargando criaturas...
          </div>
        )}
        {!cargando && error && (
          <div role="alert" className="panel border-rose-400/20 p-6 text-sm text-rose-200">
            Ocurrió un error: {error}
          </div>
        )}
        {!cargando && !error && criaturas.length === 0 && (
          <div className="panel p-8 text-center text-sm text-mist">Todavía no hay criaturas registradas.</div>
        )}

        {!cargando && !error && criaturas.length > 0 && (
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-white/[0.018]">
                    <th className="table-heading">Nombre</th>
                    <th className="table-heading">Tipo</th>
                    <th className="table-heading">Nivel de peligro</th>
                    <th className="table-heading">Estado</th>
                    <th className="table-heading">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70">
                  {criaturas.map((criatura) => (
                    <tr key={criatura._id} className="transition hover:bg-white/[0.025]">
                      <td className="whitespace-nowrap px-5 py-4 font-bold text-white">{criatura.nombre}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full border border-earth/20 bg-earth/[0.08] px-2.5 py-1 text-xs text-earth-light">
                          {criatura.tipo}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-stone-300">
                          <span className="h-1.5 w-12 overflow-hidden rounded-full bg-white/[0.08]">
                            <span
                              className="block h-full rounded-full bg-gradient-to-r from-signal to-rose-400"
                              style={{ width: `${Math.min(Math.max(criatura.nivelPeligro, 0), 10) * 10}%` }}
                            />
                          </span>
                          {criatura.nivelPeligro}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-stone-300">{criatura.estado}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/criaturas/${criatura._id}`} className="secondary-button !px-3 !py-1.5 !text-xs">
                            Ver
                          </Link>
                          <Link
                            to={`/criaturas/${criatura._id}/editar`}
                            className="secondary-button !px-3 !py-1.5 !text-xs"
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MarcoPagina>
  );
}
