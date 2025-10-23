import { Link, useNavigate } from "react-router-dom";
import { ExitIcon, UserIcon } from "../../assets/iconos";
import "../../style.css";

export function AsideUserHeader({
  setAsideVisible,
  asideVisible,
  categorias = [],
  isLoading,
  isError,
  isUserLoggedIn,
  user,
  logoutUser,
}) {
  const navigate = useNavigate();
  return (
    <>
      <aside
        className={`${
          asideVisible
            ? "translate-x-0 opacity-100 visible"
            : "-translate-x-full opacity-0 invisible"
        } fixed z-[998] top-0 bottom-0 left-0 right-0 w-full transition-all duration-300 ease-in-out bg-white shadow-lg flex flex-col`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setAsideVisible(!asideVisible)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
            aria-label="Cerrar menú"
          >
            <ExitIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido principal con scroll */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="m-0 p-0 list-none">
            <li className="border-b border-gray-500">
              <Link
                onClick={() => setAsideVisible(!asideVisible)}
                to="/"
                className="flex px-4 py-4 font-bold text-gray-900 hover:text-blue-600 w-full"
              >
                INICIO
              </Link>
            </li>
            <li className="border-b border-gray-500">
              <Link
                onClick={() => setAsideVisible(!asideVisible)}
                to="/productos"
                className="flex px-4 py-4 font-bold text-gray-900 hover:text-blue-600 w-full"
              >
                PRODUCTOS
              </Link>
            </li>

            {isLoading && (
              <li className="px-4 py-4 text-gray-500 italic">
                Cargando categorías...
              </li>
            )}

            {isError && (
              <li className="px-4 py-4 text-red-500 font-semibold">
                Error:{" "}
                {isError.message || "No se pudieron cargar las categorías"}
              </li>
            )}

            {!isLoading &&
              !isError &&
              categorias.map((categoria) => (
                <li
                  key={categoria.id_categoria}
                  className="border-b border-gray-500"
                >
                  <button
                    onClick={() => {
                      setAsideVisible(false);
                      navigate(`/productos?categoria=${categoria.categoria}`);
                    }}
                    className="flex px-4 py-4 font-bold text-gray-900 hover:text-blue-600 uppercase cursor-pointer w-full"
                  >
                    {categoria.categoria}
                  </button>
                </li>
              ))}
          </ul>
        </nav>

        {/* Footer fijo al final */}
        <div className="flex p-4 justify-center gap-3 bg-white">
          <UserIcon className="text-gray-900" />
          {isUserLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                onClick={() => setAsideVisible(!asideVisible)}
                to="/account/profile"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                ¡Hola {user.nombre}!
              </Link>
              <button
                onClick={() => {
                  logoutUser();
                  navigate("/");
                  setAsideVisible(false);
                }}
                className="text-purple-500 hover:text-purple-700 transition-colors cursor-pointer"
              >
                Cerrar sesion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                onClick={() => setAsideVisible(!asideVisible)}
                to="/account/login"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                Iniciar sesión
              </Link>
              {" / "}
              <Link
                onClick={() => setAsideVisible(!asideVisible)}
                to="/account/register"
                className="text-purple-500 hover:text-purple-800 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
