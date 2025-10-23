import { useReducer } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { initialState, reducer } from "./variablesRegisterUser.jsx";
import { url } from "../../constantsAndFunctions.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";

function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function RegisterFormUser() {
  const [captchaValue, setCaptchaValue] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !state.nombre ||
      !state.apellido ||
      !state.telefono ||
      !state.email ||
      !state.contraseña
    ) {
      dispatch({
        type: "SET_ERROR",
        payload: "Todos los campos son obligatorios",
      });
      return;
    }
    if (!/^(0?\d{2})?\d{8}$/.test(state.telefono)) {
      dispatch({ type: "SET_ERROR", payload: "Teléfono inválido" });
      return;
    }

    if (!validateEmail(state.email)) {
      dispatch({ type: "SET_ERROR", payload: "Email inválido" });
      return;
    }

    if (state.contraseña.length < 8) {
      dispatch({
        type: "SET_ERROR",
        payload: "La contraseña debe tener al menos 8 caracteres",
      });
      return;
    }

    if (!captchaValue) {
      dispatch({
        type: "SET_ERROR",
        payload: "Debes completar el captcha",
      });
      return;
    }
    dispatch({ type: "SET_LOADING" });

    try {
      const response = await axios.post(`${url}/usuario/registrarse`, {
        nombre: state.nombre,
        apellido: state.apellido,
        telefono: state.telefono,
        email: state.email,
        contraseña: state.contraseña,
        captcha: captchaValue,
      });

      dispatch({ type: "SET_SUCCESS" });

      setTimeout(() => {
        navigate("/account/login");
        dispatch({ type: "RESET_FORM" });
      }, 2000);
    } catch (error) {
      let errorMessage = "Error de conexión";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#F9FAFB] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-[#111827] mb-6 text-center">
          Crear Cuenta
        </h2>

        {state.error && (
          <p
            className="bg-[#FEE2E2] text-[#DC2626] p-2 rounded mb-4 text-center"
            role="alert"
            aria-live="assertive"
          >
            {state.error}
          </p>
        )}
        {state.success && (
          <p
            className="bg-[#16A34A] text-white p-2 rounded mb-4 text-center"
            role="status"
            aria-live="polite"
          >
            Registro exitoso. Redirigiendo...
          </p>
        )}

        <label htmlFor="nombre" className="text-[#6B7280] text-sm">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          value={state.nombre}
          onChange={(e) =>
            dispatch({ type: "SET_NOMBRE", payload: e.target.value })
          }
          className="mt-1 block w-full px-4 py-2 border border-[#E5E7EB] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
          placeholder="Tu nombre"
          required
        />

        <label htmlFor="apellido" className="text-[#6B7280] text-sm">
          Apellido
        </label>
        <input
          id="apellido"
          type="text"
          value={state.apellido}
          onChange={(e) =>
            dispatch({ type: "SET_APELLIDO", payload: e.target.value })
          }
          className="mt-1 block w-full px-4 py-2 border border-[#E5E7EB] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
          placeholder="Tu apellido"
          required
        />
        <label htmlFor="telefono" className="text-[#6B7280] text-sm">
          Telefono
        </label>
        <input
          id="telefono"
          type="text"
          value={state.telefono}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, "");
            dispatch({ type: "SET_TELEFONO", payload: onlyNumbers });
          }}
          className="mt-1 block w-full px-4 py-2 border border-[#E5E7EB] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
          placeholder="Ej: 1158329234"
          required
        />

        <label htmlFor="email" className="text-[#6B7280] text-sm">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={state.email}
          onChange={(e) =>
            dispatch({ type: "SET_EMAIL", payload: e.target.value })
          }
          className="mt-1 block w-full px-4 py-2 border border-[#E5E7EB] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
          placeholder="tucorreo@ejemplo.com"
          required
        />

        <label htmlFor="contraseña" className="text-[#6B7280] text-sm">
          Contraseña
        </label>
        <input
          id="contraseña"
          type="password"
          value={state.contraseña}
          onChange={(e) =>
            dispatch({ type: "SET_CONTRASEÑA", payload: e.target.value })
          }
          className="mt-1 block w-full px-4 py-2 border border-[#E5E7EB] rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] mb-4"
          placeholder="Mínimo 8 caracteres"
          required
        />
        <div className="flex justify-center mb-4">
          <ReCAPTCHA
            sitekey="6Le-DeQrAAAAAJH5BOt1FTWv92AoXjQWX-Hfy5u4"
            onChange={(value) => setCaptchaValue(value)}
          />
        </div>
        <button
          type="submit"
          disabled={state.loading}
          aria-busy={state.loading}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2 px-4 rounded shadow transition-colors cursor-pointer"
        >
          {state.loading ? "Cargando..." : "Crear Cuenta"}
        </button>

        <p className="mt-4 text-center text-[#6B7280] text-sm">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/account/login"
            className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold"
          >
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
