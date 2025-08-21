import { useState, useEffect } from "react";
import {
  CheckSquare,
  Clock,
  CreditCard,
  Tag,
  Trash,
  X,
} from "react-feather";
import Editable from "../../Editable/Editable";
import Modal from "../../Modal/Modal";
import { v4 as uuidv4 } from "uuid";
import Label from "../../Label/Label";

interface TagType {
  id: string;
  name: string;
  color: string;
  cardId: string;
}

interface TaskType {
  id: string;
  name: string;
  cardId: string;
}

interface CardType {
  id: string;
  name: string;
  description: string;
  workedTime: number;
  boardId: string;
  checklists: TaskType[];
  labels: TagType[];
}

interface CardDetailsProps {
  card: CardType;
  bid: string;
  onClose: () => void;
  updateCard: (bid: string, cid: string, card: CardType) => void;
  removeCard: (bid: string, cid: string) => void;
}

export default function CardDetails(props: CardDetailsProps) {
  const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];

  const [values, setValues] = useState<CardType>({ ...props.card });
  const [input, setInput] = useState(false);
  const [text, setText] = useState(values.name);
  const [labelShow, setLabelShow] = useState(false);

  const Input = () => (
    <input
      autoFocus
      defaultValue={text}
      type="text"
      onChange={(e) => setText(e.target.value)}
      className="border rounded px-2 py-1 w-full"
    />
  );

  const addTask = (value: string) => {
    const newTask: TaskType = {
      id: uuidv4(),
      name: value,
      cardId: props.card.id
    };
    setValues({ ...values, checklists: [...values.checklists, newTask] });
  };

  const removeTask = (id: string) =>
    setValues({ ...values, checklists: values.checklists.filter((t) => t.id !== id) });

  const deleteAllTask = () => setValues({ ...values, checklists: [] });

  const updateTask = (id: string) =>
    setValues({
      ...values,
      checklists: values.checklists.map((t) =>
        t.id === id ? { ...t } : t
      ),
    });

  const updateTitle = (value: string) =>
    setValues({ ...values, name: value });

  const calculatePercent = () => {
    if (values.checklists.length === 0) return 0;
    // TODO: COMPLETED
    const completed = values.checklists.filter((t) => true).length;
    return Math.floor((completed * 100) / values.checklists.length);
  };

  const removeTag = (id: string) =>
    setValues({ ...values, labels: values.labels.filter((t) => t.id !== id) });

  const addTag = (value: string, color: string) =>
    setValues({
      ...values,
      labels: [...values.labels, { id: uuidv4(), name: value, color, cardId: props.card.id }],
    });

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.code === "Enter") {
      setInput(false);
      updateTitle(text === "" ? values.name : text);
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [text, values.name]);

  useEffect(() => {
    props.updateCard(props.bid, values.id, values);
  }, [values]);

  return (
    <Modal onClose={props.onClose}>
      <div className="min-w-[650px] relative bg-white rounded-lg p-6 shadow">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5" />
          {input ? (
            <Input />
          ) : (
            <h5
              className="cursor-pointer text-lg font-semibold"
              onClick={() => setInput(true)}
            >
              {values.name}
            </h5>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="col-span-2">
            <h6 className="font-semibold">Label</h6>
            <div className="flex flex-wrap gap-2 mt-1 mb-3">
              {values.labels.length > 0 ? (
                values.labels.map((tag) => (
                  <span
                    key={tag.id}
                    className="flex items-center gap-1 px-3 py-1 rounded text-white font-semibold"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name.length > 10
                      ? tag.name.slice(0, 6) + "..."
                      : tag.name}
                    <X
                      onClick={() => removeTag(tag.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </span>
                ))
              ) : (
                <span className="text-gray-400 italic">Nenhuma Label</span>
              )}
            </div>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  <h6 className="font-semibold">Check List</h6>
                </div>
                <button
                  onClick={deleteAllTask}
                  className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
                >
                  Deletar todas
                </button>
              </div>

              <div className="w-full bg-gray-200 rounded h-4 overflow-hidden mb-3">
                <div
                  className="h-4 bg-green-500 text-xs text-white flex items-center justify-center"
                  style={{ width: `${calculatePercent()}%` }}
                >
                  {calculatePercent()}%
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {values.checklists.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => updateTask(t.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <p
                      className={`flex-grow text-sm ${true ? "line-through text-gray-400" : ""
                        }`}
                    >
                      {t.name}
                    </p>
                    <Trash
                      onClick={() => removeTask(t.id)}
                      className="w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500"
                    />
                  </div>
                ))}
                <Editable
                  parentClass="w-1/2"
                  name="Adicionar task"
                  btnName="Adicionar"
                  onSubmit={addTask}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <h6 className="font-semibold mb-2">Timer</h6>
            <button className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-left text-sm">
              <Clock className="w-4 h-4" /> Começar tarefa
            </button>
            <h6 className="font-semibold mt-5 mb-2">Adicionais</h6>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setLabelShow(true)}
                className="flex items-center gap-2 px-3 py-2 rounded bg-yellow-100 hover:bg-yellow-200 text-left text-sm"
              >
                <Tag className="w-4 h-4" /> Adicionar etiqueta
              </button>
              {labelShow && (
                <Label
                  color={colors}
                  addTag={addTag}
                  tags={values.labels}
                  onClose={() => setLabelShow(false)}
                />
              )}

              <button className="flex items-center gap-2 px-3 py-2 rounded bg-blue-100 hover:bg-blue-200 text-left text-sm">
                <Clock className="w-4 h-4" /> Prazo de entrega
              </button>

              <button
                onClick={() => props.removeCard(props.bid, values.id)}
                className="flex items-center gap-2 px-3 py-2 rounded bg-red-100 hover:bg-red-200 text-red-600 text-left text-sm"
              >
                <Trash className="w-4 h-4" /> Deletar Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
