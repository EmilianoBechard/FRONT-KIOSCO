export const initialState = {
  email: "",
  contraseña: "",
  error: "",
  loading: false,
  succes: false,
};

export function reducer(state, action) {
  switch (action.type) {
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
    case "RESET":
      return initialState;
    case "SET_USER_NOT_FOUND":
      return { ...state, error: "Usuario no encontrado", loading: false };
    case "SET_INVALID_PASSWORD":
      return { ...state, error: "Contraseña inválida", loading: false };
    case "SET_INVALID_EMAIL":
      return { ...state, error: "Email inválido", loading: false };
    case "SET_GENERIC_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}
