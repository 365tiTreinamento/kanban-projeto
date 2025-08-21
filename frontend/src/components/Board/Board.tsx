import { useEffect, useState } from "react";
import Card from ".././Card/Card";
import { MoreHorizontal, Trash2 } from "react-feather";
import Editable from ".././Editable/Editable";
import Dropdown from ".././Dropdown/Dropdown";
import { Droppable } from "@hello-pangea/dnd";

interface CardType {
  id: string;
  title: string;
  tags: Tag[];
  task: Task[];
}

interface Tag {
  id: string;
  tagName: string;
  color: string;
}

interface Task {
  id: string;
  task: string;
  completed: boolean;
}

interface BoardProps {
  id: string;
  name: string;
  card?: CardType[];
  setName: (name: string, id: string) => void;
  removeBoard: (id: string) => void;
  updateCard: (bid: string, cid: string, card: CardType) => void;
  removeCard: (bid: string, cid: string) => void;
  addCard: (title: string, bid: string) => void;
}

export default function Board(props: BoardProps) {
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Enter") setShow(false);
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <div
      className="
        relative flex flex-col w-[290px] h-full max-h-[82vh]
        break-words border border-black/15 rounded-md
        bg-gray-100 text-black
        text-black
        p-3
        shadow
      "
    >
      <div className="flex items-center justify-between px-2 mb-0">
        {show ? (
          <div>
            <input
              className="font-normal h-[30px] rounded-md px-2"
              type="text"
              defaultValue={props.name}
              onChange={(e) => props.setName(e.target.value, props.id)}
            />
          </div>
        ) : (
          <div className="cursor-pointer">
            <p
              onClick={() => setShow(true)}
              className="text-2xl font-bold flex items-center"
            >
              {props?.name || "Name of Board"}
              <span
                className="
                  text-[12px] rounded-full px-2
                  border border-gray-700
                  bg-gray-700 mx-[10px]
                  text-blue-100
                "
              >
                {props.card?.length}
              </span>
            </p>
          </div>
        )}
        <div onClick={() => setDropdown(true)} className="cursor-pointer">
          <MoreHorizontal />
          {dropdown && (
            <Dropdown
              className="shadow-xl bg-gray-300 cursor-default"
              onClose={() => setDropdown(false)}
            >
              <div className="flex flex-row gap-2 cursor-pointer" onClick={() => props.removeBoard(props.id)}>
                <Trash2 className="text-red-600"></Trash2>
                <p
                  className="cursor-pointer"
                >
                  Deletar quadro
                </p>
              </div>
            </Dropdown>
          )}
        </div>
      </div>

      <Droppable droppableId={props.id.toString()}>
        {(provided) => (
          <div
            className="px-2 py-2 overflow-y-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.card?.map((items, index) => (
              <Card
                bid={props.id}
                id={items.id}
                index={index}
                key={items.id}
                title={items.title}
                tags={items.tags}
                updateCard={props.updateCard}
                removeCard={props.removeCard}
                card={items}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="flex flex-col">
        <Editable
          name="Adicionar card"
          btnName="Adicionar"
          placeholder="Título do card"
          onSubmit={(value) => props.addCard(value, props.id)}
        />
      </div>
    </div>
  );
}
