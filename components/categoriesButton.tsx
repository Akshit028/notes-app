import Link from "next/link"
import { Button } from "./ui/button"

const categoriesButton = () => {
    return (
        <Button variant={"outline"} asChild>
            <Link href="/categories">Categories</Link>
        </Button>
    )
}

export default categoriesButton

