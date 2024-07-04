import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { TbLoader3 } from "react-icons/tb";
import { FiPlus } from "react-icons/fi";

import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";

import Loading from "../../components/loading";
import NoResults from "../../components/noResults";
import { Checkbox, Table } from 'flowbite-react';
import api from "../../api";
import toast from "react-hot-toast";
import { ToggleSwitch } from 'flowbite-react';

import { Button, Modal } from 'flowbite-react';

interface UserProps {
    id: number,
    user: string,
    nivel: number, 
    status: number
}

const Users = () => {
    const [load, setLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<UserProps[]>([]);
    const [update, setUpdate] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const modalPlacement = ('center');
    const [edit, setEdit] = useState(false);
    const [criar, setCriar] = useState(false);

    const [switch1, setSwitch1] = useState(true);


    const [id, setId] = useState<number>();
    const [user, setUser] = useState("");
    const [nivel, setNivel] = useState("");
    const [password, setPassword] = useState("");


    useEffect(() => {     
        const getUsers = async () => {
            setLoad(true);

            try {
                const response = await api.get("/adm/list");

                setUsers(response.data);
            }

            catch {
                toast.error(`Ocorreu um erro ao buscar os usuários existentes!`);
            }

            finally {
                setLoad(false);
                setUpdate(false);
            }
        }

        getUsers();
    }, [update])

    const handleDelete = async (user: UserProps) => {
        try {
            await api.delete(`/adm/${user.id}`);

            toast.success(`${user.user} deletado com sucesso!`);
            setUpdate(true);
        }

        catch {
            toast.error("Ocorreu um erro ao deletar este usuário!");
        }
    }


    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        let data;
        
        criar ? 
            data = {
                user: user,
                password: password,
                nivel: nivel,
                status: switch1 ? 1 : 0
            }
        :
            data = {
                nivel: nivel,
                status: switch1 ? 1 : 0
            }

        
        try {
            setLoad(true);

            criar ? await api.post(`/adm/`, data) : await api.put(`/adm/${id}`, data);

            toast.success(`${user} com sucesso!`);

            setOpenModal(false);

            setUpdate(true);
            setEdit(false);
            setCriar(false);
            
            setUser("");
            setNivel("0");
            setPassword("");
        }

        catch(error) {
            edit ? toast.error("Ocorreu um erro ao editar os dados do usuário!") : toast.error("Ocorreu um erro ao criar um usuário!");
        }   

        finally {
            setLoad(false);
        }
    }

    const closeModal = () => {
        setOpenModal(false);
        setEdit(false);
        setCriar(false);
    }

    const editStatusUser = (user: UserProps) => {
        setEdit(true);
        seeDetails(user);
        setId(user.id);
    }

    const seeDetails = async (user: UserProps) => {
        setOpenModal(true);
        setLoading(true);

       try {
            const response = await api.get(`/adm/${user.id}`);
            
            setUser(response.data.user);
            setNivel(response.data.nivel);
            setSwitch1(response.data.status == 0 ? false : true);
       }
       
       catch {
            toast.error("Ocorreu um erro ao buscar os dados do usuário!");
       }

       finally {
            setLoading(false);
       }
    }

    const openModalCriar = () => {
        setCriar(true);
        setUser("");
        setNivel("0");
        setPassword("");
        setOpenModal(true);
    }
    
    return (
        <Container>
            <section className="w-full flex flex-col gap-10">
                <div className="flex w-full justify-between items-center mt-5 ">
                    <h1 className="flex items-center gap-1 text-2xl font-semibold  text-gray-600 ">
                        Usuários Adm
                        <span className="text-sm rounded-md border-gray-200">
                            ({(users ? users.length : 0)})
                        </span>
                    </h1>


                    <button onClick={() => openModalCriar()} className="flex gap-1 items-center bg-gray-800 text-white p-2 rounded-md text-sm">
                        <FiPlus/>
                        Criar usuário
                    </button>
                </div>

                    {
                load ? (
                    <Loading/>
                ) : (
                    <div className="w-full">
                        {
                          users &&  users.length > 0 ? (
                                <div className=" overflow-x-auto">
                                    <Table hoverable>
                                        <Table.Head>
                                            <Table.HeadCell className="u-4">
                                                <Checkbox />
                                            </Table.HeadCell>

                                            <Table.HeadCell>Id</Table.HeadCell>

                                            <Table.HeadCell>Usuário</Table.HeadCell>

                                            <Table.HeadCell>Nível</Table.HeadCell>

                                            <Table.HeadCell>Status</Table.HeadCell>

                                            <Table.HeadCell>
                                                <span>Ações</span>
                                            </Table.HeadCell>
                                        </Table.Head>

                                        <Table.Body className="divide-y">                                 
                                            {
                                                users.map(u => {
                                                    return(
                                                        <Table.Row key={u.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                            <Table.Cell className="u-4">
                                                                <Checkbox />
                                                            </Table.Cell>

                                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                {u.id}
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                {u.user}
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                {
                                                                    u.nivel == 0 ? "Administrador" : "Super Administrador"
                                                                }
                                                            </Table.Cell> 

                                                            <Table.Cell>
                                                                {
                                                                    u.status == 0 ?(
                                                                        <span className=" bg-yellow-400 px-2 py-1 text-center rounded-full text-xs text-white">Inativo</span>
                                                                    ) : (
                                                                        <span className="bg-green-500 px-2 py-1 text-center rounded-full text-xs text-white">Ativo</span>
                                                                    )
                                                                }
                                                            </Table.Cell>

                                                            <Table.Cell className="flex gap-2 items-center">
                                                                <a className="font-medium text-gray-900 hover:text-blue-600 transition-all cursor-pointer">
                                                                    <CgDetailsMore onClick={() => seeDetails(u)} fontSize={20} />                                                           
                                                                </a>

                                                                <a className="font-medium text-gray-600 hover:text-blue-600 transition-all cursor-pointer">
                                                                    <FaPencilAlt onClick={() => editStatusUser(u)} fontSize={18} />                                                           
                                                                </a>

                                                                <a className="font-medium text-gray-600 hover:text-blue-600 transition-all cursor-pointer">
                                                                    <FaTrashAlt onClick={() => handleDelete(u)} fontSize={18} />                                                           
                                                                </a>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                        )
                                                    })
                                                }
                                        </Table.Body>
                                    </Table>
                                </div>   
                            ) : (
                                <NoResults/>
                            )
                        }
                    </div>
                )
            }

                <Modal show={openModal} position={modalPlacement} onClose={() => closeModal()}>
                    <Modal.Header>
                    {
                            edit &&  "Editar usuário"
                        } 

                        {
                            !edit && !criar && "Dados do usuário"
                        }   

                        {
                            criar && "Criar usuário"
                        }   
                    </Modal.Header>   
                    
                   <form onSubmit={handleSubmit}>
                        <Modal.Body className="overflow-y-auto mb-5">
                            {
                                loading ? (
                                    <div className="mb-32">
                                        <Loading/>
                                    </div>
                                ) : (
                                    <div className="space-y-6 pb-4" style={{maxHeight: 500}}>
                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="user">Usuário: </label>
                                            {
                                                <input value={user} disabled={!criar} onChange={(e) => setUser(e.target.value)} name="user" id="user" className={`text-sm rounded-md p-3 ${!criar ? "" : "border-2"} ${criar ? "" : "cursor-not-allowed"}`} placeholder="Digite o nome de usuário..."/>
                                            }
                                        </div>
        
                                        <div className={`flex flex-col gap-2 w-full text-sm text-gray-600 ${criar ? "" : "hidden"}`}>
                                            <label htmlFor="password">Senha: </label>
                                            {
                                                <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" id="password" className={`text-sm rounded-md p-3 border-1.5 border-gray-200 `} placeholder="Digite a senha do usuário..."/>
                                            }
                                        </div>
        
                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="nivel">Nível: </label>
                                            {
                                                edit || criar ? (
                                                    <select value={nivel} onChange={(e) => setNivel(e.target.value)} className="text-sm p-2.5 rounded-md border-gray-200" required name="nivel" id="nivel">
                                                        <option value="0">Administrador</option>
                                                        <option value="1">Super Administrador</option>
                                                    </select>
                                                ) : (
                                                    <input value={nivel == "1" ? "Super Admnistrador" : "Admin"} disabled={!edit && !criar} name="nivel" id="nivel" className={`text-sm rounded-md p-3 border-1 ${edit ? "" : "cursor-not-allowed"}`}/>
                                                )
                                            }
                                        </div>
        
        
                                        <div className={`flex flex-col gap-2 w-12 text-sm text-gray-600`}>
                                            <label htmlFor="status">Status: </label>
                                            {
                                                <ToggleSwitch color="green" disabled={!edit && !criar} checked={switch1} onChange={() => setSwitch1(switch1 ? false : true)}/> 
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </Modal.Body>

                        <Modal.Footer>
                            {
                                (edit || criar) && (
                                    <Button type="submit" className={`bg-gray-800 ${load ? " cursor-not-allowed" : "cursor-pointer"}`} disabled={load}>
                                        {
                                            !load ? <span> {edit ? "Editar" : "Salvar"}</span> : (
                                                <TbLoader3 fontSize={20} className=" animate-spin"/> 
                                            )
                                        }
                                    </Button>
                                )
                            }
                            
                            <Button color="gray" onClick={() => closeModal()}>
                                Fechar
                            </Button>
                        </Modal.Footer>
                   </form>
                </Modal>
            </section>
        </Container>
    )
}

export default Users;