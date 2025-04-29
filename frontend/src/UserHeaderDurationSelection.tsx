import { DisplayDuration } from "./__generated__/graphql"

export default function UserHeaderDurationSelection(
  {displayDuration, setDisplayDuration}:
  {displayDuration: DisplayDuration, setDisplayDuration: React.Dispatch<React.SetStateAction<DisplayDuration>>}
) {
    return (
      <div className="btn-group mb-2" role="group" aria-label="DisplayDurationSelection">
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="DisplayDurationSelectionDay"
          defaultChecked={displayDuration === DisplayDuration.Day}>
        </input>
        <label
          className="btn btn-outline-primary"
          htmlFor="DisplayDurationSelectionDay"
          onClick={() => setDisplayDuration(DisplayDuration.Day)}>
          Day
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="DisplayDurationSelectionWeek"
          defaultChecked={displayDuration === DisplayDuration.ThreeDay}>
        </input>
        <label
          className="btn btn-outline-primary"
          htmlFor="DisplayDurationSelectionWeek"
          onClick={() => setDisplayDuration(DisplayDuration.ThreeDay)}>
          3 Day
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="DisplayDurationSelectionMonth"
          defaultChecked={displayDuration === DisplayDuration.Month}>
        </input>
        <label
          className="btn btn-outline-primary"
          htmlFor="DisplayDurationSelectionMonth"
          onClick={() => setDisplayDuration(DisplayDuration.Month)}>
          Month
        </label>
      </div>
    )
}