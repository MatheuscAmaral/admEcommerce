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

interface FormaProps {
    id: number,
    descricao: string,
    tipo: number, 
    status: number
}

const FormaPagamento = () => {
    const [load, setLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forma, setForma] = useState<FormaProps[]>([]);
    const [update, setUpdate] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const modalPlacement = ('center');
    const [edit, setEdit] = useState(false);
    const [criar, setCriar] = useState(false);

    const [switch1, setSwitch1] = useState(true);


    const [id, setId] = useState<number>();
    const [descricao, setDescricao] = useState("");
    const [tipo, setTipo] = useState("");


    useEffect(() => {     
        const getUsers = async () => {
            setLoad(true);

            try {
                const response = await api.get("/forma");

                setForma(response.data);
            }

            catch {
                toast.error(`Ocorreu um erro ao buscar as formas de pagamento existentes!`);
            }

            finally {
                setLoad(false);
                setUpdate(false);
            }
        }

        getUsers();
    }, [update])

    const handleDelete = async (forma: FormaProps) => {
        try {
            await api.delete(`/forma/${forma.id}`);

            toast.success(`${forma.descricao} deletado com sucesso!`);
            setUpdate(true);
        }

        catch {
            toast.error("Ocorreu um erro ao deletar esta forma de pagamento!");
        }
    }


    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const data = {
            descricao: descricao,
            tipo: tipo,
            status: switch1 ? 1 : 0
        }
        
        try {
            setLoad(true);

            criar ? await api.post(`/forma/`, data) : await api.put(`/forma/${id}`, data);

            toast.success(`${descricao} com sucesso!`);

            setOpenModal(false);
            setUpdate(true);
            setEdit(false);
            setCriar(false);

            setDescricao("");
            setTipo("0");
        }

        catch(error) {
            edit ? toast.error("Ocorreu um erro ao editar os dados da forma de pagamento!") : toast.error("Ocorreu um erro ao criar uma forma de pagamento!");
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

    const editStatusUser = (forma: FormaProps) => {
        setEdit(true);
        seeDetails(forma);
        setId(forma.id);
    }

    const seeDetails = async (forma: FormaProps) => {
       setOpenModal(true);
       setLoading(true);

       try {
            const response = await api.get(`/forma/${forma.id}`);
            
            setDescricao(response.data.descricao);
            setTipo(response.data.tipo);
            setSwitch1(response.data.status == 0 ? false : true);
       }

       catch {
            toast.error("Ocorreu um erro os dados da forma de pagamento!");
       }

       finally {
            setLoading(false);
       }
    }

    const openModalCriar = () => {
        setCriar(true);
        setDescricao("");
        setTipo("1");
        setOpenModal(true);
        setSwitch1(true);
    }
    
    return (
        <Container>
            <section className="w-full flex flex-col gap-10">
                <div className="flex w-full justify-between items-center mt-5 ">
                    <h1 className="flex items-center gap-1 text-2xl font-semibold  text-gray-600 ">
                        Formas de pagamento
                        <span className="text-sm rounded-md border-gray-200">
                            ({(forma ? forma.length : 0)})
                        </span>
                    </h1>


                    <button onClick={() => openModalCriar()} className="flex gap-1 items-center bg-gray-800 text-white p-2 rounded-md text-sm">
                        <FiPlus/>
                        Criar
                    </button>
                </div>

                    {
                load ? (
                    <Loading/>
                ) : (
                    <div className="w-full">
                        {
                          forma &&  forma.length > 0 ? (
                                <div className=" overflow-x-auto">
                                    <Table hoverable>
                                        <Table.Head>
                                            <Table.HeadCell className="u-4">
                                                <Checkbox />
                                            </Table.HeadCell>

                                            <Table.HeadCell>Id</Table.HeadCell>

                                            <Table.HeadCell>Descrição</Table.HeadCell>

                                            <Table.HeadCell>Tipo</Table.HeadCell>

                                            <Table.HeadCell>Status</Table.HeadCell>

                                            <Table.HeadCell>
                                                <span>Ações</span>
                                            </Table.HeadCell>
                                        </Table.Head>

                                        <Table.Body className="divide-y">                                 
                                            {
                                                forma.map(f => {
                                                    return(
                                                        <Table.Row key={f.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                            <Table.Cell className="u-4">
                                                                <Checkbox />
                                                            </Table.Cell>

                                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                {f.id}
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                {f.descricao}
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                {
                                                                    f.tipo == 1 && "1 | Boleto"
                                                                }

                                                                {
                                                                    f.tipo == 2 && "2 | Cartão de crédito"
                                                                }

                                                                {
                                                                    f.tipo == 3 && "3 | Pix"
                                                                }
                                                            </Table.Cell> 

                                                            <Table.Cell>
                                                                {
                                                                    f.status == 0 ?(
                                                                        <span className=" bg-yellow-400 px-2 py-1 text-center rounded-full text-xs text-white">Inativo</span>
                                                                    ) : (
                                                                        <span className="bg-green-500 px-2 py-1 text-center rounded-full text-xs text-white">Ativo</span>
                                                                    )
                                                                }
                                                            </Table.Cell>

                                                            <Table.Cell className="flex gap-2 items-center">
                                                                <a className="font-medium text-gray-900 hover:text-blue-600 transition-all cursor-pointer">
                                                                    <CgDetailsMore onClick={() => seeDetails(f)} fontSize={20} />                                                           
                                                                </a>

                                                                <a className="font-medium text-gray-600 hover:text-blue-600 transition-all cursor-pointer">
                                                                    <FaPencilAlt onClick={() => editStatusUser(f)} fontSize={18} />                                                           
                                                                </a>

                                                                <a className="font-medium text-gray-600 hover:text-blue-600 transition-all cursor-pointer">
                                                                    <FaTrashAlt onClick={() => handleDelete(f)} fontSize={18} />                                                           
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
                            edit &&  "Editar forma de pagamento"
                        } 

                        {
                            !edit && !criar && "Dados da forma de pagamento"
                        }   

                        {
                            criar && "Criar forma de pagamento"
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
                                            <label htmlFor="user">Descrição: </label>
                                            {
                                                <input value={descricao} disabled={!criar && !edit} onChange={(e) => setDescricao(e.target.value)} name="descricao" id="descricao" className={`text-sm rounded-md p-3 ${criar || edit ? "border-2" : ""} ${criar || edit ? "" : "cursor-not-allowed"}`} placeholder="Digite o nome de usuário..."/>
                                            }
                                        </div>
        
                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="tipo">Tipo: </label>
                                            {
                                                edit || criar ? (
                                                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="text-sm p-2.5 rounded-md border-gray-200" required name="tipo" id="tipo">
                                                        <option value="1">Boleto</option>
                                                        <option value="2">Cartão de crédito</option>
                                                        <option value="3">Pix</option>
                                                    </select>
                                                ) : (
                                                    <input value={tipo} disabled={!edit && !criar} name="tipo" id="tipo" className={`text-sm rounded-md p-3 border-1 ${edit ? "" : "cursor-not-allowed"}`}/>
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

export default FormaPagamento;