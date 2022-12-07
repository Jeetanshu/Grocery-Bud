import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  const list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      updateAlert(true, "danger", "Enter Value");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
        })
      );
      setName("");
      updateAlert(true, "success", "Value Changed");
      setEditId(null);
      setIsEditing(false);
    } else {
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
      updateAlert(true, "success", "Item Added to the list");
    }
  };

  const updateAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, msg, type });
  };

  const clearList = () => {
    updateAlert(true, "danger", "Empty List");
    setList([]);
  };

  const removeItem = (id) => {
    updateAlert(true, "danger", "Item Removed");
    const newItems = list.filter((item) => item.id !== id);
    setList(newItems);
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setEditId(id);
    setName(specificItem.title);
    setIsEditing(true);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setAlert({ show: false, msg: "", type: "" });
  //   }, 3000);
  // }, [alert]);

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && (
          <Alert {...alert} updateAlert={updateAlert} list={list} />
        )}
        <h3>Grocery Bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. coding"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
