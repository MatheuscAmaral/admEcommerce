import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import Home from "../pages/home";
import Products from "../pages/products";
import Pedidos from "../pages/pedidos";
import Promocoes from "../pages/promocoes";
import Users from "../pages/users";
import Auth from "../pages/auth";
import PrivateRoute from "./PrivateRoute";
import Account from "../pages/account";
import AdmUsers from "../pages/adm/users";
import FormaPagamento from "../pages/forma_pagamento";
import NotFound from "../pages/404";

const router = createBrowserRouter([
    {
        element: <PrivateRoute>
                    <Layout/>
                </PrivateRoute>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/products",
                element: <Products/>
            }, 
            {
                path: "/pedidos",
                element: <Pedidos/>
            }, 
            {
                path: "/promocoes",
                element: <Promocoes/>
            },
            {
                path: "/usuarios",
                element: <Users/>
            },
            {
                path: "/adm/users",
                element: <AdmUsers/>
            },
            {
                path: "/formapagamento",
                element: <FormaPagamento/>
            },
            {
                path: "/conta",
                element: <Account/>
            },
            {
                path: "*",
                element: <NotFound/>
            }
        ]
    }, 
    {
        path: "/login",
        element: <Auth/>
    }
])

export default router;
