import React from "react";
import { addItem } from "shared/store/actions/todo";
import { connect } from "react-redux";
import { TodoActionTypes } from "shared/store/types/todo";
const mapDispatchToProps = {
  addItem,
};
const Input = ({ addItem }: { addItem: (item: string) => TodoActionTypes }) => {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }
  ) => {
    if (e.key === "Enter") {
      if (e.target.value && e.target.value.trim().length > 0) {
        addItem(e.target.value);
      }
      e.target.value = "";
    }
  };
  return (
    <>
      <input
        id="todoText"
        type="text"
        onKeyDown={handleKeyDown}
        placeholder="Add an item and press Enter"
      />
    </>
  );
};

export default connect(null, mapDispatchToProps)(Input);
