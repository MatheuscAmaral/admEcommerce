import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Container } from "../../components/container";
import { ToggleSwitch } from 'flowbite-react';

const Account = () => {
    const {user} = useContext(AuthContext);
    const [switch1, setSwitch1] = useState(true);

    return (
        <main className="flex flex-col gap-2">
           <Container>
                <h1 className="flex items-center gap-1 text-2xl font-semibold mt-5 text-gray-600 ">
                    Olá, {user[0].user}!
                </h1>


                <section>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                            <label htmlFor="user">Usuário: </label>
                            {
                                <input disabled value={user[0].user} name="user" id="user" className={`text-sm rounded-md p-3 bg-gray-100 border-2 cursor-not-allowed`} />
                            }
                        </div>

                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                            <label htmlFor="user">Nível: </label>
                            {
                                <input disabled value={user[0].nivel == 0 ? "Administrador" : "Super Administrador"} name="nivel" id="nivel" className={`text-sm rounded-md p-3 bg-gray-100 border-2 cursor-not-allowed`}/>
                            }
                        </div>

                        <div className="flex flex-col gap-2 w-full text-sm text-gray-600">
                            <label htmlFor="user">Status: </label>
                            {
                                <ToggleSwitch color="green" disabled checked={switch1} onChange={() => setSwitch1(switch1 ? false : true)}/> 
                            }
                        </div>
                    </div>
                </section>
           </Container>
        </main>
    )
}

export default Account;