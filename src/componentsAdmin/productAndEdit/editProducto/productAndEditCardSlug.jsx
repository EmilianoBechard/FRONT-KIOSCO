import { useReducer, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { url } from "../../../constantsAndFunctions.jsx";
import {
  initialState,
  reducer,
  validateImageFormat,
} from "./editProductoLogicaState.jsx";
import { useNavigate } from "react-router-dom";
import { useCategorias } from "../../categorias/variablesCategorias.js";
import { useState } from "react";

export function CardSlugEditCard({ producto }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { categorias } = useCategorias();

  useEffect(() => {
    if (!producto) return;

    dispatch({
      type: "SET_CAMPO",
      field: "nombre",
      value: producto.nombre || "",
    });
    dispatch({
      type: "SET_CAMPO",
      field: "descripcion",
      value: producto.descripcion || "",
    });
    dispatch({
      type: "SET_CAMPO",
      field: "categoria",
      value: producto.id_categoria || "",
    });
    dispatch({
      type: "SET_CAMPO",
      field: "stock",
      value: producto.stock ?? 0,
    });
    dispatch({
      type: "SET_CAMPO",
      field: "precio",
      value: producto.precio ?? 0,
    });
    dispatch({
      type: "SET_CAMPO",
      field: "destacado",
      value: producto.destacado ?? false,
    });
    dispatch({
      type: "SET_CAMPO",
      field: "carousel",
      value: producto.carousel ?? false,
    });
    dispatch({
      type: "SET_CAMPO",
      field: "activo",
      value: producto.activo ?? false,
    });
    dispatch({
      type: "SET_CAMPO",
      field: "preview",
      value: producto.url || null,
    });
  }, [producto]);

  const mutation = useMutation({
    mutationFn: async (formData) =>
      axios.patch(`${url}/admin/producto/${producto.id_producto}`, formData, {
        withCredentials: true,
      }),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      const updatedProduct = response.data.product;

      dispatch({
        type: "SET_CAMPO",
        field: "nombre",
        value: updatedProduct.nombre,
      });
      dispatch({
        type: "SET_CAMPO",
        field: "descripcion",
        value: updatedProduct.descripcion,
      });
      dispatch({
        type: "SET_CAMPO",
        field: "categoria",
        value: updatedProduct.id_categoria,
      });
      dispatch({
        type: "SET_CAMPO",
        field: "stock",
        value: updatedProduct.stock,
      });
      dispatch({
        type: "SET_CAMPO",
        field: "precio",
        value: updatedProduct.precio,
      });
      dispatch({
        type: "SET_CAMPO",
        field: "destacado",
        value: updatedProduct.destacado,
      });
      dispatch({
        type: "SET_CAMPO",
        field: "carousel",
        value: updatedProduct.carousel,
      });
      dispatch({
        type: "SET_CAMPO",
        field: "activo",
        value: updatedProduct.activo,
      });
      dispatch({
        type: "SET_CAMPO",
        field: "preview",
        value: updatedProduct.url,
      });
      dispatch({ type: "SET_CAMPO", field: "sumarStock", value: 0 });
      dispatch({ type: "SET_CAMPO", field: "restarStock", value: 0 });
      setLoading(false);
      dispatch({ type: "SET_EXITO", value: true });
      setTimeout(() => dispatch({ type: "SET_EXITO", value: false }), 3000);
    },
    onError: (error) => {
      const backendMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error desconocido";
      dispatch({
        type: "SET_ERRORES",
        errores: { ...state.errores, backend: backendMessage },
      });
      setLoading(false);
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file" && files[0]) {
      if (!validateImageFormat(files[0])) {
        dispatch({
          type: "SET_ERRORES",
          errores: { ...state.errores, formatoImagen: true },
        });
        dispatch({ type: "SET_IMAGEN", file: null, preview: null });
        return;
      }

      dispatch({
        type: "SET_IMAGEN",
        file: files[0],
        preview: URL.createObjectURL(files[0]),
      });
      dispatch({
        type: "SET_ERRORES",
        errores: { ...state.errores, formatoImagen: false, imagen: false },
      });
    } else {
      dispatch({
        type: "SET_CAMPO",
        field: name,
        value:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      nombre,
      descripcion,
      categoria,
      stock,
      precio,
      destacado,
      carousel,
      activo,
      sumarStock,
      restarStock,
      imagen,
    } = state;

    const erroresLocal = {
      nombre: nombre.trim() === "",
      descripcion: descripcion.length > 300,
      precio: precio < 1,
      formatoImagen: false,
      backend: "",
    };

    if (!imagen && !state.preview) {
      erroresLocal.imagen = true;
    }
    dispatch({ type: "SET_ERRORES", errores: erroresLocal });
    if (Object.values(erroresLocal).some(Boolean)) return;

    const formData = new FormData();

    if (nombre) formData.append("nombre", nombre);
    if (descripcion) formData.append("descripcion", descripcion);
    if (categoria) formData.append("id_categoria", categoria);
    if (stock != null && stock !== "") formData.append("stock", String(stock));
    if (precio != null && precio !== "")
      formData.append("precio", String(precio));

    formData.append("destacado", destacado ? "true" : "false");
    formData.append("carousel", carousel ? "true" : "false");
    formData.append("activo", activo ? "true" : "false");

    if (sumarStock > 0) formData.append("sumarStock", String(sumarStock));
    if (restarStock > 0) formData.append("restarStock", String(restarStock));

    if (imagen) formData.append("imagen", imagen);

    mutation.mutate(formData);
  };

  const deleteMutation = useMutation({
    mutationFn: async () =>
      axios.delete(`${url}/admin/producto/${producto.id_producto}`, {
        withCredentials: true,
      }),
    onMutate: () => setLoadingDelete(true),
    onSuccess: () => {
      alert("Producto eliminado correctamente");
      setLoading(false);
      navigate("/admin/home/productos");
    },
    onError: (error) => {
      const backendMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error desconocido al borrar";
      dispatch({
        type: "SET_ERRORES",
        errores: { ...state.errores, backend: backendMessage },
      });
      setLoadingDelete(false);
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm("¿Seguro que querés borrar este producto?")) {
      deleteMutation.mutate();
    }
  };

  if (!producto) return <p className="text-[#CBD5E1] text-center">...</p>;

  return (
    <div className="bg-[#1B336E] text-[#F9FAFB] rounded-2xl shadow-lg overflow-hidden p-6 flex max-md:flex-col gap-6">
      <div className="flex-shrink-0 w-48 h-48">
        <img
          src={state.preview}
          alt={producto.nombre}
          className="w-full h-full object-cover rounded-lg border border-[#374151]"
          loading="lazy"
        />
      </div>
      <form
        className="flex-1 flex flex-col gap-4"
        onSubmit={handleSubmit}
        aria-label={`Editar producto ${producto.nombre}`}
      >
        <h2 className="text-2xl font-bold">{producto.nombre}</h2>
        <p className="text-[#CBD5E1]">{producto.descripcion}</p>
        <label className="flex flex-col text-[#CBD5E1]">
          Imagen:
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 w-full p-2 rounded bg-[#111827] text-[#CBD5E1] border border-[#374151] cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3B82F6] file:text-[#F9FAFB] hover:file:bg-[#60A5FA]"
          />
        </label>
        <label className="flex flex-col text-[#CBD5E1]">
          Nombre:
          <input
            type="text"
            name="nombre"
            value={state.nombre}
            onChange={handleChange}
            minLength={1}
            maxLength={50}
            className="mt-1 px-3 py-2 rounded-lg bg-[#1F2937] text-[#F9FAFB] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </label>
        <label className="flex flex-col text-[#CBD5E1]">
          Descripción:
          <textarea
            name="descripcion"
            value={state.descripcion}
            onChange={handleChange}
            maxLength={300}
            rows={3}
            className="mt-1 px-3 py-2 rounded-lg bg-[#1F2937] text-[#F9FAFB] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </label>
        <label className="flex flex-col text-[#CBD5E1]">
          Categoría:
          <select
            name="categoria"
            value={state.categoria}
            onChange={handleChange}
            className="mt-1 bg-[#1E3A8A] text-[#F9FAFB] border border-[#374151] rounded p-2 transition-colors"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option
                key={categoria.id_categoria}
                value={categoria.id_categoria}
              >
                {categoria.categoria}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-[#CBD5E1]">
          Stock:
          <input
            type="number"
            name="stock"
            value={state.stock}
            onChange={handleChange}
            className="mt-1 px-3 py-2 rounded-lg bg-[#1F2937] text-[#F9FAFB] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </label>
        <label className="flex flex-col text-[#CBD5E1]">
          Sumar Stock:
          <input
            type="number"
            name="sumarStock"
            value={state.sumarStock}
            onChange={handleChange}
            className="mt-1 px-3 py-2 rounded-lg bg-[#1F2937] text-[#F9FAFB] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </label>
        <label className="flex flex-col text-[#CBD5E1]">
          Restar Stock:
          <input
            type="number"
            name="restarStock"
            value={state.restarStock}
            onChange={handleChange}
            className="mt-1 px-3 py-2 rounded-lg bg-[#1F2937] text-[#F9FAFB] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </label>
        <label className="flex flex-col text-[#CBD5E1]">
          Precio:
          <input
            type="number"
            step="0.01"
            name="precio"
            value={state.precio}
            onChange={handleChange}
            className="mt-1 px-3 py-2 rounded-lg bg-[#1F2937] text-[#F9FAFB] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </label>
        <div className="flex max-md:flex-wrap max-md:justify-center gap-6 mt-2">
          <label className="flex items-center gap-2 text-[#CBD5E1]">
            <input
              type="checkbox"
              name="destacado"
              checked={state.destacado}
              onChange={handleChange}
              className="w-4 h-4 accent-[#3B82F6]"
            />
            Destacado
          </label>
          <label className="flex items-center gap-2 text-[#CBD5E1]">
            <input
              type="checkbox"
              name="carousel"
              checked={state.carousel}
              onChange={handleChange}
              className="w-4 h-4 accent-[#3B82F6]"
            />
            Carousel
          </label>
          <label className="flex items-center gap-2 text-[#CBD5E1]">
            <input
              type="checkbox"
              name="activo"
              checked={state.activo}
              onChange={handleChange}
              className="w-4 h-4 accent-[#3B82F6]"
            />
            Activo
          </label>
        </div>
        {mutation.isLoading && (
          <span className="text-yellow-400 mb-2 block">
            Guardando cambios...
          </span>
        )}

        {state.exito && !mutation.isLoading && (
          <span className="text-green-500 mb-2 block" role="status">
            Cambios guardados correctamente
          </span>
        )}

        {state.errores.backend && (
          <span className="text-red-500 mb-2 block" role="alert">
            {state.errores.backend}
          </span>
        )}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg mt-4 transition-all duration-300 w-max ${
              loading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB] cursor-pointer"
            }`}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loadingDelete}
            className={`px-4 py-2 rounded-lg mt-4 transition-all duration-300 w-max ${
              loadingDelete
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#991B1B] hover:bg-[#B91C1C] text-[#F9FAFB] cursor-pointer"
            }`}
            aria-label={`Borrar el producto ${producto.nombre}`}
          >
            {loadingDelete ? "Procesando..." : "Borrar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
}
