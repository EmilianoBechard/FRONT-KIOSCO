import { Link, useNavigate } from "react-router-dom";
import {
  CartIcon,
  HamburgerIcon,
  SearchIcon,
  UserIcon,
} from "../../assets/iconos.jsx";
import "../../style.css";
import { useContext } from "react";
import { UserLoginContext } from "../contextUser/userLogin.jsx";
import axios from "axios";
import { url } from "../../constantsAndFunctions.jsx";
import { useCart, useUserCategorias } from "../variablesUser.jsx";
import { useState } from "react";
import { AsideUserHeader } from "./asideUserHeader.jsx";
import { AsideUserCart } from "./asideUserCart.jsx";

export function HeaderUser() {
  const { isUserLoggedIn, setIsUserLoggedIn } = useContext(UserLoginContext);
  const { categorias, isLoading, isError } = useUserCategorias();
  const [asideVisible, setAsideVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || false;
  const { cart } = useCart();
  const totalUnidades = cart.reduce((acc, item) => acc + item.cantidad, 0);

  async function logoutUser() {
    try {
      await axios.post(
        `${url}/usuario/logout`,
        {},
        {
          headers: { "Content-Type": "application/json;charset=utf-8" },
          withCredentials: true,
        }
      );
      localStorage.removeItem("user");
      setIsUserLoggedIn(false);
    } catch (error) {
      alert("No se pudo cerrar sesión. Inténtalo nuevamente.");
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const value = e.target.searchInput.value;
    if (value.trim() !== "") {
      navigate(`/productos?buscar=${value.toLowerCase().trim()}`);
    }
  }
  return (
    <>
      <header className="bg-white shadow-md border-b border-gray-200 px-6 pt-4 pb-2 mb-2 flex flex-col justify-center">
        <div className="flex flex-col md:flex-row items-center justify-evenly gap-4 mb-1">
          <div className="flex items-center max-sm:w-full max-sm:justify-between max-sm:gap-2 lg:w-64">
            <button
              onClick={() => setAsideVisible(!asideVisible)}
              className="sm:hidden cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors"
              aria-label="Abrir menú"
            >
              <HamburgerIcon
                aria-hidden="true"
                className="text-blue-600 hover:text-blue-800"
              />
            </button>
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 hover:text-blue-600"
            >
              Kiosco
            </Link>
            <div className="sm:hidden flex items-center gap-4">
              {isUserLoggedIn ? (
                <>
                  <Link
                    to="/account/profile"
                    className="text-blue-600 font-semibold cursor-pointer"
                    aria-label="Ir al Perfil"
                  >
                    <UserIcon aria-hidden="true" className="text-gray-900" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/account/login"
                    className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    aria-label="Iniciar Sesion"
                  >
                    <UserIcon aria-hidden="true" className="text-gray-900" />
                  </Link>
                </>
              )}
              <button
                onClick={() => setCartVisible(!cartVisible)}
                className="sm:hidden relative text-gray-900 hover:text-blue-600 flex items-center cursor-pointer"
                aria-label="Abrir o cerrar carrito"
              >
                <CartIcon aria-hidden="true" />
                {totalUnidades}
              </button>
              <span aria-live="polite" className="sr-only">
                {totalUnidades} productos en el carrito
              </span>
            </div>
          </div>

          <form
            className="max-sm:hidden flex flex-1 max-w-md w-full items-center bg-gray-50 border border-gray-300 rounded overflow-hidden"
            onSubmit={handleSearchSubmit}
          >
            <label htmlFor="searchInput" className="sr-only">
              Buscar productos
            </label>
            <input
              id="searchInput"
              name="searchInput"
              type="text"
              placeholder="¿Qué estás buscando?"
              className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="px-3 text-gray-700 hover:text-blue-600 cursor-pointer"
            >
              <SearchIcon aria-hidden="true" />
            </button>
          </form>

          <div className="max-sm:hidden flex items-center gap-4">
            <UserIcon aria-hidden="true" className="text-gray-900" />
            <div className="flex flex-col text-gray-900 text-sm">
              {isUserLoggedIn ? (
                <>
                  <Link
                    to="/account/profile"
                    className="text-blue-500 hover:text-blue-800 font-semibold"
                  >
                    ¡Hola {user.nombre}!
                  </Link>
                  <button
                    onClick={() => {
                      logoutUser();
                      navigate("/");
                    }}
                    className="text-purple-500 hover:text-purple-800 cursor-pointer"
                  >
                    Cerrar sesion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/account/login"
                    className="text-blue-500 hover:text-blue-800 font-semibold"
                  >
                    ¡Hola! Iniciá sesión
                  </Link>
                  <Link
                    to="/account/register"
                    className="text-purple-500 hover:text-purple-800"
                  >
                    O registrate si no tenés cuenta
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={() => setCartVisible(!cartVisible)}
              className="max-sm:hidden relative text-gray-900 hover:text-blue-600 cursor-pointer flex items-center"
              aria-label="Abrir o cerrar carrito"
            >
              <CartIcon aria-hidden="true" />
              {totalUnidades}
            </button>
            <span aria-live="polite" className="sr-only">
              {totalUnidades} productos en el carrito
            </span>
          </div>
          <form
            className="sm:hidden flex flex-1 max-w-md w-full items-center bg-gray-50 border border-gray-300 rounded overflow-hidden"
            onSubmit={handleSearchSubmit}
          >
            <label htmlFor="searchInputResponsive" className="sr-only">
              Buscar productos
            </label>
            <input
              name="searchInput"
              id="searchInputResponsive"
              type="text"
              placeholder="¿Qué estás buscando?"
              className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="px-3 text-gray-700 hover:text-blue-600 cursor-pointer"
            >
              <SearchIcon aria-hidden="true" />
            </button>
          </form>
        </div>
        <section className="max-sm:hidden">
          <nav className="h-full">
            <ul className="flex flex-wrap justify-center gap-1 m-0 p-0 list-none">
              <li>
                <Link
                  to="/"
                  className="flex px-4 py-4 font-bold text-gray-900 hover:text-blue-600"
                >
                  INICIO
                </Link>
              </li>
              <li>
                <Link
                  to="/productos"
                  className="flex px-4 py-4 font-bold text-gray-900 hover:text-blue-600"
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
                  <li key={categoria.id_categoria}>
                    <Link
                      to={`/productos?categoria=${categoria.categoria}`}
                      className="flex px-4 py-4 font-bold text-gray-900 hover:text-blue-600 uppercase"
                    >
                      {categoria.categoria}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </section>
      </header>

      <AsideUserHeader
        setAsideVisible={setAsideVisible}
        asideVisible={asideVisible}
        categorias={categorias || []}
        isLoading={isLoading}
        isError={isError}
        isUserLoggedIn={isUserLoggedIn}
        user={user}
        logoutUser={logoutUser}
      />
      <AsideUserCart
        setCartVisible={setCartVisible}
        cartVisible={cartVisible}
      />
    </>
  );
}
