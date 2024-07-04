import { LuSearchX } from "react-icons/lu"; 

const NoResults = () => {
    return (
        <div className="flex flex-col gap-3 items-center justify-center mt-40">
            <LuSearchX fontSize={30}/>
            <p>Nenhum resultado encontrado!</p>
        </div>
    )
}

export default NoResults;