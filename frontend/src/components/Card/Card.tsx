import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { CheckSquare, MoreHorizontal } from "react-feather";
import Tag from "../Tags/Tag";
import CardDetails from "./CardDetails/CardDetails";

interface TagType {
  id: string;
  tagName: string;
  color: string;
}

interface TaskType {
  id: string;
  task: string;
  completed: boolean;
}

interface CardType {
  id: string;
  title: string;
  tags: TagType[];
  task: TaskType[];
}

interface CardProps {
  id: string;
  index: number;
  title: string;
  tags?: TagType[];
  card: CardType;
  bid: string;
  updateCard: (bid: string, cid: string, card: CardType) => void;
  removeCard: (bid: string, cid: string) => void;
}

const Card = (props: CardProps) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Draggable
      key={props.id.toString()}
      draggableId={props.id.toString()}
      index={props.index}
    >
      {(provided: any) => (
        <>
          {modalShow && (
            <CardDetails
              updateCard={props.updateCard}
              onClose={() => setModalShow(false)}
              card={props.card}
              bid={props.bid}
              removeCard={props.removeCard}
            />
          )}

          <div
            className="bg-gray-200 text-black rounded-md shadow-sm shadow-[var(--card-box-shadow)] px-2 pb-3 pt-2 mb-2 cursor-pointer"
            onClick={() => {
              setModalShow(true);
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{props.title}</p>
              <MoreHorizontal
                className="opacity-50 hover:opacity-100 transition duration-100 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalShow(true);
                }}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-1">
              {props.tags?.map((item, index) => (
                <Tag key={index} tagName={item.tagName} color={item.color} />
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-2">
              {props.card.task.length !== 0 && (
                <div className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                  <CheckSquare className="w-4 h-4 text-green-700" />
                  <span>
                    {
                      `${
                        props.card.task.filter((item) => item.completed === true)
                          .length
                      } / ${props.card.task.length}`
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Draggable>
  );
};

export default Card;
