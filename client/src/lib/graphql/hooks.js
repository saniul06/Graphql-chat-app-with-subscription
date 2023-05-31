import { useMutation, useQuery } from '@apollo/client';
import { addMessageMutation, messagesQuery } from './queries';

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const { data: { message } } = await mutate({
      variables: { text },
      update: (cache, { data }) => {
        console.log('data: ', data)
        cache.updateQuery({ query: messagesQuery }, oldCache => {
          const newMessage = data?.message;
          return { messages: [...oldCache.messages, newMessage] };
        })
      }
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  return {
    messages: data?.messages ?? [],
  };
}
