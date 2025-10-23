import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "../../../style.css";
import { url } from "../../../constantsAndFunctions";

export const initialState = {
  nombre: "",
  descripcion: "",
  categoria: "",
  stock: 0,
  precio: 0,
  destacado: false,
  carousel: false,
  activo: false,
  imagen: null,
  preview: null,
  errores: {
    nombre: false,
    descripcion: false,
    precio: false,
    imagen: false,
    formatoImagen: false,
    backend: "",
  },
  exito: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case "CAMBIAR_CAMPO":
      return { ...state, [action.field]: action.value };
    case "SET_IMAGEN":
      return { ...state, imagen: action.file, preview: action.preview };
    case "SET_ERROR":
      return { ...state, errores: { ...state.errores, ...action.errores } };
    case "RESET_FORM":
      return initialState;
    case "SET_EXITO":
      return { ...state, exito: action.value };
    default:
      return state;
  }
}

export const validateImageFormat = (file) => {
  const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
  const fileExt = file.name.split(".").pop().toLowerCase();
  return allowedExtensions.includes(fileExt);
};

export const useCreateProduct = (dispatch, onSuccessCallback) => {
  return useMutation({
    mutationFn: (formData) =>
      axios.post(`${url}/admin/producto`, formData, {
        withCredentials: true,
      }),
    onSuccess: onSuccessCallback,
    onError: (error) => {
      dispatch({
        type: "SET_ERROR",
        errores: {
          backend: error.response?.data?.message || "Error en el servidor",
        },
      });
    },
  });
};

export function ImagePreview({ preview }) {
  if (!preview) return null;
  return (
    <div className="mt-4">
      <p className="text-[#CBD5E1] mb-2">Previsualización:</p>
      <img
        src={preview}
        alt="Previsualización"
        className="max-h-48 rounded-lg border border-[#374151] shadow-md object-contain"
        loading="lazy"
      />
    </div>
  );
}
