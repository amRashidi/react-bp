import React from 'react';
import { connect } from 'react-redux';
import { FILTER_ACTIVE, FILTER_ALL, FILTER_COMPLETE, setFilter } from 'shared/store/actions/todo'
import { TodoActionTypes } from 'shared/store/types/todo';


interface filter {
    (filter: string): (TodoActionTypes)
}


const mapDispatchToProps = {
    setFilter
}


const Filter = ({ setFilter }: { setFilter: filter }) => {
    return (
        <div>
            <button type="button"
                onClick={() => setFilter(FILTER_ALL)}
            >All</button>
            <button type="button"
                onClick={() => setFilter(FILTER_ACTIVE)}
            >Active</button>
            <button type="button"
                onClick={() => setFilter(FILTER_COMPLETE)}
            >Completed</button>
        </div>
    )
}
export default connect(null, mapDispatchToProps)(Filter);