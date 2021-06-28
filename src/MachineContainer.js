import useLightMachine from './useLightMachine';

function MachineContainer(props) {
  const { initialState } = props;
  const [state, send] = useLightMachine(initialState);

  function handleClick() {
    return send('CHANGE');
  }

  const backgroundColor = state.matches('green')
    ? 'green'
    : state.matches('yellow')
    ? 'yellow'
    : 'red';

  return (
    <div>
      <div
        style={{
          height: '50px',
          width: '50px',
          borderRadius: '50%',
          backgroundColor
        }}
      />
      <button onClick={handleClick}>CHANGE</button>
    </div>
  );
}

export default MachineContainer;
