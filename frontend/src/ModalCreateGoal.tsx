import { useMutation } from '@apollo/client';
import React from 'react';

import { GoalFrequencyType } from './__generated__/graphql';

import { gqlCreateGoal, gqlGetUserStatus } from './GQLQueries';

export default function ModalCreateGoal({ closeModal}: { closeModal: () => void }) {
  const [goalName, setGoalName] = React.useState("");
  const [goalFrequency, setGoalFrequency] = React.useState(GoalFrequencyType.Daily);
  const [requiredActivitiesPerPeriod, setRequiredActivitiesPerPeriod] = React.useState(1);

  const [createGoal, createGoalStatus] = useMutation(
    gqlCreateGoal,
    {
      refetchQueries: [
        gqlGetUserStatus
      ]
    }
  );
      
  if (createGoalStatus.loading ) return <p>Submitting...</p>;
  if (createGoalStatus.error) return <p>Submission error : {createGoalStatus.error.message}</p>;

  const goalFrequencyOptions: string[] = Object.values(GoalFrequencyType);

  return (
    <div>
      <div className="modal-backdrop" style={{opacity: 0.5 }}></div>
      <div className="modal show" style={{ display: 'block' }} id="modalEditGoal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Goal</h5>
              <button type="button" className="btn-close btn-close-white" onClick={closeModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={event => {
                  event.preventDefault();
                  createGoal(
                    {
                      variables: {
                        goalName: goalName,
                        frequency: goalFrequency,
                        requiredActivitiesPerPeriod: requiredActivitiesPerPeriod
                      }
                    }
                  );
                  setGoalName('');
                  setGoalFrequency(GoalFrequencyType.Daily);
                  closeModal();
                }}>
                <div className="mb-3">
                  <label htmlFor="modalCreateGoalName" className="form-label">Goal Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="modalCreateGoalName"
                    aria-describedby="nameHelp"
                    value={goalName}
                    onChange={(event) => {
                      setGoalName(event.target.value);
                    }}>
                  </input>
                  <div id="nameHelp" className="form-text">Enter the name of your new goal.</div>
                  <select
                    className="form-select"
                    aria-label="Goal Frequency"
                    onChange={(event) => {
                      setGoalFrequency(event.target.value as GoalFrequencyType);
                    }}>
                    <option selected>Select Goal Frequency</option>
                    {
                      goalFrequencyOptions.map((goalFrequency) =>
                        <option value={goalFrequency}>{goalFrequency}</option>
                    )}
                  </select>
                  <label
                    htmlFor="requiredActivitiesPerPeriodRange"
                    className="form-label">Required Number of Activities Per Period</label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="50"
                    id="requiredActivitiesPerPeriodRange"
                    value={requiredActivitiesPerPeriod}
                    onChange={(event) => {
                      setRequiredActivitiesPerPeriod(Number(event.target.value));
                    }}>
                    </input>
                    <span>{requiredActivitiesPerPeriod}</span>
                </div>
                <button type="submit" className="btn btn-primary">Create Goal</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
