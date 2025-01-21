import CategoriesComponent from "@/components/categoriesComponent";
import requireAuth from "@/utils/requireAuth"


const page = async () => {
    await requireAuth();
    return (
        <CategoriesComponent />
    )
}

export default page
