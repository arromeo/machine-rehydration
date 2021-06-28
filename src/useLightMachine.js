import { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { lightMachine } from './lightMachine';

function useLightMachine(initialState) {
  return useLocalStorageMachine(lightMachine, 'app-state', initialState);
}

const noopEvent = { type: 'NOOP' };
const noopInternalEvent = { name: 'NOOP', data: noopEvent };

function getLocalStorageState(key) {
  const localStorageState = JSON.parse(localStorage.getItem(key));
  if (!localStorageState) return undefined;
  localStorageState.event = noopEvent;
  localStorageState._event = noopInternalEvent;
  return localStorageState;
}

function useLocalStorageMachine(machine, key, initialState) {
  const [state, send, service] = useMachine(machine, {
    state: getLocalStorageState(key) ?? initialState
  });

  useEffect(() => {
    const subscription = service.subscribe((state) => {
      if (state?.event?.metadata?.source !== 'storage') {
        console.log(state);
        localStorage.setItem(key, JSON.stringify(state));
      }
    });

    function handleStorageEvent(evt) {
      const machineEvent = JSON.parse(evt.newValue).event;
      service.send({
        ...machineEvent,
        metadata: {
          source: 'storage'
        }
      });
    }

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [key, service]);

  return [state, send, service];
}

export default useLightMachine;
