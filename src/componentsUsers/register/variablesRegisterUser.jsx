export const initialState = {
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  contraseña: "",
  error: "",
  loading: false,
  succes: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case "SET_NOMBRE":
      return { ...state, nombre: action.payload };
    case "SET_APELLIDO":
      return { ...state, apellido: action.payload };
    case "SET_TELEFONO":
      return { ...state, telefono: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_CONTRASEÑA":
      return { ...state, contraseña: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: true, error: "" };
    case "SET_SUCCESS":
      return { ...state, success: true, loading: false, error: "" };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}
