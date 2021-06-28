import { createMachine } from 'xstate';

const defaultInitialState = 'red';
let machineInstance;

export function createLightMachine(initialStateOverride) {
  if (machineInstance) return machineInstance;

  const initial =
    initialStateOverride ||
    localStorage.getItem('app-state') ||
    defaultInitialState;

  machineInstance = createMachine({
    id: 'light',
    initial,
    states: {
      red: {
        on: {
          CHANGE: 'green'
        }
      },
      yellow: {
        on: {
          CHANGE: 'red'
        }
      },
      green: {
        on: {
          CHANGE: 'yellow'
        }
      }
    }
  });

  return machineInstance;
}

export const lightMachine = createMachine({
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
