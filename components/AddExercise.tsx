import { useStore } from '../utils/store'
import { v4 as uuid } from 'uuid'
import { Button } from '../components/lib'

export function AddExercise() {
  const { currentWorkoutProps, oneRepMaxProps, settingsRef } = useStore((store) => store)

  const addExercise = () => {
    const newCurrentWorkoutProps = [...currentWorkoutProps, { id: uuid(), shortName: oneRepMaxProps[0].shortName, sets: [{ id: uuid(), reps: 5, rpe: 8 }] }]
    settingsRef.set({ currentWorkoutProps: newCurrentWorkoutProps }, { merge: true })
  }

  return <Button onClick={addExercise}>Add Exercise</Button>
}