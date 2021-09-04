import React from "react";
import { ToDoItem } from "./TodoItem";
import {
    FILTER_ALL,
    FILTER_ACTIVE,
    FILTER_COMPLETE,
    toggleTodo,
} from "shared/store/actions/todo";
import { connect } from "react-redux";
import { TodoState } from "shared/store/types/todo";
import { RootStates } from "shared/store/reducers";
const mapStateToProps = (state: RootStates) => {

    return {
        todoItems: getVisibleTodos(state.todo.todoItems, state.todo.visibilityFilter)
    };
};

const mapDispatchToProps = {
    toggleTodo,
};

const getVisibleTodos = (todos: TodoState[], filter: string): TodoState[] => {
    switch (filter) {
        case FILTER_ALL: {
            return todos;
        }
        case FILTER_ACTIVE: {
            return todos.filter((c: TodoState) => !c.completed);
        }
        case FILTER_COMPLETE: {
            return todos.filter((c: TodoState) => c.completed);
        }
        default:
            return todos;
    }
};

const ToDoList = ({
    todoItems,
    toggleTodo,
}: {
    todoItems: TodoState[];
    toggleTodo: (id: number) => void;
}) => {
    return (
        <>
            {todoItems && todoItems.map((c: TodoState) => (
                <ToDoItem
                    onToggleClick={toggleTodo}
                    key={c.id}
                    id={c.id}
                    complete={c.completed}
                    text={c.text}
                ></ToDoItem>
            ))}
        </>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(ToDoList);
