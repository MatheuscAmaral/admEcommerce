import { Sidebar } from 'flowbite-react';
import logo from "../../assets/rwalogo.ico";

import { PiUserCircleGearFill } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { HiShoppingBag } from 'react-icons/hi';
import { MdSpaceDashboard, MdOutlineDisplaySettings } from "react-icons/md";
import { PiContactlessPaymentFill } from "react-icons/pi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbDiscountCheckFilled } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { IoIosSettings } from "react-icons/io";
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { LuLogOut, LuUser } from 'react-icons/lu';


const Aside = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <Sidebar className=' w-20 xl:w-full py-2 relative'>
        <Sidebar.Items className='w-full pt-5
        '>
            <Sidebar.ItemGroup>
                <Sidebar.Logo href="#" onClick={() => navigate("/")} img={logo} className='w-10 px-0 ml-4 xl:ml-0 xl:pl-2 ' imgAlt="Rwa logo">
                    <p className='hidden xl:block text-sm font-bold text-gray-600 '> Rwa Suplementos</p>
                </Sidebar.Logo>
                
                <div className=' flex px-2 w-20 xl:w-full xl:px-0 pl-0justify-center cursor-pointer'>
                    <Sidebar.Item onClick={() => navigate("/")} icon={MdSpaceDashboard}>
                        <span className='hidden xl:block'>
                            Dashboard
                        </span>
                    </Sidebar.Item>
                </div>

                <div className='flex px-2 w-20 justify-center xl:hidden cursor-pointer'>
                    <Sidebar.Item onClick={() => navigate("/products")} icon={HiShoppingBag}>

                    </Sidebar.Item>
                </div>

                <div className='flex px-2 w-20 justify-center xl:hidden cursor-pointer'>
                    <Sidebar.Item onClick={() => navigate("/pedidos")} icon={FaMoneyBillTransfer}>

                    </Sidebar.Item>
                </div>

                <div className='flex px-2 w-20 justify-center xl:hidden cursor-pointer'>
                    <Sidebar.Item onClick={() => navigate("/promocoes")} icon={TbDiscountCheckFilled}>

                    </Sidebar.Item>
                </div>


                <div className='flex px-2 w-20 justify-center xl:justify-start xl:w-full xl:px-0 cursor-pointer'>
                    <Sidebar.Item onClick={() => navigate("/usuarios")} icon={FaUsers}>
                        <span className='hidden xl:block'>
                            Clientes
                        </span>
                    </Sidebar.Item>
                </div>

                <div className='flex px-2 w-20 justify-center xl:hidden cursor-pointer'>
                    <Sidebar.Item onClick={() => navigate("/formapagamento")}  icon={PiContactlessPaymentFill}>

                    </Sidebar.Item>
                </div>

                <div className='hidden xl:flex'>
                    <Sidebar.Collapse icon={MdOutlineDisplaySettings} label='Parâmetros'>
                        <Sidebar.Item>
                            <span onClick={() => navigate("/formapagamento")} className='hidden xl:block'>
                                Formas de pagamento
                            </span>
                        </Sidebar.Item>
                    </Sidebar.Collapse>
                </div>

                <div className='hidden xl:flex'>
                    <Sidebar.Collapse icon={HiShoppingBag} label='E-commerce'>
                        <Sidebar.Item>
                            <span onClick={() => navigate("/products")} className='hidden xl:block'>
                                Produtos
                            </span>
                        </Sidebar.Item>

                        <Sidebar.Item>
                            <span onClick={() => navigate("/pedidos")} className='hidden xl:block'>
                                Pedidos
                            </span>
                        </Sidebar.Item>

                        <Sidebar.Item>
                            <span onClick={() => navigate("/promocoes")} className='hidden xl:block'>
                                Promoções
                            </span>
                        </Sidebar.Item>

                    </Sidebar.Collapse>
                </div>
            </Sidebar.ItemGroup>


            <Sidebar.ItemGroup>       
                <div className='hidden xl:flex'>
                    <Sidebar.Collapse icon={IoIosSettings} label='Administração'>
                        <Sidebar.Item>
                            <span onClick={() => navigate("/adm/users")} className='hidden xl:block'>
                                Usuários
                            </span>
                        </Sidebar.Item>
                    </Sidebar.Collapse>
                </div>

                <div className='flex px-2 w-20 justify-center xl:hidden cursor-pointer'>
                    <Sidebar.Item onClick={() => navigate("/adm/users")} icon={IoIosSettings}>

                    </Sidebar.Item>
                </div>


                <div className='flex px-2 w-20 justify-center xl:justify-start xl:w-full xl:px-0 cursor-pointer'>
                    <Sidebar.Item onClick={() => navigate("/conta")} icon={PiUserCircleGearFill}>
                        <span className='hidden xl:block'>
                            Minha conta
                        </span>
                    </Sidebar.Item>
                </div>
            </Sidebar.ItemGroup>

            <section className='absolute bottom-5 w-full pr-7'>
                <hr />

                <div className='flex items-center justify-between w-full text-gray-600 mt-4 mb-1'>
                    <div className='flex items-center gap-3'>
                        <LuUser fontSize={20}/>
                        <p>{user[0].user}</p>
                    </div>

                    <LuLogOut className='cursor-pointer' fontSize={18} onClick={() => logout()}/>
                </div>
            </section>
        </Sidebar.Items>
    </Sidebar>
  );
}

export default Aside;
