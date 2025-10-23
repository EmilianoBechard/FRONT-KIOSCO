import { useReducer } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { url } from "../../constantsAndFunctions";

const initialState = {
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  contraseñaNueva: "",
  contraseñaActual: "",
  loading: false,
  success: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET_SUCCESS":
      return { ...state, success: action.value };
    case "SET_ERROR":
      return { ...state, error: action.value };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export default function EditAccount() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const mutation = useMutation({
    mutationFn: (data) =>
      axios.patch(`${url}/usuario/edit`, data, { withCredentials: true }),
    onMutate: () => {
      dispatch({ type: "SET_LOADING", value: true });
      dispatch({ type: "SET_ERROR", value: "" });
    },
    onSuccess: (response) => {
      dispatch({ type: "SET_LOADING", value: false });
      dispatch({ type: "SET_SUCCESS", value: true });
      setTimeout(() => dispatch({ type: "SET_SUCCESS", value: false }), 3000);
      const { nombre, apellido, email } = response.data.publicUsuarioEdited;

      localStorage.setItem("user", JSON.stringify({ nombre, apellido, email }));
    },
    onError: (error) => {
      dispatch({ type: "SET_LOADING", value: false });
      dispatch({
        type: "SET_ERROR",
        value:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Error al actualizar usuario",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      const onlyNumbers = value.replace(/\D/g, "");
      dispatch({ type: "SET_FIELD", field: name, value: onlyNumbers });
    } else {
      dispatch({ type: "SET_FIELD", field: name, value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (state.telefono && !/^(0?\d{2})?\d{8}$/.test(state.telefono)) {
      dispatch({ type: "SET_ERROR", value: "Teléfono inválido" });
      return;
    }
    const {
      nombre,
      apellido,
      telefono,
      email,
      contraseñaNueva,
      contraseñaActual,
    } = state;
    const dataToSend = {};
    if (nombre) dataToSend.nombre = nombre;
    if (apellido) dataToSend.apellido = apellido;
    if (telefono) dataToSend.telefono = telefono;
    if (email) dataToSend.email = email;
    if (contraseñaNueva) dataToSend.contraseñaNueva = contraseñaNueva;
    if (contraseñaActual) dataToSend.contraseñaActual = contraseñaActual;

    mutation.mutate(dataToSend);
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md border border-[#E5E7EB]"
      >
        <h2 className="text-2xl font-bold text-[#111827] mb-6 text-center">
          Editar Cuenta
        </h2>

        <div aria-live="polite" role="status" className="mb-4">
          {state.error && (
            <p className="text-[#DC2626] text-center">{state.error}</p>
          )}
          {state.success && (
            <p className="text-[#16A34A] text-center">Usuario actualizado!</p>
          )}
        </div>

        <fieldset className="mb-6">
          <legend className="text-[#111827] font-semibold mb-2">
            Información Personal
          </legend>

          <div className="mb-4">
            <label htmlFor="nombre" className="block text-[#111827] mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={state.nombre}
              onChange={handleChange}
              className="w-full p-2 border border-[#E5E7EB] rounded bg-[#F9FAFB] text-[#111827]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="apellido" className="block text-[#111827] mb-1">
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={state.apellido}
              onChange={handleChange}
              className="w-full p-2 border border-[#E5E7EB] rounded bg-[#F9FAFB] text-[#111827]"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="telefono" className="block text-[#111827] mb-1">
              Telefono
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={state.telefono}
              onChange={handleChange}
              className="w-full p-2 border border-[#E5E7EB] rounded bg-[#F9FAFB] text-[#111827]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-[#111827] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={state.email}
              onChange={handleChange}
              className="w-full p-2 border border-[#E5E7EB] rounded bg-[#F9FAFB] text-[#111827]"
            />
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="text-[#111827] font-semibold mb-2">
            Contraseña
          </legend>

          <div className="mb-4">
            <label
              htmlFor="contraseñaNueva"
              className="block text-[#111827] mb-1"
            >
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="contraseñaNueva"
              name="contraseñaNueva"
              value={state.contraseñaNueva}
              onChange={handleChange}
              className="w-full p-2 border border-[#E5E7EB] rounded bg-[#F9FAFB] text-[#111827]"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="contraseñaActual"
              className="block text-[#111827] mb-1"
            >
              Contraseña Actual
            </label>
            <input
              type="password"
              id="contraseñaActual"
              name="contraseñaActual"
              value={state.contraseñaActual}
              onChange={handleChange}
              className="w-full p-2 border border-[#E5E7EB] rounded bg-[#F9FAFB] text-[#111827]"
            />
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={state.loading}
          className={`w-full py-2 px-4 font-semibold rounded ${
            state.loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          } transition-all duration-300 cursor-pointer`}
        >
          {state.loading ? "Actualizando..." : "Actualizar"}
        </button>
      </form>
    </main>
  );
}
