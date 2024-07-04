import { useState, useEffect } from "react";

import { Checkbox, Table, Modal, Button } from 'flowbite-react';

import toast from "react-hot-toast";
import { ToggleSwitch } from 'flowbite-react';

import { FiPlus } from "react-icons/fi";
import { FaPencilAlt } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { TbLoader3 } from "react-icons/tb";
import { FaImages } from "react-icons/fa6";

import api from "../../api";
import { Container } from "../../components/container";
import Loading from "../../components/loading";
import NoResults from "../../components/noResults";


export interface ProductProps {
    [x: string]: any;
    prod_id: number
    image: string;
    title: string;
    title_promo: string,
    price: number;
    size: number;
    category: number;
    type_pack: number;
    flavor: number,
    stock: number;
    prod_status: number;
    promocao_id: number;
}

const Products = () => {
    const [openModal, setOpenModal] = useState(false);
    const modalPlacement = ('center');
    const [load, setLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [details, setDetails] = useState(false);
    const [switch1, setSwitch1] = useState(true);

    const [products, setProducts] = useState<ProductProps[]>([]);

    useEffect(() => {
        
        const getProducts = async () => {
            try {
                setLoad(true);
                const response = await api.get("/products");
            
                setProducts(response.data);
            }

            catch {
                toast.error("Ocorreu um erro ao buscar os produtos existentes!");
            }

            finally {
                setLoad(false);
            }
        }

        getProducts();

    }, [])


    const [image, setImage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("0");
    const [size, setSize] = useState("0");
    const [flavor, setFlavor] = useState("0");
    const [typePack, setTypePack] = useState("0");
    const [stock, setStock] = useState("0");
    const [id, setId] = useState();


    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setLoad(true);

        let data = {
            image: file,
            title: title,
            price: price,
            size: size,
            category: category,
            type_pack: typePack,
            flavor: flavor,
            stock: stock,
            status: switch1 ? 1 : 0,
        }

        try {
            if (edit) {
                if (file) {
                    data.image = file;
                    await api.put(`/products/${id}`, data, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                } else {
                    await api.put(`/products/${id}`, data)
                }
                
                toast.success(`Produto editado com sucesso!`);
            } else {
                await api.post("/products", data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                
                toast.success(`${title} criado com sucesso!`);
            }

            const updatedProducts = await api.get("products");

            setProducts(updatedProducts.data);

            setFile(null);
            setOpenModal(false);
            setEdit(false);
            setSwitch1(true);
            setImage("");
        } catch (error) {
            if(edit) {
                toast.error("Ocorreu um erro ao editar o produto!");
                return;
            }

            toast.error("Ocorreu um erro ao criar o produto!")
        }

        finally {
            setLoad(false);
        }
    };

    const seeDetails = async (product: ProductProps) => {
        setOpenModal(true);
        setLoading(true);
        setDetails(true);

       try {
            const response = await api.get(`/products/${product.prod_id}`);

            setId(response.data[0].prod_id);
            setImage(response.data[0].image);
            setTitle(response.data[0].title);
            setPrice(response.data[0].price);
            setSize(response.data[0].size);
            setFlavor(response.data[0].flavor);
            setCategory(response.data[0].category);
            setTypePack(response.data[0].type_pack);
            setStock(response.data[0].stock);
            setSwitch1(response.data[0].prod_status == 0 ? false : true);
       }

       catch {
            toast.error("Ocorreu um erro ao buscar os dados do produto!");
       }

       finally {
            setLoading(false);
       }
    }


    // const deleteProduct = async (p: ProductProps) => {
    //     try {
    //         const verifyProduct = products.findIndex(prod => prod.prod_id == p.prod_id);
            
    //         if(verifyProduct != -1) {
    //             products.splice(verifyProduct, 1);
    //             await api.delete(`/products/${p.prod_id}`);
    //             setProducts([...products]);
    //         }

    //         toast.success(`${p.title} deletado com sucesso!`);
    //     }

    //     catch {
    //         toast.error('Ocorreu um erro ao deletar o produto!');
    //     }
    // }

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-br', {
            style: "currency",
            currency: "BRL"
        })
    }

    const closeModal = () => {
        setOpenModal(false);
        setFile(null);
        setEdit(false);
        setImage("");
        setSwitch1(true);
        setDetails(false);
    }

    const editProduct = async (product: ProductProps) => {
        setEdit(true);
        setLoading(true);
        setOpenModal(true);

        console.log(file)

       try {
            const response = await api.get(`/products/${product.prod_id}`);

            setId(response.data[0].prod_id);
            setImage(response.data[0].image);
            setTitle(response.data[0].title);
            setPrice(response.data[0].price);
            setSize(response.data[0].size);
            setFlavor(response.data[0].flavor);
            setCategory(response.data[0].category);
            setTypePack(response.data[0].type_pack);
            setStock(response.data[0].stock);
            setSwitch1(response.data[0].prod_status == 0 ? false : true);
       }

       catch {
            toast.error("Ocorreu um erro ao buscar os dados do produto!");
       }

       finally {
            setLoading(false);
       }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
    
        if (files && files.length > 0) {
            const selectedFile = files[0];
    
            try {
                setFile(selectedFile);
                const urlImage = URL.createObjectURL(selectedFile);
    
                console.log(file)
                setImage(urlImage);
            } catch {
                toast.error("Ocorreu um erro ao carregar a imagem!");
            }
        }
    };
    

    return (
        <Container>
            <div className="flex w-full justify-between items-center mt-5 ">
                <h1 className="flex items-center gap-1 text-2xl font-semibold text-gray-600 ">
                    Produtos
                    <span className="text-sm rounded-md border-gray-200">
                        ({(products.length)})
                    </span>
                </h1>

                <button onClick={() => setOpenModal(true)} className="flex gap-1 items-center bg-gray-800 text-white p-2 rounded-md text-sm">
                    <FiPlus/>
                    Criar produto
                </button>
            </div>

            <div className="w-full mt-12 mx-auto mb-10 md:mb-0 select-none">
                {
                    load ? (
                       <Loading/>
                    ) : (
                        products.length > 0 ? (
                            <div className="overflow-x-auto" style={{maxHeight: 600}}>
                                <Table hoverable className="overflow-y-auto max-h-22 relative">
                                    <Table.Head className="max-w-7xl w-full sticky top-0">
                                        <Table.HeadCell className="p-4">
                                            <Checkbox />
                                        </Table.HeadCell>
    
                                        <Table.HeadCell>Id</Table.HeadCell>

                                        <Table.HeadCell>Foto</Table.HeadCell>
    
                                        <Table.HeadCell>Nome</Table.HeadCell>
    
                                        <Table.HeadCell>Preço</Table.HeadCell>
    
                                        <Table.HeadCell>Categoria</Table.HeadCell>
    
                                        <Table.HeadCell>Sabor</Table.HeadCell>
    
                                        <Table.HeadCell>Tamanho</Table.HeadCell>
    
                                        <Table.HeadCell>Estoque</Table.HeadCell>
    
                                        <Table.HeadCell>Tipo de embalagem</Table.HeadCell>
    
                                        <Table.HeadCell>Status</Table.HeadCell>
    
                                        <Table.HeadCell>
                                            <span>Ações</span>
                                        </Table.HeadCell>
                                    </Table.Head>
    
                                    <Table.Body className="divide-y">                                 
                                        {
                                            products.map(p => {
                                                    return(
                                                    <Table.Row key={p.prod_id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                        <Table.Cell className="p-4">
                                                            <Checkbox />
                                                        </Table.Cell>
    
                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            {p.prod_id}
                                                        </Table.Cell>
    
                                                        <Table.Cell>
                                                            <img src={p.image} width={40} alt="" />
                                                        </Table.Cell>

                                                        <Table.Cell>{p.title}</Table.Cell>
                
                                                        <Table.Cell>
                                                            {formatPrice(p.price)}
                                                        </Table.Cell>
                
                                                        <Table.Cell>
                                                            {
                                                                p.category == 0 && (
                                                                    <p>Proteínas</p>
                                                                )
                                                            }
    
                                                            {
                                                                p.category == 1 && (
                                                                    <p>Creatina</p>
                                                                )
                                                            }
    
                                                            {
                                                                p.category == 2 && (
                                                                    <p>Outros</p>
                                                                )
                                                            }
                                                        </Table.Cell>
    
                                                        <Table.Cell>
                                                            { 
                                                                p.flavor == 0 && (
                                                                    <p>Sem sabor</p>
                                                                )
                                                            }
    
                                                            { 
                                                                p.flavor == 1 && (
                                                                    <p>Chocolate</p>
                                                                )
                                                            }
    
                                                            { 
                                                                p.flavor == 2 && (
                                                                    <p>Morango</p>
                                                                )
                                                            }
    
                                                            {
                                                                p.flavor == 3 && (
                                                                    <p>Baunilha</p>
                                                                )
                                                            }
                                                        </Table.Cell>
    
                                                        <Table.Cell>
                                                            {
                                                                p.size <= 3 ? (
                                                                    <span>{p.size}kg</span>
                                                                ) : (
                                                                    <span>{p.size}g</span>
                                                                )
                                                            }
                                                        </Table.Cell>
    
                                                        <Table.Cell>{p.stock}</Table.Cell>
    
                                                        <Table.Cell>
                                                            {
                                                                p.type_pack == 0 && (
                                                                    <p>Pote</p>
                                                                )
                                                            }
    
                                                            {
                                                                p.type_pack == 1 && (
                                                                    <p>Caixa</p>
                                                                )
                                                            }
    
                                                            {
                                                                p.type_pack == 2 && (
                                                                    <p>Pacote</p>
                                                                )
                                                            }
                                                        </Table.Cell>
    
                                                        <Table.Cell>
                                                            {
                                                                p.prod_status == 0 ?(
                                                                    <span className=" bg-yellow-400 px-2 py-1 text-center rounded-full text-xs text-white">Inativo</span>
                                                                ) : (
                                                                    <span className="bg-green-500 px-2 py-1 text-center rounded-full text-xs text-white">Ativo</span>
                                                                )
                                                            }
                                                        </Table.Cell>
    
                                                        <Table.Cell className="flex gap-3 mt-2">
                                                            <a className="font-medium text-gray-900 hover:text-blue-600 transition-all cursor-pointer">
                                                                <CgDetailsMore onClick={() => seeDetails(p)} fontSize={20} />                                                           
                                                            </a>


                                                            <a href="#" className="font-medium text-gray-600 hover:text-blue-600 transition-all">
                                                                <FaPencilAlt onClick={() => editProduct(p)} fontSize={18} />                                                           
                                                            </a>
    
                                                            {/* <a href="#" className="font-medium text-gray-600 hover:text-blue-600 transition-all">
                                                                <FaTrashCan onClick={() => deleteProduct(p)} fontSize={18}/>                                                        
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
                    )
                }
            </div>

            <Modal show={openModal} position={modalPlacement} onClose={() => closeModal()}>
                    {
                        edit && <Modal.Header>Editar Produto</Modal.Header>
                    }

                    {
                        !edit && !details && <Modal.Header>Criar Produto</Modal.Header>
                    }

                    {
                        details && <Modal.Header>Detalhes do Produto</Modal.Header>
                    }
                    
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Modal.Body>
                            {
                                loading ? (
                                    <div className="mb-32">
                                        <Loading/>
                                    </div>
                                ) : (
                                    <div className="space-y-6 py-2 relative" style={{maxHeight: 600}}>
                                        <h1>Carregar imagem</h1>

                                        <div className="outline-dashed outline-2 outline-gray-400 p-10 mt-5 mb-2 rounded-md flex flex-col gap-3 justify-center items-center relative">
                                            {
                                                image != "" ? (
                                                    <img src={image} width={150} alt="imagem_do_produto" />
                                                ) : (
                                                    <div className={`flex flex-col gap-3 items-center`}>
                                                        <FaImages  fontSize={45} className=" text-gray-600"/>

                                                        <div className="text-center">
                                                            <p className="text-sm">Arraste sua imagem aqui, ou procure...</p>
                                                            <span className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>

                                        <input onChange={handleChange} type="file" accept="image/*" name="image" id="image" className={`absolute top-10 left-0 right-0 ${!image && !file ? "py-16" : "py-24"} opacity-0 cursor-pointer`}/>

                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="title">Nome: *</label>
                                            {
                                                edit || details ? (
                                                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" required name="title" id="title" className="text-sm rounded-md border-gray-200" placeholder="Digite o nome do produto..."/>
                                                )
                                                : (
                                                    <input onChange={(e) => setTitle(e.target.value)} type="text" required name="title" id="title" className="text-sm rounded-md border-gray-200" placeholder="Digite o nome do produto..."/>
                                                )
                                            }
                                        </div>


                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="price">Preço: *</label>
                                            {
                                                edit || details ? (
                                                    <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" required name="price" id="price" className="text-sm rounded-md border-gray-200" placeholder="Digite o preço do produto..."/>
                                                ) : (
                                                    <input onChange={(e) => setPrice(e.target.value)} type="number" required name="price" id="price" className="text-sm rounded-md border-gray-200" placeholder="Digite o preço do produto..."/>
                                                )
                                            }

                                        </div>

                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="size">Tamanho: *</label>
                                            {
                                                edit || details ? (
                                                    <input value={size} onChange={(e) => setSize(e.target.value)} type="number" required name="size" id="size" className="text-sm rounded-md border-gray-200" placeholder="Digite o tamanho do produto, 1kg, 300g e..."/>
                                                ) : (
                                                    <input onChange={(e) => setSize(e.target.value)} type="number" required name="size" id="size" className="text-sm rounded-md border-gray-200" placeholder="Digite o tamanho do produto, 1kg, 300g e..."/>
                                                )
                                            }
                                        </div>

                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="flavor">Sabor: *</label>
                                            {
                                                edit || details ? (
                                                    <select name="flavor" value={flavor} onChange={(e) => setFlavor(e.target.value)} className="text-sm rounded-md border-gray-200" required id="flavor">
                                                        <option value="0">Sem sabor</option>
                                                        <option value="1">Chocolate</option>
                                                        <option value="2">Morango</option>
                                                        <option value="3">Baunilha</option>
                                                    </select>
                                                ) : (
                                                    <select name="flavor" onChange={(e) => setFlavor(e.target.value)} className="text-sm rounded-md border-gray-200" required id="flavor">
                                                        <option value="0">Sem sabor</option>
                                                        <option value="1">Chocolate</option>
                                                        <option value="2">Morango</option>
                                                        <option value="3">Baunilha</option>
                                                    </select>
                                                )
                                            }
                                        </div>

                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="category">Categoria: *</label>
                                            {
                                                edit || details ? (
                                                    <select value={category} name="category" onChange={(e) => setCategory(e.target.value)} className="text-sm rounded-md border-gray-200" required id="category">
                                                        <option value="0">Proteínas</option>
                                                        <option value="1">Creatina</option>
                                                        <option value="2">Outros</option>
                                                    </select>
                                                ) : (
                                                    <select name="category" onChange={(e) => setCategory(e.target.value)} className="text-sm rounded-md border-gray-200" required id="category">
                                                        <option value="0">Proteínas</option>
                                                        <option value="1">Creatina</option>
                                                        <option value="2">Outros</option>
                                                    </select>
                                                )
                                            }
                                        </div>

                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="type_pack">Tipo de embalagem: *</label>
                                            {
                                                edit || details ? (
                                                    <select value={typePack} name="type_pack" onChange={(e) => setTypePack(e.target.value)} className="text-sm rounded-md border-gray-200" required id="type_pack">
                                                        <option value="0">Pote</option>
                                                        <option value="1">Caixa</option>
                                                        <option value="2">Pacote</option>
                                                    </select>
                                                ) : (
                                                    <select name="type_pack" onChange={(e) => setTypePack(e.target.value)} className="text-sm rounded-md border-gray-200" required id="type_pack">
                                                        <option value="0">Pote</option>
                                                        <option value="1">Caixa</option>
                                                        <option value="2">Pacote</option>
                                                    </select>
                                                )
                                            }
                                        </div>

                                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                                            <label htmlFor="stock">Estoque: *</label>
                                            {
                                                edit || details ? (
                                                    <input value={stock} type="number" onChange={(e) => setStock(e.target.value)} className="text-sm rounded-md border-gray-200" id="stock" name="stock" placeholder="Digite a quantidade de estoque do produto..."/>
                                                ) : (
                                                    <input type="number" onChange={(e) => setStock(e.target.value)} className="text-sm rounded-md border-gray-200" id="stock" name="stock" placeholder="Digite a quantidade de estoque do produto..."/>
                                                )
                                            }
                                        </div>

                                        <div className="flex flex-col gap-2 w-16 text-sm text-gray-600 pb-10  ">
                                            <label htmlFor="status">Status: *</label>
                                            {
                                                <ToggleSwitch className="w-12" color="green" checked={switch1} onChange={() => setSwitch1(switch1 ? false : true)}/>
                                            }
                                        </div>

                                    </div>
                                )
                            }
                            </Modal.Body>

                            <Modal.Footer>
                                {
                                    edit && (
                                        <Button type="submit" className={`bg-gray-800 ${load || loading  ? " cursor-not-allowed" : "cursor-pointer"}`} disabled={load || loading}>
                                            {
                                                !load ? <span>Editar</span> : (
                                                    <TbLoader3 fontSize={20} className=" animate-spin"/> 
                                                )
                                            }
                                        </Button>
                                    )           
                                } 

                                {
                                   !details && !edit && (
                                        <Button type="submit" className={`bg-gray-800 ${load ? " cursor-not-allowed" : "cursor-pointer"}`} disabled={load}>
                                            {
                                                !load ? <span>Salvar</span> : (
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
        </Container>
    )
}

export default Products;
