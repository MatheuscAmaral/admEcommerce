import { useEffect, useState } from "react";
import { Container } from "../../components/container";

import { Checkbox, Table } from 'flowbite-react';
import { FiPlus } from "react-icons/fi";
import { ToggleSwitch } from 'flowbite-react';

import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { TbLoader3 } from "react-icons/tb";

import api from "../../api";
import Loading from "../../components/loading";
import toast from "react-hot-toast";
import NoResults from "../../components/noResults";

import { ProductProps } from "../products";
import { Button, Modal } from 'flowbite-react';

interface PromocoesProps {
    promocao_id: number | string,
    title_promo: string,
    produto_id: number,
    tipo_desconto: number,
    valor_desconto: number,
    status: number
}


const Promocoes = () => {
    const [promocoes, setPromocoes] = useState<PromocoesProps[]>([]);
    const [load, setLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [switch1, setSwitch1] = useState(true);

    const [title, setTitle] = useState("");
    const [product, setProduct] = useState("1");
    const [products, setProducts] = useState<ProductProps[]>([]);
    const [type, setType] = useState("0");
    const [value, setValue] = useState("0");
    const [id, setId] = useState("0");
    const [update, setUpdate] = useState(false);


    const [openModal, setOpenModal] = useState(false);
    const modalPlacement = ('center')

    useEffect(() => {
        const getPromocoes = async () => {
           try {
                setLoad(true);
                const response = await api.get("/promocoes");

                setPromocoes(response.data);
           }

           catch {
                toast.error("Ocorreu um erro ao buscar as promoções existentes.");
           }

           finally {
                setLoad(false);
                setUpdate(false);
                setEdit(false);
           }
        }

        getPromocoes();
    }, [update])

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-br', {
            style: "currency",
            currency: "BRL"
        })
    }

    const closeModal = () => {
        setOpenModal(false);
        setEdit(false); 
    }

    const openModalWithProducts = async () => {
        setOpenModal(true);

        const response = await api.get("/products");

        setProducts(response.data);
    }

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        
        const data = {
            title_promo: title,
            produto_id: product,
            tipo_desconto: type,
            valor_desconto: value,
            status: switch1 ? 1 : 0
        }
        
        try {
            setLoad(true);

            if(edit) {
                    setEdit(true);
            }

            await (edit ? api.put(`/promocoes/${id}`, data) : api.post("/promocoes", data));

            toast.success(`${title} ${edit ? "editado" : "criado"} com sucesso!`);


            setOpenModal(false);

            setUpdate(true);
        }

        catch(error) {
            toast.error("Ocorreu um erro ao criar a promoção!")
        }   

        finally {
            setLoad(false);
        }
    }

    const deletePromotion = async (promocao: PromocoesProps) => {
        try {
            await api.delete(`/promocoes/${promocao.promocao_id}`);
            
            const promotionIndex = promocoes.findIndex(p => p.promocao_id == promocao.promocao_id);

            if (promotionIndex != -1) {
                promocoes.splice(promotionIndex, 1);
            }

            toast.success(`${promocao.title_promo} deletado com sucesso!`);

            setPromocoes([...promocoes]);
        }

        catch(error) {
            toast.error("Ocorreu um erro ao deletar o produto!");
        }
    }

    const editPromotion = async (promo: PromocoesProps) => {
        openModalWithProducts();
        setEdit(true);
        setLoading(true);

        try {
            const response = await api.get(`/promocoes/${promo.promocao_id}`);
            setProduct(response.data[0].produto_id);
            setTitle(response.data[0].title_promo);
            setType(response.data[0].tipo_desconto);
            setValue(response.data[0].valor_desconto);
            setSwitch1(response.data[0].status == 1 ? true : false);
            setId(response.data[0].promocao_id);
        }

        catch {
            toast.error("Ocorreu um erro ao buscar os dados da promoção!");
        }

        finally {
            setLoading(false);
        }
    }


    return (
        <Container>
            <section className="w-full flex flex-col gap-10">
                <div className="flex w-full justify-between items-center mt-5 ">
                    <h1 className="flex items-center gap-1 text-2xl font-semibold text-gray-600 ">
                        Promoções
                        <span className="text-sm rounded-md border-gray-200">
                            ({(promocoes.length)})
                        </span>
                    </h1>

                    <button onClick={() => openModalWithProducts()} className="flex gap-1 items-center bg-gray-800 text-white p-2 rounded-md text-sm">
                        <FiPlus/>
                        Criar Promoção
                    </button>
                </div>

               {
                load ? (
                    <Loading/>
                ) : (
                    <div className="w-full">
                        {
                            promocoes.length > 0 ? (
                                <div className=" overflow-x-auto">
                                <Table hoverable>
                                    <Table.Head>
                                        <Table.HeadCell className="p-4">
                                            <Checkbox />
                                        </Table.HeadCell>

                                        <Table.HeadCell>Id</Table.HeadCell>

                                        <Table.HeadCell>Título</Table.HeadCell>

                                        <Table.HeadCell>Produto id</Table.HeadCell>

                                        <Table.HeadCell>Tipo desconto</Table.HeadCell>

                                        <Table.HeadCell>Valor desconto</Table.HeadCell>

                                        <Table.HeadCell>Status</Table.HeadCell>

                                        <Table.HeadCell>
                                            <span>Ações</span>
                                        </Table.HeadCell>
                                    </Table.Head>

                                    <Table.Body className="divide-y">                                 
                                        {
                                            promocoes.map(p => {
                                                    return(
                                                    <Table.Row key={p.promocao_id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                        <Table.Cell className="p-4">
                                                            <Checkbox />
                                                        </Table.Cell>

                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            {p.promocao_id}
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            {p.title_promo}
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            {p.produto_id}
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            {
                                                                p.tipo_desconto == 0 ? (
                                                                    <span>Valor</span>
                                                                ) : (
                                                                    <span>Percentual</span>
                                                                )
                                                            }
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            {
                                                                p.tipo_desconto == 0 ? (
                                                                    formatPrice(p.valor_desconto)
                                                                ) : (
                                                                    <span>{p.valor_desconto}%</span>
                                                                )
                                                            }
                                                        </Table.Cell>   

                                                        <Table.Cell>
                                                            {
                                                                p.status == 0 ?(
                                                                    <span className=" bg-yellow-400 px-2 py-1 text-center rounded-full text-xs text-white">Inativo</span>
                                                                ) : (
                                                                    <span className="bg-green-500 px-2 py-1 text-center rounded-full text-xs text-white">Ativo</span>
                                                                )
                                                            }
                                                        </Table.Cell>

                                                        <Table.Cell className="flex gap-2">
                                                            <a onClick={() => editPromotion(p)} className="font-medium text-gray-600 hover:text-blue-600 transition-all cursor-pointer">
                                                                <FaPencilAlt fontSize={18} />                                                           
                                                            </a>

                                                            <a onClick={() => deletePromotion(p)} className="font-medium text-gray-600 hover:text-blue-600 transition-all cursor-pointer">
                                                                <FaTrashAlt fontSize={18} />                                                           
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
                    {
                        !edit ? (
                            <Modal.Header>Criar promoção</Modal.Header>
                        ) : (
                            <Modal.Header>Editar promoção</Modal.Header>
                        )
                    }
                    
                   <form onSubmit={handleSubmit}>
                        <Modal.Body>
                            {
                                loading ? (
                                    <div className="mb-32">
                                        <Loading/>
                                    </div>
                                ) : (
                                    <div className="space-y-6 pb-4">
                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="title_promo">Título: *</label>
                                            {
                                                edit ? (
                                                    <input value={title} type="text" onChange={(e) => setTitle(e.target.value)} required name="title_promo" id="title_promo" className="text-sm rounded-md border-gray-200" placeholder="Digite o nome da promoção..."/>
                                                ): (
                                                    <input type="text" onChange={(e) => setTitle(e.target.value)} required name="title_promo" id="title_promo" className="text-sm rounded-md border-gray-200" placeholder="Digite o nome da promoção..."/>
                                                )
                                            }
                                        </div>

                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="produto">Produto: *</label>
                                            <select name="produto" onChange={(e) => setProduct(e.target.value)} className="text-sm rounded-md border-gray-200" required id="produto" value={product}>
                                                {
                                                    products.map(p => {
                                                        return (
                                                            <option key={p.prod_id} value={p.prod_id}>
                                                                {p.title}
                                                            </option>
                                                        );
                                                    })
                                                }
                                            </select>

                                        </div>

                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="tipo_desconto">Tipo: *</label>

                                            <select value={type} name="tipo_desconto" onChange={(e) => setType(e.target.value)}  className="text-sm rounded-md border-gray-200" required id="tipo_desconto">
                                                <option value="0">Valor</option>
                                                <option value="1">Percentual</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="valor_desconto">Valor: *</label>
                                            {
                                                edit ? (
                                                    <input value={value} type="number" onChange={(e) => setValue(e.target.value)} required name="valor_desconto" id="valor_desconto" className="text-sm rounded-md border-gray-200" placeholder="Digite o valor do desconto..."/>
                                                ): (
                                                    <input type="number" onChange={(e) => setValue(e.target.value)}  required name="valor_desconto" id="valor_desconto" className="text-sm rounded-md border-gray-200" placeholder="Digite o valor do desconto..."/>
                                                )
                                            }
                                            
                                        </div>

                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="status">Status: *</label>
                                            {
                                                <ToggleSwitch color="green" checked={switch1} onChange={() => setSwitch1(switch1 ? false : true)}/>
                                            }
                                        </div>

                                    </div>
                                )
                            }
                        </Modal.Body>

                        <Modal.Footer>
                            <Button type="submit" className={`bg-gray-800 ${load ? " cursor-not-allowed" : "cursor-pointer"}`} disabled={load}>
                                {
                                    !load ? <span>{edit ? "Editar" : "Salvar"}</span> : (
                                        <TbLoader3 fontSize={20} className=" animate-spin"/> 
                                    )
                                }
                            </Button>
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

export default Promocoes;
