import React from 'react'
import { useRouter } from 'next/router'
import { Button, Stack, Spinner, Box, Text, FormControl, FormLabel, Input, FormHelperText, HStack, VStack, Icon } from '@chakra-ui/core'
import { useAuth } from '../utils/useAuth'
import Layout from '../components/Layout'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'

function SigninPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth((store) => store)
  const { listenForAuthStateChange, signInWithGoogle } = useAuth((store) => store.actions)

  React.useEffect(() => {
    listenForAuthStateChange({ onSuccess: () => router.push('/app'), onFailure: () => router.push('/signin') })
  }, [])

  if (isLoading) {
    return (
      <Layout>
        <Stack pt="20">
          <Spinner size="xl" mx="auto" color="white" />
        </Stack>
      </Layout>
    )
  }

  if (user?.uid) return null

  return (
    <Layout>
      <Stack p="4" maxW="sm" mx="auto" width="full">
        <Box>
          <Button onClick={() => router.push('/')} variant="link" color="teal.300" fontSize="xl">
            Rpetify
          </Button>
        </Box>
        <SigninWithEmail />
        <Box py="4">
          <Text textAlign="center" fontSize="xl" color="white">
            Or
          </Text>
        </Box>
        <Box>
          <Button width="full" size="lg" onClick={signInWithGoogle}>
            <Icon as={FcGoogle} fontSize="2xl" mr={2} /> Sign in with Google
          </Button>
        </Box>
      </Stack>
    </Layout>
  )
}

export default SigninPage

function SigninWithEmail() {
  const { isFormLoading, error } = useAuth((store) => store)
  const { signin, signup, sendPasswordResetEmail } = useAuth((store) => store.actions)

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [type, setType] = React.useState<'signin' | 'signup' | 'restore'>('signin')

  const toggleFormType = () => setType(type === 'signin' ? 'signup' : 'signin')

  const handleSubmit = () => {
    if (type === 'restore') return sendPasswordResetEmail(email)
    if (type === 'signin') return signin(email, password)
    if (type === 'signup') return signup(email, password)
  }

  const getSubmitButtonText = () => {
    if (type === 'restore') return 'Restore'
    if (type === 'signin') return 'Signin'
    if (type === 'signup') return 'Signup'
  }

  return (
    <form
      style={{ marginTop: 70 }}
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      {type === 'restore' ? (
        <FormControl id="email">
          <FormLabel color="white">Email address</FormLabel>
          <Input placeholder="yourEmail@example.com" value={email} bg="white" size="lg" type="email" onChange={(e) => setEmail(e.target.value)} />
          <FormHelperText color="red.500">{error && error}</FormHelperText>
        </FormControl>
      ) : (
        <>
          <FormControl id="email">
            <FormLabel color="white">Email address</FormLabel>
            <Input placeholder="yourEmail@example.com" value={email} bg="white" size="lg" type="email" onChange={(e) => setEmail(e.target.value)} />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <FormControl id="password" mt="4">
            <FormLabel color="white">Password</FormLabel>
            <Input value={password} bg="white" size="lg" type="password" onChange={(e) => setPassword(e.target.value)} />
            <FormHelperText color="red.500">{error && error}</FormHelperText>
          </FormControl>
        </>
      )}

      <HStack pt="3" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Button bg={type === 'signin' ? 'white' : 'teal.300'} size="lg" type="submit" isLoading={isFormLoading}>
            {getSubmitButtonText()}
          </Button>
        </Box>
        <VStack spacing="0">
          <Box width="full">
            <Button mt="-9px" textAlign="end" width="full" variant="link" color="teal.300" onClick={toggleFormType}>
              {type === 'signin' ? 'Create account' : 'Signin'}
            </Button>
          </Box>
          <Box>
            <Button variant="link" color="teal.300" onClick={() => setType('restore')}>
              Forgot password?
            </Button>
          </Box>
        </VStack>
      </HStack>
    </form>
  )
}
