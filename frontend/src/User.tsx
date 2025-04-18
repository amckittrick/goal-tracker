import { useState } from 'react';

import { UserObject } from './App.tsx';
import Goals from './Goals.tsx';
import ModalCreateGoal from './ModalCreateGoal.tsx';
import ModalEditGoal from './ModalEditGoal.tsx';

export default function User({ user }: { user: UserObject }) {
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
      currentUserEmail={user.email}
      openModalEditGoal={openModalEditGoal}
      openModalCreateGoal={openModalCreateGoal}>
    </Goals>
    {modalEditGoalIsOpen && (
      <ModalEditGoal
      currentUserEmail={user.email}
        data={modalEditGoalData}
        closeModal={closeModalEditGoal}>
      </ModalEditGoal>
    )}
    {modalCreateGoalIsOpen && (
      <ModalCreateGoal
        currentUserEmail={user.email}
        closeModal={closeModalCreateGoal}>
      </ModalCreateGoal>
    )}
  </div>
  )
}
