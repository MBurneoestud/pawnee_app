import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eliminarAvistamiento, obtenerAvistamientos } from "../api/avistamientosApi";
import { Avistamiento } from "../tipos";
import { MarcoPagina } from "./MarcoPagina";

export function ListaAvistamientos() {
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    setCargando(true);
    setError(null);
    obtenerAvistamientos()
      .then(setAvistamientos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar los avistamientos."))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function manejarEliminar(id: string) {
    if (!window.confirm("¿Eliminar este avistamiento?")) return;
    try {
      await eliminarAvistamiento(id);
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el avistamiento.");
    }
  }

  return (
    <MarcoPagina>
      <div className="space-y-8">
        <section className="panel relative isolate overflow-hidden p-7 sm:p-10">
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-28 -z-10 h-80 w-80 rounded-full bg-gradient-to-br from-violet/15 to-signal/10 blur-2xl"
          />
          <div className="relative max-w-3xl">
            <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet/25 bg-violet/[0.09] text-xl">
              <span aria-hidden="true">◉</span>
            </span>
            <h1 className="text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">
              Avistamientos registrados
            </h1>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/" className="secondary-button">
                Volver a criaturas
              </Link>
              <Link to="/avistamientos/nuevo" className="primary-button">
                Registrar avistamiento nuevo
              </Link>
            </div>
          </div>
        </section>

        {cargando && (
          <div className="panel flex items-center gap-4 p-8 text-sm text-mist">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-signal shadow-[0_0_18px_rgba(82,215,245,0.8)]" />
            Cargando avistamientos...
          </div>
        )}
        {!cargando && error && (
          <div role="alert" className="panel border-rose-400/20 p-6 text-sm text-rose-200">
            Error: {error}
          </div>
        )}
        {!cargando && !error && avistamientos.length === 0 && (
          <div className="panel p-8 text-center text-sm text-mist">Todavía no hay avistamientos registrados.</div>
        )}

        {!cargando && !error && avistamientos.length > 0 && (
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-white/[0.018]">
                    <th className="table-heading">Fecha</th>
                    <th className="table-heading">Criatura</th>
                    <th className="table-heading">Testigo</th>
                    <th className="table-heading">Ubicación</th>
                    <th className="table-heading">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70">
                  {avistamientos.map((avistamiento) => (
                    <tr key={avistamiento._id} className="transition hover:bg-white/[0.025]">
                      <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-mist">
                        {avistamiento.fecha.slice(0, 10)}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/criaturas/${avistamiento.criatura._id}`}
                          className="font-bold text-white transition hover:text-signal"
                        >
                          {avistamiento.criatura.nombre}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-slate-300">{avistamiento.testigo}</td>
                      <td className="px-5 py-4 text-slate-300">{avistamiento.ubicacion}</td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => manejarEliminar(avistamiento._id)}
                          className="inline-flex items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/[0.05] px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:border-rose-400/50 hover:bg-rose-400/[0.12]"
                        >
                          Eliminar
                        </button>
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
