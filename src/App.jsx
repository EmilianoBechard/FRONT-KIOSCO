import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import "./style.css";
import { AdminLoginProvider } from "./componentsAdmin/context/adminLogin.jsx";
import { AdminAsideNavBarProvider } from "./componentsAdmin/context/adminAsideNavBar.jsx";
import { LoginFormAdmin } from "./componentsAdmin/login/login.jsx";
import { DetallesDePedidos } from "./componentsAdmin/detalleDePedidos/adminDetalleDePedidos.jsx";
import { AsideNavBar } from "./componentsAdmin/aside/adminAsideNavBar.jsx";
import { AdminHeader } from "./componentsAdmin/header/adminHeader.jsx";
import { useState } from "react";
import { Productos } from "./componentsAdmin/productAndEdit/productsAndEdits.jsx";
import { ProductAndEditSlug } from "./componentsAdmin/productAndEdit/editProducto/productsAndEditsSlug.jsx";
import FormProduct from "./componentsAdmin/productAndEdit/formCrearProducto/formCrearProducto.jsx";
import { ProtectedRouteAdmin } from "./componentsAdmin/adminProtectedRoute.jsx";
import { Clientes } from "./componentsAdmin/clientes/adminClientes.jsx";
import { InstagramIcon } from "./assets/iconos.jsx";
import { HistorialPedidos } from "./componentsAdmin/historialDePedidos/adminHistorialPedidos.jsx";
import { Categorias } from "./componentsAdmin/categorias/adminCategorias.jsx";
import { HeaderUser } from "./componentsUsers/header/userHeader.jsx";
import { Home } from "./componentsUsers/home/Home.jsx";
import { UserLoginProvider } from "./componentsUsers/contextUser/userLogin.jsx";
import { LoginFormUser } from "./componentsUsers/login/login.jsx";
import { RegisterFormUser } from "./componentsUsers/register/register.jsx";
import { ProfileUser } from "./componentsUsers/profile/profile.jsx";
import { Toaster } from "react-hot-toast";
import { ProtectedRouteUser } from "./componentsUsers/userProtectedRoute.jsx";
import { CartProvider } from "./componentsUsers/contextUser/userCart.jsx";
import { ProductoSlugUser } from "./componentsUsers/productoSlug/productoSlug.jsx";
import { ProductosUser } from "./componentsUsers/productos/productosUser.jsx";
import { CartUser } from "./componentsUsers/cart/cartUser.jsx";
import EditAccount from "./componentsUsers/profile/editProfile.jsx";
import { Footer } from "./componentsUsers/footer/footer.jsx";
import { lazy, Suspense } from "react";
import { LoadingScreen } from "./componentsAdmin/LoadingScreen.jsx";

const AdminRoutes = lazy(() => import("./AdminRoutes.jsx"));

export function AdminLayout() {
  const [exitAside, setExitAside] = useState(true);
  const location = useLocation();

  return (
    <main className="flex flex-wrap min-h-screen bg-[#1E293B] text-[#F9FAFB] z-[1]">
      <section
        className={`flex flex-col justify-between w-64 bg-[#111827] text-[#F9FAFB] 
    max-2xl:fixed transition-all duration-300 ease-in-out 
    max-2xl:top-0 max-2xl:z-[999] max-2xl:bottom-0 max-2xl:left-0 max-2xl:right-0 max-2xl:h-[100dvh]${
      exitAside
        ? "max-2xl:-translate-x-full max-2xl:opacity-0 max-2xl:invisible"
        : "max-2xl:translate-x-0 max-2xl:opacity-100 max-2xl:visible max-2xl:overflow-y-auto"
    }`}
      >
        <AdminAsideNavBarProvider>
          <AsideNavBar setExitAside={setExitAside} exitAside={exitAside} />
        </AdminAsideNavBarProvider>
        <footer className="flex justify-center">
          <a
            className="flex items-center hover:text-[#3B82F6] px-1 py-2.5 transition-colors duration-300 max-sm:focus:text-[#3B82F6]"
            href="https://www.instagram.com/emiliano.bechard/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hecho por Emiliano Bechard <InstagramIcon />
          </a>
        </footer>
      </section>

      <section className="flex-1 bg-[#1E293B] p-4 xl:w-auto max-xl:w-full">
        <AdminHeader setExitAside={setExitAside} exitAside={exitAside} />
        <Outlet key={location.pathname} />
      </section>
    </main>
  );
}

function UserLayout() {
  return (
    <>
      <CartProvider>
        <HeaderUser />
        <Outlet />
        <Footer />
      </CartProvider>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 700,
        }}
        reverseOrder={false}
      />
      <Routes>
        {/* Rutas de usuario */}
        <Route
          element={
            <UserLoginProvider>
              <UserLayout />
            </UserLoginProvider>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/account/login" element={<LoginFormUser />} />
          <Route path="/account/register" element={<RegisterFormUser />} />
          <Route
            path="/account/profile"
            element={
              <ProtectedRouteUser>
                <ProfileUser />
              </ProtectedRouteUser>
            }
          />
          <Route
            path="/account/edit"
            element={
              <ProtectedRouteUser>
                <EditAccount />
              </ProtectedRouteUser>
            }
          />
          <Route path="/productos/:slug" element={<ProductoSlugUser />} />
          <Route path="/productos" element={<ProductosUser />} />
          <Route path="/cart" element={<CartUser />} />
          {/* Otras rutas de usuario */}
        </Route>

        {/* Rutas de admin */}
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <LoadingScreen text="Cargando panel de administración..." />
              }
            >
              <AdminLoginProvider>
                <AdminRoutes />
              </AdminLoginProvider>
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function AdminRoutess() {
  return (
    <Routes>
      <Route path="login" element={<LoginFormAdmin />} />

      <Route
        path="home/*"
        element={
          <ProtectedRouteAdmin>
            <AdminLayout />
          </ProtectedRouteAdmin>
        }
      >
        <Route path="detalles-pedidos" element={<DetallesDePedidos />} />
        <Route path="historial-pedidos" element={<HistorialPedidos />} />
        <Route path="productos" element={<Productos />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="producto/:slug" element={<ProductAndEditSlug />} />
        <Route path="crear-producto" element={<FormProduct />} />
      </Route>
    </Routes>
  );
}

export default App;
