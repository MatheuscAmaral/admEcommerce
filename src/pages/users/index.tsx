import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { TbLoader3 } from "react-icons/tb";

import { FaPencilAlt } from "react-icons/fa";
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
    name: string,
    email: string, 
    cpf: number,
    cep: number,
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

    const [switch1, setSwitch1] = useState(true);


    const [id, setId] = useState<number>();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [cep, setCep] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [bairro, setBairro] = useState("");
    const [city, setCity] = useState("");
    const [uf, setUf] = useState("");


    useEffect(() => {     
        const getUsers = async () => {
            setLoad(true);

            try {
                const response = await api.get("/users/list");

                setUsers(response.data.users);
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

    // const handleDelete = async (user: UserProps) => {
    //     try {
    //         await api.delete(`/users/${user.id}`);

    //         toast.success(`${user.name} deletado com sucesso!`);
    //         setUpdate(true);
    //     }

    //     catch {
    //         toast.error("Ocorreu um erro ao deletar este usuário!");
    //     }
    // }


    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        
        const data = {
            status: switch1 ? 1 : 0
        }
        
        try {
            setLoad(true);

            await api.put(`/users/${id}`, data);

            toast.success(`${name} com sucesso!`);

            setOpenModal(false);

            setUpdate(true);
            setEdit(false);
        }

        catch(error) {
            toast.error("Ocorreu um erro ao editar o status do usuário!")
        }   

        finally {
            setLoad(false);
        }
    }

    const closeModal = () => {
        setOpenModal(false);
        setEdit(false);
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
            const response = await api.get(`/users/${user.id}`);
            
            
            setName(response.data[0].name);
            setSwitch1(response.data[0].status == 0 ? false : true);

            if(edit) {
                return;
            }

            setEmail(response.data[0].email);
            setCpf(response.data[0].cpf);
            setCep(response.data[0].cep);
            setStreet(response.data[0].rua);
            setBairro(response.data[0].bairro);
            setNumber(response.data[0].numero);
            setCity(response.data[0].cidade);
            setUf(response.data[0].uf);
        }

        catch {
            toast.error("Ocorreu um erro ao buscar os dados do usuário!");
        }

        finally {
            setLoading(false);
        }
    }

    
    return (
        <Container>
            <section className="w-full flex flex-col gap-10">
                    <h1 className="flex items-center gap-1 text-2xl font-semibold mt-5 text-gray-600 ">
                        Clientes
                        <span className="text-sm rounded-md border-gray-200">
                            ({(users ? users.length : 0)})
                        </span>
                    </h1>

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

                                        <Table.HeadCell>Nome</Table.HeadCell>

                                        <Table.HeadCell>E-mail</Table.HeadCell>

                                        <Table.HeadCell>CPF</Table.HeadCell>

                                        <Table.HeadCell>CEP</Table.HeadCell>

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
                                                            {u.name}
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            {u.email}
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            {u.cpf}
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            {u.cep}
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

                                                            {/* <a className="font-medium text-gray-600 hover:text-blue-600 transition-all cursor-pointer">
                                                                <FaTrashAlt onClick={() => handleDelete(u)} fontSize={18} />                                                           
                                                            </a> */}
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
                            edit ? "Editar status" : "Dados do usuário"
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
                                        <label htmlFor="name">Nome: </label>
                                        {
                                            <input value={name} disabled  name="name" id="name" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>

                                    <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                        <label htmlFor="email">E-mail: </label>
                                        {
                                            <input value={email} disabled  name="email" id="email" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>

                                    <div className={`${edit ? "hidden": "flex flex-col"} gap-2 w-full text-sm text-gray-600`}>
                                        <label htmlFor="cpf">CPF: </label>
                                        {
                                            <input value={cpf} disabled  name="cpf" id="cpf" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>


                                    <div className={`${edit ? "hidden": "flex flex-col"} gap-2 w-full text-sm text-gray-600`}>
                                        <label htmlFor="cep">CEP: </label>
                                        {
                                            <input value={cep} disabled  name="cep" id="cep" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div className={`${edit ? "hidden": "flex flex-col"} gap-2 w-full text-sm text-gray-600`}>
                                            <label htmlFor="rua">Rua: </label>
                                            {
                                                <input value={street} disabled  name="rua" id="rua" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                            }
                                        </div>

                                        <div className={`${edit ? "hidden": "flex flex-col"} gap-2 w-full text-sm text-gray-600`}>
                                            <label htmlFor="number">Número: </label>
                                            {
                                                <input value={number} disabled  name="number" id="number" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                            }
                                        </div>

                                        <div className={`${edit ? "hidden": "flex flex-col"} gap-2 w-full text-sm text-gray-600`}>
                                            <label htmlFor="bairro">Número: </label>
                                            {
                                                <input value={bairro} disabled  name="bairro" id="bairro" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                            }
                                        </div>

                                        <div className={`${edit ? "hidden": "flex flex-col"} gap-2 w-full text-sm text-gray-600`}>
                                            <label htmlFor="city">Número: </label>
                                            {
                                                <input value={city} disabled  name="city" id="city" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                            }
                                        </div>

                                        <div className={`${edit ? "hidden": "flex flex-col"} gap-2 w-full text-sm text-gray-600`}>
                                            <label htmlFor="uf">Número: </label>
                                            {
                                                <input value={uf} disabled  name="uf" id="uf" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                            }
                                        </div>
                                        <div className={`flex flex-col gap-2 ${edit ? "" : "w-full"} text-sm text-gray-600`}>
                                            <label htmlFor="status">Status: </label>
                                            {
                                                <ToggleSwitch disabled={!edit} color="green" checked={switch1} onChange={() => setSwitch1(switch1 ? false : true)}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                           }
                        </Modal.Body>

                        <Modal.Footer>
                            {
                                edit && (
                                    <Button type="submit" className={`bg-gray-800 ${load || loading ? " cursor-not-allowed" : "cursor-pointer"}`} disabled={load || loading}>
                                        {
                                            !load ? <span>Editar</span> : (
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