import { POLL_OPEN, POLL_UPDATE, POLL_CLOSE, POLL_VOTE_LOCAL } from '../actions/types';

const initialState = {
  active: null,
  myVote: null,
  closed: false,
};

export default function pollReducer(state = initialState, action) {
  switch (action.type) {
    case POLL_OPEN:
      return { active: action.payload, myVote: null, closed: false };
    case POLL_UPDATE:
      if (!state.active || state.active.pollId !== action.payload.pollId) return state;
      return { ...state, active: { ...state.active, options: action.payload.options } };
    case POLL_VOTE_LOCAL:
      return { ...state, myVote: action.payload };
    case POLL_CLOSE:
      return { ...state, closed: true };
    default:
      return state;
  }
}
