import { useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../constantsAndFunctions.jsx";
import { AdminLoginContext } from "../context/adminLogin.jsx";
import {
  spanEmailRepeat,
  spanEmailNoRepeat,
  spanVisible,
  spanNotVisible,
} from "./variables.jsx";
import "../../style.css";
import { reducer, initialState } from "./variables.jsx";

export function LoginFormAdmin() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setIsAdminLoggedIn } = useContext(AdminLoginContext);
  const navigate = useNavigate();

  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    dispatch({ type: "SET_INVALID_EMAIL", payload: false });
    dispatch({ type: "SET_INVALID_PASSWORD", payload: false });
    dispatch({ type: "SET_USER_NOT_FOUND", payload: false });
    dispatch({ type: "SET_GENERIC_ERROR", payload: "" });

    if (!validateEmail(state.email)) {
      dispatch({ type: "SET_INVALID_EMAIL", payload: true });
      return;
    }

    if (state.password.length < 8) {
      dispatch({ type: "SET_INVALID_PASSWORD", payload: true });
      return;
    }

    try {
      const response = await axios.post(
        `${url}/admin/login`,
        { email: state.email, contraseña: state.password },
        {
          headers: { "Content-Type": "application/json;charset=utf-8" },
          withCredentials: true,
        }
      );

      const { nombre, apellido, email } = response.data.publicAdminLogin;
      localStorage.setItem(
        "userAdmin",
        JSON.stringify({ nombre, apellido, email })
      );

      setIsAdminLoggedIn(true);
      navigate("/admin/home/detalles-pedidos");
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      let errorMessage = "Error de conexión";

      if (error.response?.data?.error) {
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
  }

  return (
    <div className="flex flex-col justify-center items-center m-0 min-h-dvh bg-[#1F2937] text-[#F9FAFB] font-sans">
      <section className="relative z-[2] bg-[#111827] backdrop-blur-2xl pt-[30px] px-8 pb-14 w-96 flex flex-col items-center justify-center text-center rounded-[40px] shadow-2xl shadow-[#3B82F6] border-2 border-[#374151] max-[382px]:w-full">
        <header>
          <h2 className="font-medium text-2xl mb-8 text-[#3B82F6]">
            Bienvenido a la UI de Administrador
          </h2>
        </header>
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 w-full"
          id="register-form"
        >
          <div className="relative">
            <input
              value={state.email}
              onChange={(e) => {
                const value = e.target.value;
                dispatch({ type: "SET_EMAIL", payload: value });
                dispatch({
                  type: "SET_INVALID_EMAIL",
                  payload: !validateEmail(value),
                });
              }}
              onFocus={() =>
                dispatch({ type: "SET_USER_NOT_FOUND", payload: false })
              }
              className="h-14 font-[inherit] text-[16px] px-4 border-0 rounded-[8px] transition duration-300 w-full pt-2.5 outline-0 bg-[#1F2937] text-inherit [box-shadow:0_0_0_2px_transparent] hover:ring-2 hover:ring-[#9CA3AF] focus:ring-2 focus:ring-[#3B82F6] placeholder-shown:ring-0 not-placeholder-shown:ring-2 not-placeholder-shown:ring-[#3B82F6] peer"
              type="email"
              id="email"
              name="email"
              placeholder=" "
              title="Correo Electronico"
              pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
              required
            />
            <label
              className="absolute top-2/5 left-4 translate-x-0 -translate-y-1/2 origin-left pointer-events-none transition duration-300 peer-placeholder-shown:translate-y-[-15px] peer-placeholder-shown:scale-105 peer-focus:-translate-y-[120%] peer-focus:scale-[0.725] peer-not-placeholder-shown:-translate-y-[120%] peer-not-placeholder-shown:scale-[0.725] text-[#9CA3AF]"
              htmlFor="email"
            >
              Email
            </label>
            <span className={state.invalidEmail ? spanVisible : spanNotVisible}>
              Email inválido
            </span>
          </div>

          <div className="relative">
            <input
              value={state.password}
              onChange={(e) => {
                const value = e.target.value;
                dispatch({ type: "SET_PASSWORD", payload: value });
                dispatch({
                  type: "SET_INVALID_PASSWORD",
                  payload: value.length < 8,
                });
              }}
              onFocus={() =>
                dispatch({ type: "SET_USER_NOT_FOUND", payload: false })
              }
              className="h-14 font-[inherit] text-[16px] px-4 border-0 rounded-[8px] transition duration-300 w-full pt-2.5 outline-0 bg-[#1F2937] text-inherit [box-shadow:0_0_0_2px_transparent] hover:ring-2 hover:ring-[#9CA3AF] focus:ring-2 focus:ring-[#3B82F6] placeholder-shown:ring-0 not-placeholder-shown:ring-2 not-placeholder-shown:ring-[#3B82F6] peer"
              type="password"
              id="password"
              name="password"
              placeholder=" "
              title="Contraseña"
              required
            />
            <label
              className="absolute top-2/5 left-4 translate-x-0 -translate-y-1/2 origin-left pointer-events-none transition duration-300 peer-placeholder-shown:translate-y-[-15px] peer-placeholder-shown:scale-105 peer-focus:-translate-y-[120%] peer-focus:scale-[0.725] peer-not-placeholder-shown:-translate-y-[120%] peer-not-placeholder-shown:scale-[0.725] text-[#9CA3AF]"
              htmlFor="password"
            >
              Contraseña
            </label>
            <span
              className={state.invalidPassword ? spanVisible : spanNotVisible}
            >
              La contraseña debe tener mínimo 8 caracteres
            </span>
          </div>
          {state.genericError && (
            <span className="text-red-500 text-sm">{state.genericError}</span>
          )}

          <input
            className="h-14 font-[inherit] border-0 rounded-[8px] transition-all duration-300 w-full outline-0 relative text-[#F9FAFB] text-[17px] bg-[#3B82F6] cursor-pointer hover:scale-105"
            type="submit"
            value="Ingresar"
          />
          <span
            className={state.userNotFound ? spanEmailRepeat : spanEmailNoRepeat}
          >
            Usuario no encontrado
          </span>
        </form>
      </section>
    </div>
  );
}
