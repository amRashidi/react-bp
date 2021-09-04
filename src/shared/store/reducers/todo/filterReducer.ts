import { FILTER_ALL, SET_FILTER } from "../../actions/todo";
import { TodoActionTypes } from "../../types/todo";


const visibiltyFilter = (state: string = FILTER_ALL, action: TodoActionTypes): string => {
    switch (action.type) {
        case SET_FILTER:
            return action.value
    };
    return state;
};
export default visibiltyFilter