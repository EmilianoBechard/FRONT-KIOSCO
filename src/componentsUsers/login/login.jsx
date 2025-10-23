import { useReducer } from "react";
import axios from "axios";
import { initialState, reducer } from "./variablesLoginUser.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserLoginContext } from "../contextUser/userLogin.jsx";
import { url } from "../../constantsAndFunctions.jsx";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function LoginFormUser() {
  const [captchaValue, setCaptchaValue] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setIsUserLoggedIn } = useContext(UserLoginContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING" });

    // Validaciones locales
    if (!state.email || !state.contraseña) {
      dispatch({
        type: "SET_ERROR",
        payload: "Todos los campos son obligatorios",
      });
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
      dispatch({ type: "SET_ERROR", payload: "Debes completar el captcha" });
      return;
    }
    try {
      const response = await axios.post(
        `${url}/usuario/login`,
        {
          email: state.email,
          contraseña: state.contraseña,
          captcha: captchaValue,
        },
        {
          headers: { "Content-Type": "application/json;charset=utf-8" },
          withCredentials: true,
        }
      );

      const { nombre, apellido, email } = response.data.publicUsuarioLogin;
      localStorage.setItem("user", JSON.stringify({ nombre, apellido, email }));

      dispatch({ type: "SET_SUCCESS" });

      setTimeout(() => {
        navigate("/account/profile");
        setIsUserLoggedIn(true);
        dispatch({ type: "RESET_FORM" });
      }, 2000);
    } catch (error) {
      let errorMessage = "Error de conexión";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        dispatch({ type: "SET_GENERIC_ERROR", payload: errorMessage });
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;

        if (errorMessage === "Usuario no encontrado") {
          dispatch({ type: "SET_USER_NOT_FOUND", payload: true });
        } else if (errorMessage === "Contraseña invalida") {
          dispatch({ type: "SET_INVALID_PASSWORD", payload: true });
        } else if (errorMessage.toLowerCase().includes("email")) {
          dispatch({ type: "SET_INVALID_EMAIL", payload: true });
        } else if (
          errorMessage.toLowerCase().includes("contraseña") ||
          errorMessage.toLowerCase().includes("password")
        ) {
          dispatch({ type: "SET_INVALID_PASSWORD", payload: true });
        } else {
          dispatch({ type: "SET_GENERIC_ERROR", payload: errorMessage });
        }
      } else {
        dispatch({ type: "SET_GENERIC_ERROR", payload: errorMessage });
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#F9FAFB] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-[#111827] mb-6 text-center">
          Iniciar Sesión
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
            Inicio de sesion exitoso. Redirigiendo...
          </p>
        )}

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
          {state.loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
        <p className="mt-4 text-center text-[#6B7280] text-sm">
          ¿No tenés cuenta aún?{" "}
          <Link
            to="/account/register"
            className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold"
          >
            Crear cuenta
          </Link>
        </p>
      </form>
    </div>
  );
}
