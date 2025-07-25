import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'

const App = () => {
  const queryClient = useQueryClient()
  
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldAnecdotes) => {
        return oldAnecdotes.map(anecdote => 
          anecdote.id === updatedAnecdote.id
          ? updatedAnecdote
          : anecdote
        )
      })
    },
  })
  const handleVote = (anecdote) => {
    console.log('vote')
    const votedAnecdote = {...anecdote, votes: anecdote.votes + 1}
    updateAnecdoteMutation.mutate(votedAnecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
    refetchOnWindowFocus: false,
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if(result.isLoading){
    return <div>loading data..</div>
  }

  if(result.isError){
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
