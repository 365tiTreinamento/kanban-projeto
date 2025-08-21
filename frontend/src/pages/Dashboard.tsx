import { useEffect, useState } from "react";
import Board from "./../components/Board/Board";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import Editable from "./../components/Editable/Editable";
import { api } from '../services/api';

interface Tag {
  id: string;
  name: string;
  color: string;
  cardId: string;
}

interface Task {
  id: string;
  name: string;
  cardId: string;
}

interface ICard {
  id: string;
  name: string;
  description: string;
  workedTime: number;
  boardId: string;
  checklists: Task[]
  labels: Tag[]
}

interface BoardData {
  id: string;
  boardName: string;
  cards: ICard[];
}

function Dashboard() {
  const [data, setData] = useState<BoardData[]>([]);
  if (data.length < 1) {
    api.get<BoardData>(`http://localhost:8080/boards/1/full`).then(response => {
      console.log("response")
      console.log(response.data)
      let a: BoardData[] = []
      a.push(response.data)
      setData(a)
    });
    console.log("request made")

  }
  const setName = (title: string, bid: string) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index === -1) return;

    const tempData = [...data];
    tempData[index].boardName = title;
    setData(tempData);
  };

  const dragCardInBoard = (source: any, destination: any) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );

    if (destinationBoardIdx === -1 || sourceBoardIdx === -1) return tempData;

    tempData[destinationBoardIdx].cards.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].cards[source.index]
    );
    tempData[sourceBoardIdx].cards.splice(source.index, 1);

    return tempData;
  };

  const addCard = (title: string, bid: string) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index === -1) return;

    const tempData = [...data];
    tempData[index].cards.push({
      id: uuidv4(),
      name: title,
      labels: [],
      checklists: [],
      description: "",
      workedTime: 0,
      boardId: bid
    });
    setData(tempData);
  };

  const removeCard = (boardId: string, cardId: string) => {
    const index = data.findIndex((item) => item.id === boardId);
    if (index === -1) return;

    const tempData = [...data];
    const cardIndex = data[index].cards.findIndex((item) => item.id === cardId);
    if (cardIndex === -1) return;

    tempData[index].cards.splice(cardIndex, 1);
    setData(tempData);
  };

  const addBoard = (title: string) => {
    const tempData = [...data];
    tempData.push({
      id: uuidv4(),
      boardName: title,
      cards: [],
    });
    setData(tempData);
  };

  const removeBoard = (bid: string) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    if (index === -1) return;

    tempData.splice(index, 1);
    setData(tempData);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    setData(dragCardInBoard(source, destination));
  };

  const updateCard = (bid: string, cid: string, card: ICard) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;
    console.log(tempBoards);
    setData(tempBoards);
  };

  useEffect(() => {
    // TODO: Update sql
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-screen w-full bg-[var(--background-color)] transition-all duration-350 text-black">
        <div className="flex-1 w-full overflow-x-auto">
          <div className="flex gap-7 mt-5 px-8 min-w-max text-[var(--text-color)]">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.cards}
                setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                removeBoard={removeBoard}
                updateCard={updateCard}
              />
            ))}

            <Editable
              class="w-[250px] flex-shrink-0 "
              name="Adicionar quadro"
              btnName="Adicionar"
              onSubmit={addBoard}
              placeholder="Título do quadro"
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Dashboard;