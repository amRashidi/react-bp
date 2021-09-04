import React from 'react';
import Input from 'shared/components/Input';
import TodoFilter from 'shared/components/Todo/TodoFilter';
import TodoList from 'shared/components/Todo/TodoList';
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault();
};
function App() {

    return (
        <React.Fragment>
            <h2>example</h2>
            <div>
                <div>
                    <form
                        onSubmit={handleSubmit}
                    >
                        <Input />
                        <TodoFilter />
                    </form>
                </div>
                <TodoList />
            </div>
        </React.Fragment>
    );
};

export default App;
