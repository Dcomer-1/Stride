import { Loader2 } from "lucide-react";

export default function Loading(props: { color?: string}) {

    return (
        <div className="flex items-center h-full justify-start ">
            <h1 className="text-2xl font-bold text-black p-3"
            style={{ color: props.color ? props.color : 'black' }}>Loading...</h1>
            <Loader2 className="w-10 h-10 animate-spin" />
        </div>
    )
}
