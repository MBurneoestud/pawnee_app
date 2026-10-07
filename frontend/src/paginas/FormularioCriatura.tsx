import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearCriatura, actualizarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { CriaturaFormulario, TIPOS_CRIATURA, ESTADOS_INVESTIGACION } from "../tipos";
import { MarcoPagina } from "./MarcoPagina";

const FORM_VACIO: CriaturaFormulario = {
  nombre: "",
  tipo: "mitica",
  habilidades: [],
  nivelPeligro: 5,
  estado: "activa",
};

export function FormularioCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState<CriaturaFormulario>(FORM_VACIO);
  const [habilidadesTexto, setHabilidadesTexto] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    obtenerCriaturaPorId(id)
      .then((criatura) => {
        setForm({
          nombre: criatura.nombre,
          tipo: criatura.tipo,
          habilidades: criatura.habilidades,
          nivelPeligro: criatura.nivelPeligro,
          estado: criatura.estado,
        });
        setHabilidadesTexto(criatura.habilidades.join(", "));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudo cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const datosAEnviar: CriaturaFormulario = {
      ...form,
      habilidades: habilidadesTexto
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0),
    };

    try {
      setGuardando(true);
      if (esEdicion && id) {
        await actualizarCriatura(id, datosAEnviar);
      } else {
        await crearCriatura(datosAEnviar);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la criatura.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <MarcoPagina>
        <div className="panel flex items-center gap-4 p-8 text-sm text-mist">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-signal shadow-[0_0_18px_rgba(82,215,245,0.8)]" />
          Cargando datos de la criatura...
        </div>
      </MarcoPagina>
    );
  }

  return (
    <MarcoPagina>
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-signal">
          <span aria-hidden="true">←</span>
          Volver a la lista
        </Link>
        <section className="panel overflow-hidden">
          <div className="border-b border-line bg-gradient-to-r from-signal/[0.08] via-transparent to-violet/[0.08] px-6 py-7 sm:px-9">
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-signal/20 bg-signal/[0.08] text-lg">
              <span aria-hidden="true">👁️</span>
            </span>
            <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-white">
              {esEdicion ? "Editar criatura" : "Registrar criatura nueva"}
            </h1>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-6 p-6 sm:p-9">
            {error && (
              <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-200">
                Error: {error}
              </p>
            )}

            <div>
              <label htmlFor="nombre" className="mb-2 block text-sm font-semibold text-slate-200">
                Nombre:
              </label>
              <input
                id="nombre"
                className="field"
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="tipo" className="mb-2 block text-sm font-semibold text-slate-200">
                  Tipo:
                </label>
                <select
                  id="tipo"
                  className="field"
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value as CriaturaFormulario["tipo"] })}
                >
                  {TIPOS_CRIATURA.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="estado" className="mb-2 block text-sm font-semibold text-slate-200">
                  Estado:
                </label>
                <select
                  id="estado"
                  className="field"
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value as CriaturaFormulario["estado"] })}
                >
                  {ESTADOS_INVESTIGACION.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="habilidades" className="mb-2 block text-sm font-semibold text-slate-200">
                Habilidades (separadas por comas):
              </label>
              <input
                id="habilidades"
                className="field"
                type="text"
                value={habilidadesTexto}
                onChange={(e) => setHabilidadesTexto(e.target.value)}
              />
            </div>

            <div className="max-w-xs">
              <label htmlFor="nivelPeligro" className="mb-2 block text-sm font-semibold text-slate-200">
                Nivel de peligro (1-10):
              </label>
              <input
                id="nivelPeligro"
                className="field"
                type="number"
                min={1}
                max={10}
                value={form.nivelPeligro}
                onChange={(e) => setForm({ ...form, nivelPeligro: Number(e.target.value) })}
              />
            </div>

            <div className="border-t border-line pt-6">
              <button type="submit" disabled={guardando} className="primary-button w-full sm:w-auto">
                {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear criatura"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </MarcoPagina>
  );
}
