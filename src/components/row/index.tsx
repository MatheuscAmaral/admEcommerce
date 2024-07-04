import { IoSearchOutline, IoNotificationsOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import { MdSpaceDashboard } from "react-icons/md";
import { Dropdown } from 'flowbite-react';
import { HiLogout } from 'react-icons/hi';
import { FaUser } from "react-icons/fa";


const Row = () => {
    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    return (
      <div className=" w-full xl:pr-0 2xl:w-full mx-5 mt-6 mb-5 xl:pl-0 transition-all">
        <section className="flex gap-5 md:gap-10 md:justify-between w-full px-6 py-3 bg-white rounded-lg items-center ">
            <div className="hidden sm:flex w-full relative md:max-w-80">
                <input type="text" className=" border-gray-50 rounded-lg w-full text-sm relative" placeholder="Procurar"/>
                <IoSearchOutline fontSize={16} className="absolute right-3 top-2.5"/>
            </div>
                
            <div className="flex gap-2 items-center text-gray-700">
                <button >
                    <IoNotificationsOutline fontSize={24}/>
                </button>

                <button className="flex items-center gap-3">
                    <FiUser fontSize={24}/>
                    <Dropdown label={`${user[0].user}`} inline>
                        <Dropdown.Header>
                            <span className="text-start block truncate text-sm font-medium">
                                {
                                    user.length > 0 && user[0].user
                                }
                            </span>
                        </Dropdown.Header>

                        <Dropdown.Item icon={FaUser} onClick={() => navigate("/conta")}>
                            Minha conta
                        </Dropdown.Item>

                        <Dropdown.Item icon={MdSpaceDashboard} onClick={() => navigate("/")}>
                            Dashboard
                        </Dropdown.Item>

                        <Dropdown.Divider />
                        <Dropdown.Item icon={HiLogout} onClick={() => logout()}>
                            Sair
                        </Dropdown.Item>
                    </Dropdown>
                </button>
                
            </div>
        </section>
      </div>
    )
  }
  
  export default Row;
  