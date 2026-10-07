import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { crearAvistamiento } from "../api/avistamientosApi";
import { obtenerCriaturas } from "../api/criaturasApi";
import { AvistamientoFormulario, Criatura } from "../tipos";
import { MarcoPagina } from "./MarcoPagina";

const FORM_VACIO: AvistamientoFormulario = {
  criatura: "",
  testigo: "",
  ubicacion: "",
  descripcion: "",
  fecha: "",
};

export function FormularioAvistamiento() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();

  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [form, setForm] = useState<AvistamientoFormulario>({
    ...FORM_VACIO,
    criatura: parametros.get("criaturaId") ?? "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerCriaturas()
      .then((lista) => {
        setCriaturas(lista);
        if (!form.criatura && lista.length > 0) {
          setForm((actual) => ({ ...actual, criatura: lista[0]._id }));
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudieron cargar las criaturas."))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.criatura || !form.testigo.trim() || !form.ubicacion.trim() || !form.fecha) {
      setError("Criatura, testigo, ubicación y fecha son obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      await crearAvistamiento(form);
      navigate("/avistamientos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el avistamiento.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <MarcoPagina>
        <div className="panel flex items-center gap-4 p-8 text-sm text-mist">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-signal shadow-[0_0_18px_rgba(82,215,245,0.8)]" />
          Cargando formulario...
        </div>
      </MarcoPagina>
    );
  }

  return (
    <MarcoPagina>
      <div className="mx-auto max-w-3xl">
        <Link
          to="/avistamientos"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-signal"
        >
          <span aria-hidden="true">←</span>
          Ver avistamientos
        </Link>
        <section className="panel overflow-hidden">
          <div className="border-b border-line bg-gradient-to-r from-violet/[0.1] via-transparent to-signal/[0.08] px-6 py-7 sm:px-9">
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet/25 bg-violet/[0.09] text-xl">
              <span aria-hidden="true">◉</span>
            </span>
            <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-white">Registrar avistamiento</h1>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-6 p-6 sm:p-9">
            {error && (
              <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-200">
                Error: {error}
              </p>
            )}

            <div>
              <label htmlFor="criatura" className="mb-2 block text-sm font-semibold text-slate-200">
                Criatura:
              </label>
              <select
                id="criatura"
                className="field"
                value={form.criatura}
                onChange={(e) => setForm({ ...form, criatura: e.target.value })}
              >
                {criaturas.map((criatura) => (
                  <option key={criatura._id} value={criatura._id}>
                    {criatura.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="testigo" className="mb-2 block text-sm font-semibold text-slate-200">
                  Testigo:
                </label>
                <input
                  id="testigo"
                  className="field"
                  type="text"
                  value={form.testigo}
                  onChange={(e) => setForm({ ...form, testigo: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="fecha" className="mb-2 block text-sm font-semibold text-slate-200">
                  Fecha:
                </label>
                <input
                  id="fecha"
                  className="field"
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="ubicacion" className="mb-2 block text-sm font-semibold text-slate-200">
                Ubicación:
              </label>
              <input
                id="ubicacion"
                className="field"
                type="text"
                value={form.ubicacion}
                onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="mb-2 block text-sm font-semibold text-slate-200">
                Descripción (opcional):
              </label>
              <input
                id="descripcion"
                className="field"
                type="text"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>

            <div className="border-t border-line pt-6">
              <button type="submit" disabled={guardando} className="primary-button w-full sm:w-auto">
                {guardando ? "Guardando..." : "Registrar avistamiento"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </MarcoPagina>
  );
}
