import { Button } from "@/components/ui/neon-button"

const Default = () => {
    return (
        <>
            <div className="flex flex-col gap-3">
                <Button>Button</Button>
                <WithNoNeon />
                <Solid />
                <Ghost />
                <Link />
            </div>
        </>
    )
}

const WithNoNeon = () => {
    return (
        <>
            <div className="flex flex-col gap-2">
                <Button neon={false}>normal button</Button>
            </div>
        </>
    )
}

const Solid = () => {
    return (
        <>
            <div className="flex flex-col gap-2">
                <Button variant={"solid"}>solid</Button>
            </div>
        </>
    )
}

const Ghost = () => {
    return (
        <>
            <div className="flex flex-col gap-2">
                <Button variant={"ghost"}>ghost</Button>
            </div>
        </>
    )
}

const Link = () => {
    return (
        <>
            <div className="flex flex-col gap-2">
                <Button variant={"link"}>link</Button>
            </div>
        </>
    )
}

export { Default, WithNoNeon, Solid, Ghost, Link }
