export const initialState = {
  nombre: "",
  descripcion: "",
  categoria: "",
  stock: 0,
  precio: 0,
  destacado: false,
  carousel: false,
  activo: false,
  sumarStock: 0,
  restarStock: 0,
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
    case "SET_CAMPO":
      return { ...state, [action.field]: action.value };
    case "SET_IMAGEN":
      return { ...state, imagen: action.file, preview: action.preview };
    case "SET_ERRORES":
      return { ...state, errores: action.errores };
    case "SET_EXITO":
      return { ...state, exito: action.value };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export function validateImageFormat(file) {
  const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
  const fileExt = file.name.split(".").pop().toLowerCase();
  return allowedExtensions.includes(fileExt);
}
