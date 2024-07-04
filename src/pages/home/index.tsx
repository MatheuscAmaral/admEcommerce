import { Container } from "../../components/container";

import { TbShoppingBagCheck } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { GiTakeMyMoney } from "react-icons/gi";
import { CiDiscount1 } from "react-icons/ci";
import { HiMiniArrowTrendingUp, HiMiniArrowTrendingDown } from "react-icons/hi2";
import { MdSpaceDashboard } from "react-icons/md";
import api from "../../api";
import { useEffect, useState } from "react";
import Loading from "../../components/loading";
import toast from "react-hot-toast";
import NoResults from "../../components/noResults";

interface EstatisticasProps {
  produtos: number,
  pedidos: number,
  promocoes: number,
  users: number
}

const Home = () => {
  const [estatisticas, setEstatisticas] = useState<EstatisticasProps>();
  const [load, setLoad] = useState(false);

  useEffect(() => {   
      const getEstatisticas = async () => {
        try {
          setLoad(true);
          const response = await api.get("/estatisticas");
    
          setEstatisticas(response.data);
        } 

        catch {
          toast.error("Ocorreu um erro ao buscar as estatísticas");
        }
        
        finally {
          setLoad(false);
        }
      }
      
      getEstatisticas();
    }, [])
    
    return (
        <Container>
            <h1 className="text-2xl font-semibold text-gray-700 mt-6 flex items-center gap-2">
              <MdSpaceDashboard />
              Dashboard
            </h1>

            {
              load ? (
                <Loading/>
              ) : (
                  estatisticas ? (
                  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xl:px-0 mx-auto w-full mt-10 ">
                    <div className="flex flex-col gap-2 w-full py-4 px-5 rounded-2xl shadow bg-white h-44 relative">
                        <div className="flex justify-between w-full text-gray-700">
                          <h1 className="text-lg font-medium">Usuários</h1>
                          <LuUsers  fontSize={22}/> 
                        </div>

                        <span className="flex justify-between w-full items-center absolute left-3 bottom-10 px-1">
                          <p className="text-3xl font-medium text-gray-600">
                            {
                              estatisticas.users
                            }
                          </p>
                          
                          <HiMiniArrowTrendingUp fontSize={30} className=" text-blue-500 mr-7"/>
                        </span>
                    </div>


                      <div className="flex flex-col gap-2 w-full py-4 px-5 rounded-2xl shadow bg-white h-44 relative">
                        <div className="flex justify-between w-full text-gray-700">
                          <h1 className="text-lg font-medium text-gray-700">Produtos</h1>
                          <TbShoppingBagCheck fontSize={25}/> 
                        </div>
        
                        <span className="flex justify-between w-full items-center absolute left-3 bottom-10 px-1">
                          <p className="text-3xl font-medium text-gray-600">
                            {
                              estatisticas.produtos
                            }
                          </p>
                          <HiMiniArrowTrendingUp fontSize={30} className=" text-blue-500 mr-7"/>
                        </span>
                    </div>

                      <div className="flex flex-col gap-2 w-full py-4 px-5 rounded-2xl shadow bg-white h-44 relative">
                        <div className="flex justify-between w-full text-gray-700">
                          <h1 className="text-lg font-medium text-gray-700">Pedidos</h1>
                          <GiTakeMyMoney fontSize={25}/> 
                        </div>

                        <span className="flex justify-between w-full items-center absolute left-3 bottom-10 px-1">
                          <p className="text-3xl font-medium text-gray-600">
                            {
                              estatisticas.pedidos
                            }
                          </p>
                          <HiMiniArrowTrendingUp fontSize={30} className=" text-blue-500 mr-7"/>
                        </span>
                    </div>

                      <div className="flex flex-col gap-2 w-full py-4 px-5 rounded-2xl shadow bg-white h-44 relative">
                        <div className="flex justify-between w-full text-gray-700">
                          <h1 className="text-lg font-medium text-gray-700">Promoções</h1>
                          <CiDiscount1 fontSize={25}/> 
                        </div>

                        <span className="flex justify-between w-full items-center absolute left-3 bottom-10 px-1">
                          <p className="text-3xl font-medium text-gray-600">
                            {
                              estatisticas.promocoes
                            }
                          </p>
                          <HiMiniArrowTrendingDown fontSize={33} className=" text-red-500 mr-7"/>
                        </span>
                    </div>
                </section> 
                  ) : (
                    <NoResults/>
                  )
              )
            }
        </Container>
    )
  }
  
  export default Home;
  