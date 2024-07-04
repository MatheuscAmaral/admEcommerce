import { TbLoader3 } from "react-icons/tb";

const Loading = () => {
    return (
        <div className="flex justify-center mt-32">
            <TbLoader3 fontSize={30} className=" animate-spin "/>
        </div>
    )
}

export default Loading;