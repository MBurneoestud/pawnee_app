import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { Criatura } from "../tipos";
import { MarcoPagina } from "./MarcoPagina";

interface AvistamientoSinPopular {
  _id: string;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([criaturaCargada, avistamientosCargados]) => {
        setCriatura(criaturaCargada);
        setAvistamientos(avistamientosCargados as unknown as AvistamientoSinPopular[]);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEliminar() {
    if (!id) return;
    if (!window.confirm("¿Seguro que quieres eliminar esta criatura?")) return;

    try {
      await eliminarCriatura(id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la criatura.");
    }
  }

  if (cargando) {
    return (
      <MarcoPagina>
        <div className="panel flex items-center gap-4 p-8 text-sm text-mist">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-signal shadow-[0_0_18px_rgba(82,215,245,0.8)]" />
          Cargando...
        </div>
      </MarcoPagina>
    );
  }
  if (error) {
    return (
      <MarcoPagina>
        <div role="alert" className="panel border-rose-400/20 p-6 text-sm text-rose-200">
          Error: {error}
        </div>
      </MarcoPagina>
    );
  }
  if (!criatura) {
    return (
      <MarcoPagina>
        <div className="panel p-8 text-sm text-mist">No se encontró la criatura.</div>
      </MarcoPagina>
    );
  }

  return (
    <MarcoPagina>
      <div className="space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-signal">
          <span aria-hidden="true">←</span>
          Volver a la lista
        </Link>

        <section className="panel relative isolate overflow-hidden p-7 sm:p-10">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-24 -z-10 h-80 w-80 rounded-full bg-gradient-to-br from-signal/10 to-violet/15 blur-2xl"
          />
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-signal/20 bg-signal/[0.08] text-xl">
                <span aria-hidden="true">👁️</span>
              </span>
              <h1 className="text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">{criatura.nombre}</h1>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-violet/25 bg-violet/[0.09] px-3 py-1.5 text-xs font-semibold text-violet-200">
                  {criatura.tipo}
                </span>
                <span className="rounded-full border border-signal/20 bg-signal/[0.06] px-3 py-1.5 text-xs font-semibold text-signal">
                  {criatura.estado}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={`/criaturas/${criatura._id}/editar`} className="secondary-button">
                Editar
              </Link>
              <button
                type="button"
                onClick={manejarEliminar}
                className="inline-flex items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:border-rose-400/50 hover:bg-rose-400/[0.12]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="panel p-6 sm:p-8">
            <dl className="mt-6 divide-y divide-line">
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm text-mist">Tipo:</dt>
                <dd className="text-right text-sm font-semibold text-white">{criatura.tipo}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm text-mist">Nivel de peligro:</dt>
                <dd className="text-right text-sm font-semibold text-white">{criatura.nivelPeligro}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm text-mist">Estado:</dt>
                <dd className="text-right text-sm font-semibold text-white">{criatura.estado}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="text-sm text-mist">Habilidades:</dt>
                <dd className="max-w-[60%] text-right text-sm leading-6 text-white">
                  {criatura.habilidades.join(", ") || "(ninguna registrada)"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="panel p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-xl font-bold tracking-tight text-white">Avistamientos registrados</h2>
              <Link
                to={`/avistamientos/nuevo?criaturaId=${criatura._id}`}
                className="secondary-button shrink-0 !text-xs"
              >
                Registrar un avistamiento de esta criatura
              </Link>
            </div>
            {avistamientos.length === 0 ? (
              <p className="mt-7 rounded-2xl border border-dashed border-line px-5 py-8 text-center text-sm text-mist">
                Todavía no hay avistamientos registrados para esta criatura.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-line">
                {avistamientos.map((avistamiento) => (
                  <li key={avistamiento._id} className="flex gap-4 py-5">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-signal shadow-[0_0_12px_rgba(82,215,245,0.7)]" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-6 text-white">
                        {avistamiento.fecha.slice(0, 10)} — {avistamiento.testigo} en {avistamiento.ubicacion}
                      </p>
                      {avistamiento.descripcion && (
                        <p className="mt-1 text-sm leading-6 text-mist">{avistamiento.descripcion}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </MarcoPagina>
  );
}
