import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/rwalogo.ico";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { TbLoader3 } from "react-icons/tb";

const Auth = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [load, setLoad] = useState(false);

    const { authUser } = useContext(AuthContext);

    useEffect(() => {
        const verifyStoredUser = () => {
            const storedUser = localStorage.getItem("@userAdmEcommerce");

            if (storedUser != null) {
                const user = JSON.parse(storedUser);
                authUser(user);
                navigate("/");
            }
        }

        verifyStoredUser();
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoad(true);

        const data = {
            user: usuario,
            password: password
        }

        try {        
            const response = await api.post("/adm/login", data);
            authUser([response.data.user]);

            if (response.data.user != null) {
                navigate("/");
            } else {
                toast.error("Usuário ou senha incorretos!")
            }
        }

        catch {
            toast.error("Ocorreu um erro ao buscar os dados do usuário!");
        }

        finally {
            setLoad(false);
        }
    }

    return (
       <main className=" max-w-xl mx-auto flex justify-center my-40">
            <div className="flex flex-col gap-3 items-center shadow rounded-lg px-7 py-10 md:px-10 w-full h-full bg-white mx-5">
                <img src={logo} onClick={() => navigate("/")} className="w-20 cursor-pointer" alt="logo" />

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2 text-sm text-gray-700">
                        <label htmlFor="user">Usuário:</label>
                        <input onChange={(e) => setUsuario(e.target.value)} type="text" id="user" name="password" className="rounded-md border-gray-200 text-sm" placeholder="Digite o seu usuário..." required/>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-gray-700 relative mb-2">
                        <label htmlFor="password">Senha:</label>
                        <input onChange={(e) => setPassword(e.target.value)} type={`${showPassword ? "text" : "password"}`} id="password" name="password" className="rounded-md relative border-gray-200 text-sm" placeholder="Digite sua senha..." required/>
                        {
                           showPassword ? <FaEye fontSize={19} onClick={() => setShowPassword(false)} className="absolute top-9 right-3 pt-1"/> : <FaEyeSlash fontSize={19} onClick={() => setShowPassword(true)} className="absolute top-9 right-3 pt-1"/>
                        }
                    </div>

                    <button type="submit" className={`flex justify-center bg-gray-800 w-full mb-10 text-white py-2 rounded-md ${load ? " cursor-not-allowed" : "cursor-pointer"}`} disabled={load}>
                        {
                            !load ? <span className="text-md font-medium">Entrar</span> : (
                                <TbLoader3 fontSize={23} className=" animate-spin"/> 
                            )
                        }
                    </button>
                </form>
            </div>
       </main>
    )
}

export default Auth;
