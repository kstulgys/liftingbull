import { Stack, Text, Box, Button, IconButton, ListItem, List, ListIcon, Link } from '@chakra-ui/core'
import { InfoIcon } from '@chakra-ui/icons'
import Layout from '../components/Layout'
import { FiCheckCircle } from 'react-icons/fi'
import { useRouter } from 'next/router'

function IndexPage() {
  const router = useRouter()

  return (
    <Layout>
      <Stack maxW="6xl" width="full" mx="auto" minH="100vh" p="4" py="20">
        <Box maxW="4xl" width="full" pb="6">
          <Text lineHeight="none" fontFamily="inherit" fontSize="6xl" color="teal.400" fontWeight="bold">
            RPEtify - Enjoy your workout
          </Text>
          <Box maxW="lg" width="full" pt="4">
            <Text fontFamily="inherit" fontSize="xl" color="teal.400">
              A gym App that does all the calculations based on RPE (rate of perceived exertion) and much more
            </Text>
          </Box>
        </Box>
        <Box>
          <Button
            _hover={{ bg: 'teal.400', color: 'white' }}
            variant="outline"
            borderColor="teal.400"
            color="teal.400"
            borderWidth="3px"
            rounded="full"
            size="lg"
            fontSize="xl"
            height="16"
            onClick={() => router.push('/app')}
          >
            Start Now
          </Button>
        </Box>

        <Stack color="white" pt="20">
          <Box pb="1">
            <Text color="teal.400" fontSize="2xl">
              Features:
            </Text>
          </Box>
          <List spacing={3} fontSize="xl" fontWeight="normal">
            <ListItem display="flex" alignItems="center">
              <ListIcon as={FiCheckCircle} color="teal.400" fontSize="2xl" />
              <Box>
                <Text>RPE calculation for selected lift</Text>
              </Box>
              <Link pb="4px" ml="4" isExternal href="https://www.barbellmedicine.com/blog/autoregulation-and-rpe-part-i/">
                {/* @ts-ignore */}
                <InfoIcon />
              </Link>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={FiCheckCircle} color="teal.400" fontSize="2xl" />
              <Box>
                <Text>Dynamic warmup sets</Text>
              </Box>
              <Link pb="4px" ml="4" isExternal href="https://rippedbody.com/warm-up/">
                {/* @ts-ignore */}
                <InfoIcon />
              </Link>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={FiCheckCircle} color="teal.400" fontSize="2xl" />
              <Box>
                <Text>Wamup and work set plates</Text>
              </Box>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={FiCheckCircle} color="teal.400" fontSize="2xl" />
              <Box>
                <Text>Kg and Lbs units support</Text>
              </Box>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={FiCheckCircle} color="teal.400" fontSize="2xl" />
              <Box>
                <Text>Available plates selection</Text>
              </Box>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={FiCheckCircle} color="teal.400" fontSize="2xl" />
              <Box>
                <Text>Access you training info from any device</Text>
              </Box>
            </ListItem>
            <Stack pt={6}>
              <Text>
                If you have any questions, feel free to email us at{' '}
                <Link color="teal.400" isExternal href="mailto:team@thepowerbelt.com?subject=Hi there 👋">
                  team@thepowerbelt.com
                </Link>{' '}
                we will be happy to help ❤️
              </Text>
            </Stack>
          </List>
        </Stack>
      </Stack>
      <Stack direction={['column', 'row']} justifyContent="center" fontSize="sm" color="white" pb={1} spacing={[0, 2]} alignItems="center">
        <Text color="white">Made with ❤️ by "The power belt" team</Text>
        <Text display={['none', 'block']}>|</Text>
        <Text color="white">
          Email us at{' '}
          <Link color="teal.400" isExternal href="mailto:team@thepowerbelt.com?subject=Hi there 👋">
            team@thepowerbelt.com
          </Link>{' '}
        </Text>
        <Text display={['none', 'block']}>|</Text>
        <Text color="white">
          Follow us on{' '}
          <Link color="teal.400" isExternal href="https://www.facebook.com/artunden">
            facebook
          </Link>
        </Text>
      </Stack>
    </Layout>
  )
}

export default IndexPage
