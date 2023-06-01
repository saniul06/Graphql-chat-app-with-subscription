import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { addMessageMutation, messageAddedSubscription, messagesQuery } from './queries';

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const { data: { message } } = await mutate({
      variables: { text },
      // update: (cache, { data }) => {
      //   cache.updateQuery({ query: messagesQuery }, oldCache => {
      //     const newMessage = data?.message;
      //     return { messages: [...oldCache.messages, newMessage] };
      //   })
      // }
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  useSubscription(messageAddedSubscription, {
    onData: ({ client, data }) => {
      const newMessage = data?.data?.message;
      client.cache.updateQuery({ query: messagesQuery }, oldCache => {
        return { messages: [...oldCache.messages, newMessage] };
      })
    }
  })
  return {
    messages: data?.messages ?? [],
  };
}
