import { ReactNode } from "react"

interface ContainerProps {
    children: ReactNode
}

export const Container = ({children}: ContainerProps) => {
    return (
        <section  className="flex flex-col h-screen mx-5 mt-5 mb-5 md:mb-0 rounded">
            {children}
        </section>
    )
}
