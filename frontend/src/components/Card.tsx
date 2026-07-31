import { ReactNode } from "react";

type Props={
    children:ReactNode;
}

export function Card({children}:Props){

    return(

        <div className="rounded-xl bg-white p-8 shadow-lg">

            {children}

        </div>

    )

}