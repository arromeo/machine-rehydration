import { createMachine } from 'xstate';
import useLocalStorageMachine from './useLocalStorageMachine';

const lightMachine = createMachine({
  id: 'light',
  initial: 'red',
  states: {
    red: {
      on: {
        CHANGE: [
          {
            target: '#green.noFetch',
            cond: (_, evt) => {
              return evt.metadata?.source === 'storage';
            }
          },
          { target: '#green.fetch' }
        ]
      }
    },
    yellow: {
      on: {
        CHANGE: 'red'
      }
    },
    green: {
      id: 'green',
      states: {
        fetch: {
          entry: () => console.log('fetch')
        },
        noFetch: {
          entry: () => console.log('no fetch')
        }
      },
      on: {
        CHANGE: 'yellow'
      }
    }
  }
});

function useLightMachine(initialState) {
  return useLocalStorageMachine(lightMachine, 'app-state', initialState);
}

export default useLightMachine;
