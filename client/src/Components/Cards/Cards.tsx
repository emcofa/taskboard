import React from 'react'
import './cards.scss'


type Task = {
    id: number;
    title: string;
    column_id: number;
    created_at: string;
}

const Cards = ({ columnId, tasks }: { columnId: number, tasks: Task[] }) => {
  return (
    <div className='Cards'>
        {tasks.filter((task) => task.column_id === columnId).map((task: Task) => (
            <div key={task.id} className='Card'>
                <h2>{task.title}</h2>
                <p>{task.created_at}</p>
            </div>
        ))}
    </div>
  )
}

export default Cards