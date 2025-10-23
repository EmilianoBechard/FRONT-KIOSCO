import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRouteAdmin } from "./componentsAdmin/adminProtectedRoute.jsx";
import { LoginFormAdmin } from "./componentsAdmin/login/login.jsx";
import { DetallesDePedidos } from "./componentsAdmin/detalleDePedidos/adminDetalleDePedidos.jsx";
import { HistorialPedidos } from "./componentsAdmin/historialDePedidos/adminHistorialPedidos.jsx";
import { Productos } from "./componentsAdmin/productAndEdit/productsAndEdits.jsx";
import { Clientes } from "./componentsAdmin/clientes/adminClientes.jsx";
import { Categorias } from "./componentsAdmin/categorias/adminCategorias.jsx";
import { ProductAndEditSlug } from "./componentsAdmin/productAndEdit/editProducto/productsAndEditsSlug.jsx";
import FormProduct from "./componentsAdmin/productAndEdit/formCrearProducto/formCrearProducto.jsx";
import { AdminLayout } from "./App.jsx";

export default function AdminRoutes() {
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
