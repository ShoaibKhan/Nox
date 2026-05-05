import { QUESTIONS_SET, QUESTION_ADD, QUESTION_VOTE, QUESTION_ANSWER } from '../actions/types';

const initialState = {
  items: [],
};

export default function questionsReducer(state = initialState, action) {
  switch (action.type) {
    case QUESTIONS_SET:
      return { ...state, items: action.payload };
    case QUESTION_ADD: {
      const exists = state.items.find((q) => q.id === action.payload.id);
      if (exists) return state;
      return { ...state, items: [action.payload, ...state.items] };
    }
    case QUESTION_VOTE:
      return {
        ...state,
        items: state.items.map((q) =>
          q.id === action.payload.id
            ? { ...q, votes: action.payload.votes, mine: action.payload.mine ?? q.mine }
            : q
        ),
      };
    case QUESTION_ANSWER:
      return {
        ...state,
        items: state.items.map((q) =>
          q.id === action.payload.id ? { ...q, answered: true } : q
        ),
      };
    default:
      return state;
  }
}
