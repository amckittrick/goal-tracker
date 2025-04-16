import { useQuery } from '@apollo/client';

import { gqlGetEncouragement } from "./GQLQueries";

export default function Encouragement() {
  const { loading, error, data } = useQuery(gqlGetEncouragement);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Submission error : {error.message}</p>;

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      <div id="liveToast" className="toast show" role="alert" aria-live="assertive" aria-atomic="true" style={{"width": "500px"}}>
        <div className="toast-header bg-primary">
          <strong className="me-auto">Encouragement From {data?.encouragement.author}</strong>
          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div className="toast-body">{data?.encouragement.quote}</div>
      </div>
    </div>
  )
}