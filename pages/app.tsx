import React from 'react'
import { useRouter } from 'next/router'
import {
  Checkbox,
  Stack,
  Text,
  Button,
  Box,
  Select as BaseSelect,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useDisclosure,
  Link,
} from '@chakra-ui/core'
import Layout from '../components/Layout'
import { useStore } from '../utils/store'
import { useAuth } from '../utils/useAuth'
import { calculateOneRepMax, getKgAndLbs, getPlatesOnBar, getRepsList, getRpeList, getWeightNumbers, getWorksetWeight } from '../utils'

function AppPage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useAuth((store) => store)
  const { isLoading: settingsLoading } = useStore((store) => store)
  const { getUserSettings } = useStore((store) => store.actions)

  React.useEffect(() => {
    !user?.uid ? router.push('/signin') : getUserSettings(user.uid)
  }, [user])

  if (!user?.uid || userLoading || settingsLoading) return null

  return (
    <Layout>
      <Stack flex="1" shouldWrapChildren maxW="sm" width="full" mx="auto" p="4" height="full" fontSize="xl">
        <SelectLiftName />
        <SelectLiftParams />
        <WorksetPlates />
        <Settings />
        <NeedHelpModal />
      </Stack>
      <SignoutButton />
      <Footer />
    </Layout>
  )
}

export default AppPage

function NeedHelpModal() {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
  return (
    <Stack>
      <Box>
        <Button fontSize="xl" fontWeight="normal" variant="unstyled" onClick={onToggle} color="teal.400">
          Need help?
        </Button>
      </Box>

      {isOpen && (
        <Stack>
          <Text color="white" fontSize="md">
            If you found a bug or have any questions, feel free to email us at{' '}
            <Link color="teal.400" isExternal href="mailto:team@thepowerbelt.com?subject=Hi there 👋">
              team@thepowerbelt.com
            </Link>{' '}
            we will be happy to help ❤️
          </Text>
        </Stack>
      )}
    </Stack>
  )
}

function Footer() {
  return (
    <Stack isInline py={2} justifyContent="center">
      <Text color="white">
        Made with ❤️ by{' '}
        <Link color="teal.400" isExternal href="mailto:team@thepowerbelt.com?subject=Hi there 👋">
          thepowerbelt
        </Link>{' '}
        team
      </Text>
    </Stack>
  )
}

function SelectLiftName() {
  const { currentWorkoutProps, oneRepMaxProps, settingsRef } = useStore((store) => store)

  const selectExercise = (newName: string) => {
    if (!newName) return
    const itemCopy = { ...currentWorkoutProps }
    itemCopy.shortName = newName
    settingsRef.update({ currentWorkoutProps: itemCopy })
  }

  const options = oneRepMaxProps.map(({ shortName }) => ({ name: shortName, value: shortName }))

  return <Select value={currentWorkoutProps?.shortName} onChange={(e) => selectExercise(e.target.value)} options={options} />
}

function SelectLiftParams() {
  const { settingsRef, currentWorkoutProps } = useStore((store) => store)
  const { rpe, reps } = currentWorkoutProps

  const updateExerciseSet = (prop: string, data: number) => {
    if (!prop || !data) return
    const itemCopy = { ...currentWorkoutProps }
    itemCopy[prop] = data
    settingsRef.update({ currentWorkoutProps: itemCopy })
  }

  return (
    <Stack isInline spacing="4">
      <Stack width="50%">
        <Box>
          <Text textAlign="center" color="white">
            Reps
          </Text>
        </Box>
        <Box width="full">
          <Select value={reps} options={getRepsList()} onChange={(e) => updateExerciseSet('reps', +e.target.value)} />
        </Box>
      </Stack>
      <Stack width="50%">
        <Box>
          <Text textAlign="center" color="white">
            Rpe
          </Text>
        </Box>
        <Box width="full">
          <Select value={rpe} options={getRpeList()} onChange={(e) => updateExerciseSet('rpe', +e.target.value)} />
        </Box>
      </Stack>
    </Stack>
  )
}

function WorksetPlates() {
  const { oneRepMaxProps, currentWorkoutProps, units, plates } = useStore((store) => store)
  const oneRM = oneRepMaxProps.find((item) => item.shortName === currentWorkoutProps.shortName)
  const { weightKg, weightLbs } = oneRM
  const oneRMWeight = calculateOneRepMax({ weightKg, weightLbs, units, rpe: oneRM.rpe, reps: oneRM.reps })
  const { rpe, reps } = currentWorkoutProps
  const barbellWeight = units === 'kg' ? 20 : 44
  const worksetWeight = getWorksetWeight(rpe, reps, oneRMWeight)
  const currentPlates = units === 'kg' ? plates.kg : plates.lbs
  const weightForPlates = (units === 'kg' ? worksetWeight : Math.round(worksetWeight)) - barbellWeight
  const { platesAsString, platesAsArray } = getPlatesOnBar(weightForPlates, barbellWeight, currentPlates)
  const worksetWeightFormat = units === 'kg' ? worksetWeight : Math.round(worksetWeight)

  const platesForVisualBarbell = React.useMemo(() => {
    return platesAsArray
      .reduce((acc, next) => {
        const isMultiplePlates = next.includes('x')
        if (isMultiplePlates) {
          const plate = next.split('x')
          return [...acc, [+plate[0], +plate[1]]]
        }
        return [...acc, [+next]]
      }, [])
      .reverse()
  }, [platesAsArray])

  const oneSideWeight = React.useMemo(() => {
    if (!platesForVisualBarbell) return 0
    const weight = platesForVisualBarbell.reduce((acc, next) => {
      if (typeof acc === 'undefined') {
        if (next.length === 2) {
          return next[0] * next[1]
        } else {
          return next[0]
        }
      }
      if (next.length === 2) {
        return acc + next[0] * next[1]
      } else {
        return acc + next[0]
      }
    }, undefined)

    return weight
  }, [platesForVisualBarbell])

  return (
    <Stack color="white" pt="5" pb="1">
      <Box>
        <Text textAlign="center">
          {worksetWeightFormat} {units}{' '}
          <Box as="label" fontSize="xs">
            total
          </Box>
        </Text>
      </Box>
      <Box>
        <Text textAlign="center">
          {platesAsString}{' '}
          <Box as="label" fontSize="xs">
            {oneSideWeight} one side
          </Box>
        </Text>
      </Box>
      <BarbelPlatesVisual platesForVisualBarbell={platesForVisualBarbell} barbellWeight={barbellWeight} oneSideWeight={oneSideWeight} />
    </Stack>
  )
}

function BarbelPlatesVisual({ platesForVisualBarbell, barbellWeight, oneSideWeight }) {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <>
      <Stack isInline alignItems="center" spacing={0}>
        <Checkbox isChecked={isOpen} size="sm" onChange={onToggle}>
          Show barbell
        </Checkbox>
      </Stack>
      {isOpen && (
        <Stack isInline alignItems="center" overflowX="auto" spacing={1}>
          <Stack isInline spacing={1} alignItems="center">
            {platesForVisualBarbell.map(([plate, multiplier], index) => {
              if (multiplier) {
                return Array(multiplier)
                  .fill(null)
                  .map((_, index) => {
                    return <BarbellPlate plate={plate} key={`${index}-${multiplier}-${plate}`} index={index} />
                  })
              }
              return <BarbellPlate plate={plate} key={index} index={index} />
            })}
          </Stack>
          <Stack isInline justifyContent="center" position="relative" height={2} bg="gray.300" width="full">
            <Box position="absolute" right={0} bottom={2}>
              <Text fontSize="lg">
                {oneSideWeight}{' '}
                <Box as="label" fontSize="xs">
                  x2 + {barbellWeight}
                </Box>
              </Text>
            </Box>
          </Stack>
        </Stack>
      )}
    </>
  )
}

const platesDefinitions = {
  kg: {
    25: { height: '6rem', color: 'red.500' },
    20: { height: '5.5rem', color: 'blue.500' },
    15: { height: '5rem', color: 'yellow.500' },
    10: { height: '4.5rem', color: 'green.500' },
    5: { height: '4rem', color: 'white' },
    '2.5': { height: '3.75rem', color: 'purple.500' },
    '1.25': { height: '3.5rem', color: 'pink.500' },
    '0.5': { height: '3.25rem', color: 'red.500' },
    '0.25': { height: '3rem', color: 'red.500' },
  },
  lbs: {
    45: { height: '6rem', color: 'red.500' },
    35: { height: '5.5rem', color: 'blue.500' },
    25: { height: '5rem', color: 'yellow.500' },
    10: { height: '4.5rem', color: 'green.500' },
    5: { height: '4rem', color: 'white' },
    '2.5': { height: '3.75rem', color: 'purple.500' },
  },
}

function BarbellPlate({ plate, index }) {
  const { units } = useStore((store) => store)
  if (!units || !plate) return null
  const { height, color } = platesDefinitions[units][plate]

  return (
    <Stack rounded="md" height={height} width={6} bg={color} justifyContent="center" alignItems="center">
      <Box transform="rotate(-90deg)">
        <Text m={0} fontSize="lg" fontWeight="semibold" color="gray.900" lineHeight="none">
          {plate}
        </Text>
      </Box>
    </Stack>
  )
}

function SignoutButton() {
  const signout = useAuth((store) => store.actions.signout)

  const handleSignOut = () => {
    const yes = window.confirm('Do you want to signout?')
    if (yes) signout()
  }

  return (
    <Stack pt="10">
      <Box p="4" maxW="sm" width="full" mx="auto">
        <Button size="lg" width="full" onClick={handleSignOut}>
          Signout
        </Button>
      </Box>
    </Stack>
  )
}

function Settings() {
  return (
    <Accordion allowToggle color="white" fontSize="xl">
      <SectionDropdown title="Warmup Sets">
        <WarmupSetsBody />
      </SectionDropdown>
      <SectionDropdown title="One Rep Max">
        <OneRepMaxBody />
      </SectionDropdown>
      <SectionDropdown title="Available Plates">
        <AvailablePlatesBody />
      </SectionDropdown>
      <SectionDropdown title="Units">
        <UnitsBody />
      </SectionDropdown>
    </Accordion>
  )
}

function WarmupSetsBody() {
  const { oneRepMaxProps, currentWorkoutProps, units, plates } = useStore((store) => store)

  const { reps, rpe } = currentWorkoutProps
  const oneRM = oneRepMaxProps.find((item) => item.shortName === currentWorkoutProps.shortName)
  const { weightKg, weightLbs } = oneRM
  const oneRMWeight = calculateOneRepMax({ weightKg, weightLbs, units, rpe: oneRM.rpe, reps: oneRM.reps })
  const worksetWeight = getWorksetWeight(rpe, reps, oneRMWeight)
  const barbellWeight = units === 'kg' ? 20 : 44
  const currentPlates = units === 'kg' ? plates.kg : plates.lbs

  if (reps <= 5) {
    const warmupSets = [
      { no: 1, pct: 0, reps: 10 },
      { no: 2, pct: 0.5, reps: 5 },
      { no: 3, pct: 0.6, reps: 4 },
      { no: 4, pct: 0.7, reps: 3 },
      { no: 5, pct: 0.8, reps: 2 },
      { no: 6, pct: 0.9, reps: 1 },
    ]
    return (
      <Stack fontSize="lg" color="white">
        {warmupSets.map(({ no, pct, reps }) => {
          const warmupWeight = Math.round((worksetWeight - barbellWeight) * pct)
          const { platesAsString, platesAsArray } = getPlatesOnBar(warmupWeight, barbellWeight, currentPlates)
          return (
            <Stack isInline key={no}>
              <Text width="8">{reps}</Text>
              <Text width="20">@{Math.round(pct * 100)}%</Text>
              <Text>{platesAsString}</Text>
            </Stack>
          )
        })}
      </Stack>
    )
  }

  const warmupSets = [
    { no: 1, pct: 0.5, reps: 8 },
    { no: 2, pct: 0.7, reps: 4 },
    { no: 3, pct: 0.9, reps: 2 },
  ]

  return (
    <Stack fontSize="lg" color="white">
      {warmupSets.map(({ no, pct, reps }) => {
        const warmupWeight = Math.round((worksetWeight - barbellWeight) * pct)
        const { platesAsString, platesAsArray } = getPlatesOnBar(warmupWeight, barbellWeight, currentPlates)
        return (
          <Stack isInline key={no}>
            <Text width="8">{reps}</Text>
            <Text width="20">@{Math.round(pct * 100)}%</Text>
            <Text>{platesAsString}</Text>
          </Stack>
        )
      })}
    </Stack>
  )
}

function UnitsBody() {
  const { settingsRef, units } = useStore((store) => store)

  const updateUnits = () => {
    settingsRef.update({ units: units === 'kg' ? 'lbs' : 'kg' })
  }

  return (
    <Stack isInline py="2" justifyContent="space-evenly" alignItems="center">
      <Checkbox isChecked={units === 'kg'} size="lg" onChange={updateUnits}>
        kg
      </Checkbox>
      <Checkbox isChecked={units === 'lbs'} size="lg" onChange={updateUnits}>
        lbs
      </Checkbox>
    </Stack>
  )
}

function AvailablePlatesBody() {
  const { plates, settingsRef, units } = useStore((store) => store)

  const defaultPlates = { kg: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25], lbs: [45, 35, 25, 10, 5, 2.5] }

  const updatePlates = (plate: number) => {
    if (!plate) return
    const newPlates = plates[units].includes(plate) ? plates[units].filter((pl) => pl !== plate) : [...plates[units], plate]
    settingsRef.update({ plates: { ...plates, [units]: newPlates.sort((a, b) => b - a) } })
  }

  return (
    <Stack spacing="4">
      {units === 'kg' && (
        <Stack isInline flexWrap="wrap" spacing="0">
          {defaultPlates.kg.map((plate) => (
            <Box key={plate}>
              <ButtonPlate onClick={() => updatePlates(plate)} isActive={plates.kg.includes(plate)}>
                {plate}
              </ButtonPlate>
            </Box>
          ))}
        </Stack>
      )}

      {units === 'lbs' && (
        <Stack isInline flexWrap="wrap" spacing="0">
          {defaultPlates.lbs.map((plate) => (
            <Box key={plate}>
              <ButtonPlate onClick={() => updatePlates(plate)} isActive={plates.lbs.includes(plate)}>
                {plate}
              </ButtonPlate>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

function OneRepMaxBody() {
  const oneRepMaxProps = useStore((store) => store.oneRepMaxProps)

  return (
    <Stack isInline overflowX="auto">
      <Stack width="55px" fontSize="md" color="teal.400">
        <Box>
          <Text height={6}>Lift</Text>
        </Box>
        <Stack height={12}>
          <Text my="auto">Reps</Text>
        </Stack>
        <Stack height={12}>
          <Text my="auto">Rpe</Text>
        </Stack>
        <Stack height={12}>
          <Text my="auto">Weight</Text>
        </Stack>
        <Stack>
          <Text>Max</Text>
        </Stack>
      </Stack>
      {oneRepMaxProps.map((props) => {
        return <OneRmRow key={props.id} {...props} />
      })}
    </Stack>
  )
}

function OneRmRow(props) {
  const { oneRepMaxProps, units, settingsRef } = useStore((store) => store)

  const { id, shortName, rpe, reps, weightKg, weightLbs } = props
  const repsList = getRepsList()
  const rpeList = getRpeList()

  const oneRMWeight = calculateOneRepMax({ weightKg, weightLbs, units, rpe, reps })

  const weight = units === 'kg' ? weightKg : weightLbs
  const weightsList = getWeightNumbers(units, weight)

  const updateOneRepMaxProp = (prop: string, data: string) => {
    if (!prop || !data) return
    const updatedOneRepMaxProps = [...oneRepMaxProps]
    updatedOneRepMaxProps.find((element) => element.id == id)[prop] = +data
    settingsRef.update({ oneRepMaxProps: updatedOneRepMaxProps })
  }

  const updateWeightProp = (weight: number) => {
    if (!weight) return
    const { weightKg, weightLbs } = getKgAndLbs(units, weight)
    const updatedOneRepMaxProps = [...oneRepMaxProps]
    updatedOneRepMaxProps.find((item) => item.id == id).weightKg = weightKg
    updatedOneRepMaxProps.find((item) => item.id == id).weightLbs = weightLbs
    settingsRef.update({ oneRepMaxProps: updatedOneRepMaxProps })
  }

  return (
    <Stack key={id} spacing="2">
      <Stack alignItems="center" width="80px">
        <Text my="auto" textAlign="center">
          {shortName}
        </Text>
      </Stack>
      <Stack color="gray.900">
        <Select value={reps} options={repsList} onChange={(e) => updateOneRepMaxProp('reps', e.target.value)} />
      </Stack>
      <Stack color="gray.900">
        <Select value={rpe} options={rpeList} onChange={(e) => updateOneRepMaxProp('rpe', e.target.value)} />
      </Stack>
      <Stack color="gray.900">
        <Select value={weight} options={weightsList} onChange={(e) => updateWeightProp(+e.target.value)} />
      </Stack>
      <Stack alignItems="center">
        <Text my="auto" textAlign="center" fontSize="lg">
          {oneRMWeight}
        </Text>
      </Stack>
    </Stack>
  )
}

function SectionDropdown({ title, children }) {
  return (
    <AccordionItem>
      <AccordionButton px="0">
        <Box flex="1" textAlign="left" fontSize="xl">
          {title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel p="0" my="2" fontSize="md">
        {children}
      </AccordionPanel>
    </AccordionItem>
  )
}

interface SelectProps {
  options: { name: string | number; value: string | number }[]
  value?: string | number
  onChange?: (e: any) => void
  fontSize?: string
}

function Select(props: SelectProps) {
  const { options, value, onChange, fontSize = 'lg', width = 'full' } = props
  return (
    <BaseSelect
      width={width}
      fontSize={fontSize}
      bg="white"
      onChange={onChange}
      value={value}
      size="lg"
      style={{
        textAlign: 'center',
        textAlignLast: 'center',
      }}
    >
      {options.map(({ name, value }, idx) => (
        <option key={`${name}-${idx}`} value={value}>
          {name}
        </option>
      ))}
    </BaseSelect>
  )
}

function ButtonPlate({ onClick, isActive, children }) {
  return (
    <Button
      mr="2"
      mb="2"
      variant="ghost"
      onClick={onClick}
      bg={isActive ? 'white' : 'gray.900'}
      color={isActive ? 'gray.900' : 'white'}
      border={isActive ? 'none' : '4px solid'}
      borderColor="white"
      width="16"
      height="16"
      size="lg"
      rounded="full"
      _hover={{
        color: isActive ? 'gray.900' : 'white',
      }}
      fontSize="md"
    >
      {children}
    </Button>
  )
}
