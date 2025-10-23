export const spanEmailRepeat =
  "block h-4 mt-1 text-red-600 text-base transition duration-150 visible";
export const spanEmailNoRepeat =
  "block h-4 mt-1 text-red-600 text-base transition duration-150 invisible";

export const spanVisible =
  "block h-4 mt-1 text-red-600 text-[0.8rem] transition duration-300 visible";
export const spanNotVisible =
  "block h-4 mt-1 text-red-600 text-[0.8rem] transition duration-300 invisible";

export const initialState = {
  email: "",
  password: "",
  invalidEmail: false,
  invalidPassword: false,
  userNotFound: false,
  genericError: "",
};

export function reducer(state, action) {
  if (action.type === "SET_EMAIL") {
    return { ...state, email: action.payload, invalidEmail: false };
  } else if (action.type === "SET_PASSWORD") {
    return { ...state, password: action.payload, invalidPassword: false };
  } else if (action.type === "SET_INVALID_EMAIL") {
    return { ...state, invalidEmail: action.payload };
  } else if (action.type === "SET_INVALID_PASSWORD") {
    return { ...state, invalidPassword: action.payload };
  } else if (action.type === "SET_USER_NOT_FOUND") {
    return { ...state, userNotFound: action.payload };
  } else if (action.type === "SET_GENERIC_ERROR") {
    return { ...state, genericError: action.payload };
  } else if (action.type === "RESET_FORM") {
    return { ...initialState, genericError: "" };
  } else {
    return state;
  }
}
