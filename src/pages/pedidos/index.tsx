import { useEffect, useState } from "react"
import api from "../../api"
import { Container } from "../../components/container"
import { Checkbox, Table } from 'flowbite-react';
import { CgDetailsMore } from "react-icons/cg";
import { Button, Modal } from 'flowbite-react';
import toast from "react-hot-toast";
import Loading from "../../components/loading";
import NoResults from "../../components/noResults";
import moment from 'moment';

interface PedidosProps {
    pedido_id: number,
    total: number, 
    valor_frete: number,
    cep: number,
    cliente_id: number,
	formapag_id: number,
	cidade: string,
	numero: number,
	bairro: string,
	uf: string,
	status: number,
	created_at: string,
}

const Pedidos = () => {
    const [pedidos, setPedidos] = useState<PedidosProps[]>([]);
    const [load, setLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const modalPlacement = ('center');

    const [number, setNumber] = useState("");
    const [total, setTotal] = useState("");
    const [client, setClient] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [discount, setDiscount] = useState("");


    useEffect(() => {
        const getPedidos = async () => {
           try {
            setLoad(true);
            const response = await api.get("/pedidos");  
    
            setPedidos(response.data);
           }

           catch {
            toast.error("Ocorreu um erro ao buscar os pedidos existentes.");
           }

           finally {
            setLoad(false);
           }
        }

        getPedidos();
    }, [])

    const formatPrice = (value: number) => {
        return value.toLocaleString('pt-br', {
            style: "currency",
            currency: "BRL"
        })
    }

    const formatData = (data: string) => {
        const createdAtMoment = moment(data);

       return createdAtMoment.format('DD/MM/YYYY');
    }

    const seeDetails = async (pedido: PedidosProps) => {
        setOpenModal(true);
        setLoading(true);

        try {
            const response = await api.get(`/pedidos/${pedido.pedido_id}`);
            
            setNumber(response.data[0].pedido_id);
            setTotal(response.data[0].total);
            setClient(response.data[0].name);
            setDate(response.data[0].created_at);
            setDiscount(response.data[0].descontos);
            
            if(response.data[0].status == 1) {
                setStatus("Em análise");
            } else if(response.data[0].status == 2) {
                setStatus("Bloqueado");
            } else if(response.data[0].status == 3) {
                setStatus("Cancelado");
            } else if(response.data[0].status == 4) {
                setStatus("Faturado");
            }

            if(response.data[0].formapag_id == 1) {
                setPaymentMethod("Boleto");
            } else if(response.data[0].formapag_id == 2) {
                setPaymentMethod("Cartão de crédito");
            } else if(response.data[0].formapag_id == 3) {
                setPaymentMethod("Pix");
            }
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
            <section className="w-ful xl:pl-0 mt-6">
                <h1 className="flex items-center gap-1 text-2xl mb-5 font-semibold text-gray-600">
                    Pedidos 
                    <span className="text-sm">({
                        pedidos.length
                    })</span>
                </h1>

                {
                    load ? (
                        <Loading/>
                    ) : (
                        <div className="w-full">
                            {
                                pedidos.length > 0 ? (
                                    <div className="overflow-x-auto " style={{maxHeight: 600}}>
                                        <Table hoverable className="overflow-y-auto max-h-22 relative">
                                            <Table.Head className="max-w-7xl w-full sticky top-0">
                                                <Table.HeadCell className="p-4">
                                                    <Checkbox />
                                                </Table.HeadCell>

                                                <Table.HeadCell>Id</Table.HeadCell>

                                                <Table.HeadCell>Total</Table.HeadCell>

                                                <Table.HeadCell>Cliente_id</Table.HeadCell>

                                                <Table.HeadCell>Frete</Table.HeadCell>

                                                <Table.HeadCell>Forma de Pagamento</Table.HeadCell>

                                                <Table.HeadCell>Cep</Table.HeadCell>
                                                
                                                <Table.HeadCell>Data</Table.HeadCell>
                                                
                                                <Table.HeadCell>Status</Table.HeadCell>

                                                <Table.HeadCell>
                                                    <span>Ações</span>
                                                </Table.HeadCell>
                                            </Table.Head>

                                            <Table.Body className="divide-y">                                 
                                                {
                                                    pedidos.map(p => {
                                                            return(
                                                            <Table.Row key={p.pedido_id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                <Table.Cell className="p-4">
                                                                    <Checkbox />
                                                                </Table.Cell>

                                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                    {p.pedido_id}
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    {formatPrice(p.total)}
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    {p.cliente_id}
                                                                </Table.Cell>
                        
                                                                <Table.Cell>
                                                                    {formatPrice(p.valor_frete)}
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    {                                                             
                                                                       p.formapag_id == 1 && "1 | Boleto"
                                                                    }
        
                                                                    {
                                                                       p.formapag_id == 2 && "2 | Cartão de crédito"
                                                                    }
    
                                                                    {
                                                                       p.formapag_id == 3 && "3 | Pix"
                                                                    }
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    {p.cep}
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    {formatData(p.created_at)}
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    {
                                                                        p.status == 1 && (
                                                                            <span className=" bg-yellow-400 px-2 py-1 text-center rounded-full text-xs text-white">Em análise</span>
                                                                        )
                                                                    }

                                                                    {
                                                                        p.status == 2 && (
                                                                            <span className="bg-orange-500 px-2 py-1 text-center rounded-full text-xs text-white">Bloqueado</span>
                                                                        )
                                                                    }

                                                                    {
                                                                        p.status == 3 && (
                                                                            <span className=" bg-red-600 px-2 py-1 text-center rounded-full text-xs text-white">Cancelado</span>
                                                                        )
                                                                    }

                                                                    {
                                                                        p.status == 4 && (
                                                                            <span className="bg-green-500 px-2 py-1 text-center rounded-full text-xs text-white">Faturado</span>
                                                                        )
                                                                    }
                                                                </Table.Cell>                                                         

                                                                <Table.Cell className="flex ">
                                                                    <a onClick={() => seeDetails(p)} className="font-medium text-gray-900 hover:text-blue-600 transition-all cursor-pointer">
                                                                        <CgDetailsMore fontSize={20} />                                                           
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

                <Modal show={openModal} position={modalPlacement} onClose={() => setOpenModal(false)}>
                    <Modal.Header>
                        Dados do pedido
                    </Modal.Header>   

                    <Modal.Body className="overflow-y-auto mb-5">
                        {
                            loading ? (
                                <div className="mb-32">
                                    <Loading/>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-5 pb-4" style={{maxHeight: 500}}>
                                    <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                        <label htmlFor="number">Número: </label>
                                        {
                                            <input value={`#${number}`} disabled  name="number" id="number" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>

                                    <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                        <label htmlFor="name">Cliente: </label>
                                        {
                                            <input value={client} disabled  name="name" id="name" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>

                                    <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                        <label htmlFor="paymentMethod">Forma de pagamento: </label>
                                        {
                                            <input value={paymentMethod} disabled  name="paymentMethod" id="paymentMethod" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>

                                    <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                        <label htmlFor="total">Total: </label>
                                        {
                                            <input value={formatPrice(Number(total))} disabled  name="total" id="total" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>

                                    <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                        <label htmlFor="status">Status: </label>
                                        {
                                            <input value={status} disabled name="status" id="status" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>

                                    <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                        <label htmlFor="date">Data: </label>
                                        {
                                            <input value={formatData(date)} disabled  name="date" id="date" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>

                                    <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                        <label htmlFor="discount">Descontos: </label>
                                        {
                                            <input value={formatPrice(Number(discount))} disabled  name="discount" id="discount" className="text-sm rounded-md p-3 border-1 cursor-not-allowed"/>
                                        }
                                    </div>
                                </div>
                              )
                           }
                        </Modal.Body>

                        <Modal.Footer>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                Fechar
                            </Button>
                        </Modal.Footer>
                </Modal>
            </section>
        </Container>
    )
}

export default Pedidos;