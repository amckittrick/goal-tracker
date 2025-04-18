import { useQuery } from '@apollo/client';

import { gqlGetEncouragement } from "./GQLQueries";

export default function Encouragement() {
  const { loading, error, data } = useQuery(gqlGetEncouragement);

  if (loading) {
    return null;
  }
  if (error) {
    console.log(error.message);
    return null;
  }

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      <div id="liveToast" className="toast show border-primary" role="alert" aria-live="assertive" aria-atomic="true" style={{"width": "500px"}}>
        <div className="toast-header bg-primary text-dark">
          <strong className="me-auto">Encouragement From {data?.encouragement.author}</strong>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div className="toast-body bg-primary-subtle text-dark">{data?.encouragement.quote}</div>
      </div>
    </div>
  )
}