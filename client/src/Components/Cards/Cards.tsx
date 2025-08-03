import React from 'react'
import './cards.scss'


type Task = {
    id: number;
    title: string;
    description: string;
    columnId: number;
    created: string;
    dueDate: string;
}

const Cards = ({ columnId, tasks }: { columnId: number, tasks: Task[] }) => {
  return (
    <div className='Cards'>
        {tasks.filter((task) => task.columnId === columnId).map((task: Task) => (
            <div key={task.id} className='Card'>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>{task.created}</p>
            </div>
        ))}
    </div>
  )
}

export default Cards