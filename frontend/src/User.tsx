import { useState } from 'react';

import Goals from './Goals.tsx';
import ModalCreateGoal from './ModalCreateGoal.tsx';
import ModalEditGoal from './ModalEditGoal.tsx';

export default function User({ username }: { username: string }) {
  const [modalEditGoalIsOpen, setModalEditGoalIsOpen] = useState(false);
  const [modalEditGoalData, setModalEditGoalData] = useState({ goalName: '' });

  const openModalEditGoal = (data: {goalName: string }) => {
    setModalEditGoalData(data);
    setModalEditGoalIsOpen(true);
  };

  const closeModalEditGoal = () => {
    setModalEditGoalIsOpen(false);
  };

  const [modalCreateGoalIsOpen, setModalCreateGoalIsOpen] = useState(false);

  const openModalCreateGoal = () => {
    setModalCreateGoalIsOpen(true);
  };

  const closeModalCreateGoal = () => {
    setModalCreateGoalIsOpen(false);
  };

  return  (
  <div className="m-3">
    <Goals
      username={username}
      openModalEditGoal={openModalEditGoal}
      openModalCreateGoal={openModalCreateGoal}>
    </Goals>
    {modalEditGoalIsOpen && (
      <ModalEditGoal
        username={username}
        data={modalEditGoalData}
        closeModal={closeModalEditGoal}>
      </ModalEditGoal>
    )}
    {modalCreateGoalIsOpen && (
      <ModalCreateGoal
        username={username}
        closeModal={closeModalCreateGoal}>
      </ModalCreateGoal>
    )}
  </div>
  )
}
