import { DisplayDuration } from "./__generated__/graphql"

import UserHeaderDurationSelection from "./UserHeaderDurationSelection"

export default function UserHeader(
  {
    displayDuration,
    setDisplayDuration,
    openModalEditGoal,
    openModalCreateGoal,
  }:
  {
    displayDuration: DisplayDuration,
    setDisplayDuration: React.Dispatch<React.SetStateAction<DisplayDuration>>,
    openModalEditGoal: () => void,
    openModalCreateGoal: () => void,
  }
) {
  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <UserHeaderDurationSelection
          displayDuration={displayDuration}
          setDisplayDuration={setDisplayDuration}>
        </UserHeaderDurationSelection>
      </div>
      <button type="button" className="mb-2 mx-2 btn btn-primary btn-sm" onClick={openModalEditGoal}>
        Edit Goal
        <i className="mx-2 bi bi-journal-plus"></i>
      </button>
      <button type="button" className="mb-2 btn btn-primary btn-sm" onClick={openModalCreateGoal}>
        Create Goal
        <i className="mx-2 bi bi-journal-plus"></i>
      </button>
    </div>
  )
}