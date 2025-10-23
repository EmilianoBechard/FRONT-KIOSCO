import { useReducer } from "react";
import {
  initialState,
  reducer,
  validateImageFormat,
  useCreateProduct,
  ImagePreview,
} from "./formCrearProductoLogicaState.jsx";
import { useCategorias } from "../../categorias/variablesCategorias.js";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function FormProduct() {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { categorias } = useCategorias();
  const mutation = useCreateProduct(dispatch, () => {
    dispatch({ type: "RESET_FORM" });
    dispatch({ type: "SET_EXITO", value: true });
    setTimeout(() => dispatch({ type: "SET_EXITO", value: false }), 3000);
  });
  if (!categorias || categorias.length === 0) {
    return (
      <div className="min-h-screen bg-[#1F2937] flex flex-col items-center justify-center p-6">
        <div className="bg-[#1E3A8A] p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#F9FAFB] mb-4">
            No se puede crear un producto
          </h2>
          <p className="text-[#CBD5E1] mb-6">
            Debes crear al menos una categoría antes de poder crear un producto.
          </p>
          <Link
            to="/admin/home/categorias"
            className="py-2 px-4 bg-[#3B82F6] text-[#F9FAFB] font-semibold rounded hover:bg-[#60A5FA] transition cursor-pointer"
          >
            Ir a Categorias
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    dispatch({
      type: "CAMBIAR_CAMPO",
      field: name,
      value: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      dispatch({
        type: "SET_ERROR",
        errores: { imagen: true, formatoImagen: false },
      });
      dispatch({ type: "SET_IMAGEN", file: null, preview: null });
      return;
    }

    if (!validateImageFormat(file)) {
      dispatch({
        type: "SET_ERROR",
        errores: { imagen: false, formatoImagen: true },
      });
      dispatch({ type: "SET_IMAGEN", file: null, preview: null });
      return;
    }

    dispatch({
      type: "SET_ERROR",
      errores: { imagen: false, formatoImagen: false },
    });
    dispatch({ type: "SET_IMAGEN", file, preview: URL.createObjectURL(file) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { errores, exito, preview, imagen, ...campos } = state;

    const erroresLocal = {
      nombre: campos.nombre.trim() === "",
      descripcion: campos.descripcion.length > 300,
      precio: campos.precio < 1,
      categoria: !campos.categoria,
      imagen: !imagen,
      formatoImagen: false,
      backend: "",
    };
    dispatch({ type: "SET_ERROR", errores: erroresLocal });

    if (Object.values(erroresLocal).some(Boolean)) return;

    const formData = new FormData();

    Object.entries(campos).forEach(([key, value]) => {
      if (key === "categoria") {
        formData.append("id_categoria", Number(value));
      } else if (["stock", "precio"].includes(key)) {
        formData.append(key, Number(value));
      } else if (["destacado", "carousel", "activo"].includes(key)) {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, value);
      }
    });

    if (imagen) formData.append("imagen", imagen);

    setLoading(true);
    mutation.mutate(formData, {
      onSuccess: () => {
        dispatch({ type: "RESET_FORM" });
        dispatch({ type: "SET_EXITO", value: true });
        setTimeout(() => dispatch({ type: "SET_EXITO", value: false }), 3000);
      },
      onSettled: () => setLoading(false),
    });
  };
  const { errores, preview, exito } = state;

  return (
    <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1E3A8A] p-8 rounded-2xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#F9FAFB] text-center">
          Crear Producto
        </h2>

        <div className="mb-4">
          <label className="block text-[#F9FAFB] mb-2">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={state.nombre}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#111827] text-[#F9FAFB] border border-[#374151]"
          />
          {errores.nombre && (
            <span className="text-red-500 text-sm">Nombre inválido</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-[#F9FAFB] mb-2">Descripción</label>
          <textarea
            name="descripcion"
            value={state.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded bg-[#111827] text-[#F9FAFB] border border-[#374151]"
          />
          {errores.descripcion && (
            <span className="text-red-500 text-sm">Máximo 300 caracteres</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-[#F9FAFB] mb-2">Categoría</label>
          <select
            name="categoria"
            value={state.categoria}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#111827] text-[#F9FAFB] border border-[#374151] transition-colors"
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
          {errores.categoria && (
            <span className="text-red-500 text-sm">
              Debes seleccionar una categoría
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-[#F9FAFB] mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={state.stock}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#111827] text-[#F9FAFB] border border-[#374151]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#F9FAFB] mb-2">Precio</label>
          <input
            type="number"
            name="precio"
            value={state.precio}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#111827] text-[#F9FAFB] border border-[#374151]"
          />
          {errores.precio && (
            <span className="text-red-500 text-sm">Precio mínimo 1</span>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-[#F9FAFB] mb-2">Imagen</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageChange}
            className="w-full p-2 rounded bg-[#111827] text-[#CBD5E1] border border-[#374151] cursor-pointer file:mr-4 file:py-2 file:px-4 
                   file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                   file:bg-[#3B82F6] file:text-[#F9FAFB] hover:file:bg-[#60A5FA]"
          />
          {errores.imagen && (
            <span className="text-red-500 text-sm">
              Debes seleccionar una imagen
            </span>
          )}
          {errores.formatoImagen && (
            <span className="text-red-500 text-sm">
              Formato inválido (PNG, JPG, JPEG, WEBP)
            </span>
          )}
          <ImagePreview preview={preview} />
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <label className="flex items-center space-x-2 text-[#CBD5E1]">
            <input
              type="checkbox"
              name="destacado"
              checked={state.destacado}
              onChange={handleChange}
              className="accent-[#3B82F6]"
            />
            <span>Destacado</span>
          </label>
          <label className="flex items-center space-x-2 text-[#CBD5E1]">
            <input
              type="checkbox"
              name="carousel"
              checked={state.carousel}
              onChange={handleChange}
              className="accent-[#3B82F6]"
            />
            <span>Carousel</span>
          </label>
          <label className="flex items-center space-x-2 text-[#CBD5E1]">
            <input
              type="checkbox"
              name="activo"
              checked={state.activo}
              onChange={handleChange}
              className="accent-[#3B82F6]"
            />
            <span>Activo</span>
          </label>
        </div>

        {mutation.isLoading && (
          <span className="text-yellow-400 mb-2 block" role="alert">
            Creando producto...
          </span>
        )}

        {exito && !mutation.isLoading && (
          <span className="text-green-500 mb-2 block" role="status">
            Producto añadido correctamente
          </span>
        )}

        {errores.backend && (
          <span className="text-red-500 mb-2 block">{errores.backend}</span>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 font-semibold rounded transition ${
            loading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-[#3B82F6] text-[#F9FAFB] hover:bg-[#60A5FA] cursor-pointer"
          }`}
        >
          {loading ? "Creando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}
