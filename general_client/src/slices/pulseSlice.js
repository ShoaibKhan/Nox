import { PULSE_TICK, PULSE_RESET, PULSE_DIST } from '../actions/types';

const MAX_LEN = 60;

const initialState = {
  values: [],
  dist: { good: 0, okay: 0, lost: 0 },
};

export default function pulseReducer(state = initialState, action) {
  switch (action.type) {
    case PULSE_TICK: {
      const next = [...state.values, action.payload];
      if (next.length > MAX_LEN) next.shift();
      return { ...state, values: next };
    }
    case PULSE_DIST:
      return { ...state, dist: action.payload };
    case PULSE_RESET:
      return initialState;
    default:
      return state;
  }
}
