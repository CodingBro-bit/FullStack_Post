


interface InMemoryRepository<T>{
    AddTo : () => void , 
    DeleteFrom : () => void , 
    Edit : () => void , 
    GetAll : () => T[]
}