import { useDispatch } from "react-redux"
import { deleteItem, getItems } from "../services/item.services";
import { addItems, setLoading } from "../item.slice";

const useItem = () => {
    const dispatch = useDispatch()

    const fetchItems = async (search, type, tags) => {
        dispatch(setLoading(true))
        try {
            const res = await getItems({
                search,
                type,
                tags
            });
            dispatch(addItems(res.data.items))
        } catch (err) {
            console.error(err);
        } finally {
            dispatch(setLoading(false))
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteItem(id);
            fetchItems()
        } catch (err) {
            console.error(err);
        }
    };


    return { fetchItems, handleDelete }
}

export default useItem