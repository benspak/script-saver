import { useState, useEffect, useRef } from 'react'
import { Box, Flex, VStack, Text, Tag, Input, Textarea, Button, HStack, Spinner, useToast, IconButton, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { AddIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function App() {
  const [scripts, setScripts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const toast = useToast()

  // Fetch all scripts (summary)
  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/scripts`)
      .then(res => res.json())
      .then(data => {
        setScripts(data)
        if (data.length > 0) setSelectedId(data[0]._id)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load scripts')
        setLoading(false)
      })
  }, [])

  // Fetch selected script details
  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    fetch(`${API_URL}/scripts/${selectedId}`)
      .then(res => res.json())
      .then(data => {
        setEdit(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load script details')
        setLoading(false)
      })
  }, [selectedId])

  // Filter scripts in the frontend
  const filteredScripts = scripts.filter(script => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      script.title?.toLowerCase().includes(q) ||
      script.description?.toLowerCase().includes(q) ||
      script.content?.toLowerCase().includes(q) ||
      (Array.isArray(script.tags) && script.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  });

  const handleChange = e => {
    const { name, value } = e.target
    setEdit(prev => ({ ...prev, [name]: value }))
  }

  const handleTagChange = (idx, value) => {
    setEdit(prev => {
      const tags = [...prev.tags]
      tags[idx] = value
      return { ...prev, tags }
    })
  }

  const handleAddTag = () => {
    setEdit(prev => ({ ...prev, tags: [...prev.tags, ''] }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/scripts/${edit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edit),
      })
      if (!res.ok) throw new Error('Save failed')
      const updated = await res.json()
      setEdit(updated)
      setScripts(scripts => scripts.map(s => (s._id === updated._id ? updated : s)))
      toast({ title: 'Saved', status: 'success', duration: 2000 })
    } catch (err) {
      setError('Failed to save')
      toast({ title: 'Failed to save', status: 'error', duration: 2000 })
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = async () => {
    setSaving(true)
    setError(null)
    try {
      const newScript = {
        title: 'Untitled Script',
        tags: [],
        description: '',
        content: '// Start your script here',
      }
      const res = await fetch(`${API_URL}/scripts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScript),
      })
      if (!res.ok) throw new Error('Create failed')
      const created = await res.json()
      setScripts(scripts => [created, ...scripts])
      setSelectedId(created._id)
      toast({ title: 'Script created', status: 'success', duration: 2000 })
    } catch (err) {
      setError('Failed to create script')
      toast({ title: 'Failed to create', status: 'error', duration: 2000 })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!edit?._id) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/scripts/${edit._id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Delete failed')
      setScripts(scripts => scripts.filter(s => s._id !== edit._id))
      // Select next script or none
      setSelectedId(prev => {
        const idx = scripts.findIndex(s => s._id === prev)
        if (idx > 0) return scripts[idx - 1]._id
        if (scripts.length > 1) return scripts[1]._id
        return null
      })
      setEdit(null)
      toast({ title: 'Script deleted', status: 'info', duration: 2000 })
    } catch (err) {
      setError('Failed to delete script')
      toast({ title: 'Failed to delete', status: 'error', duration: 2000 })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Flex h="100vh" minH="100dvh" bg="#191414" overflow="hidden" justify="center">
      <Box w="1100px" maxW="1100px" mx="auto" display="flex" h="100vh">
        {/* Left Panel */}
        <Box
          w="260px"
          minW="220px"
          maxW="280px"
          bg="#121212"
          p={3}
          borderRight="1px solid #282828"
          boxShadow="2xl"
          h="full"
          minH="100dvh"
          overflowY="auto"
          zIndex={2}
          position="relative"
        >
          <InputGroup mb={3}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search scripts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              bg="#191414"
              color="white"
              borderRadius="full"
              border="none"
              _focus={{ border: '2px solid #1db954', boxShadow: '0 0 0 2px #1db954' }}
            />
          </InputGroup>
          <Button leftIcon={<AddIcon />} colorScheme="green" variant="solid" mb={4} onClick={handleCreate} isLoading={saving} borderRadius="full" fontWeight="bold" w="full">
            New Script
          </Button>
          {loading && <Spinner color="green.400" />}
          <VStack align="stretch" spacing={4}>
            {filteredScripts.map(script => (
              <Box
                key={script._id}
                p={3}
                bg={selectedId === script._id ? '#1db954' : '#232323'}
                color={selectedId === script._id ? 'black' : 'white'}
                borderRadius="xl"
                boxShadow={selectedId === script._id ? 'lg' : 'sm'}
                cursor="pointer"
                onClick={() => setSelectedId(script._id)}
                transition="all 0.2s"
                _hover={{ bg: selectedId === script._id ? '#1ed760' : '#282828' }}
                w="full"
              >
                <Text fontWeight="bold" fontSize="lg" letterSpacing="wide">{script.title}</Text>
                <HStack spacing={1} mt={1} mb={1}>
                  {script.tags.slice(0, 3).map(tag => (
                    <Tag size="sm" key={tag} bg="#282828" color="green.300" borderRadius="full" fontWeight="bold">{tag}</Tag>
                  ))}
                </HStack>
                <Text fontSize="sm" color={selectedId === script._id ? 'blackAlpha.800' : 'gray.400'}>
                  {script.description?.slice(0, 150)}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
        {/* Right Panel */}
        <Box
          flex={1}
          p={4}
          bg="#191414"
          minH="100dvh"
          overflowY="auto"
          w="840px"
          ml="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box w="100%" maxW="600px" mx="auto">
            {loading && <Spinner color="green.400" />}
            {error && <Text color="red.400">{error}</Text>}
            {edit && (
              <VStack align="stretch" spacing={4} bg="#232323" p={{ base: 4, md: 8 }} borderRadius="2xl" boxShadow="2xl" w="full" maxW="600px" mx="auto">
                <HStack justify="space-between" flexWrap="wrap">
                  <Input
                    name="title"
                    value={edit.title || ''}
                    onChange={handleChange}
                    placeholder="Script Title"
                    fontWeight="bold"
                    fontSize="2xl"
                    bg="#191414"
                    color="white"
                    borderRadius="full"
                    border="none"
                    _focus={{ border: '2px solid #1db954', boxShadow: '0 0 0 2px #1db954' }}
                    w={{ base: 'full', md: 'auto' }}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    aria-label="Delete script"
                    onClick={handleDelete}
                    isLoading={saving}
                    borderRadius="full"
                    bg="#191414"
                    _hover={{ bg: '#282828' }}
                  />
                </HStack>
                <HStack flexWrap="wrap">
                  {edit.tags?.map((tag, idx) => (
                    <Input
                      key={idx}
                      value={tag}
                      onChange={e => handleTagChange(idx, e.target.value)}
                      maxLength={20}
                      placeholder={`Tag ${idx + 1}`}
                      bg="#191414"
                      color="green.300"
                      borderRadius="full"
                      border="none"
                      fontWeight="bold"
                      _focus={{ border: '2px solid #1db954', boxShadow: '0 0 0 2px #1db954' }}
                      w={{ base: 'full', md: 'auto' }}
                    />
                  ))}
                  {edit.tags?.length < 3 && (
                    <Button size="sm" onClick={handleAddTag} colorScheme="green" borderRadius="full" fontWeight="bold">+ Tag</Button>
                  )}
                </HStack>
                <Textarea
                  name="description"
                  value={edit.description || ''}
                  onChange={handleChange}
                  maxLength={150}
                  placeholder="Description (max 150 chars)"
                  bg="#191414"
                  color="white"
                  borderRadius="xl"
                  border="none"
                  _focus={{ border: '2px solid #1db954', boxShadow: '0 0 0 2px #1db954' }}
                  w="full"
                />
                <Textarea
                  name="content"
                  value={edit.content || ''}
                  onChange={handleChange}
                  rows={10}
                  placeholder="Script content"
                  bg="#191414"
                  color="white"
                  borderRadius="xl"
                  border="none"
                  fontFamily="mono"
                  _focus={{ border: '2px solid #1db954', boxShadow: '0 0 0 2px #1db954' }}
                  w="full"
                />
                <Button colorScheme="green" onClick={handleSave} isLoading={saving} borderRadius="full" fontWeight="bold" fontSize="lg" alignSelf="flex-end" px={8} py={6} boxShadow="md" w={{ base: 'full', md: 'auto' }}>
                  Save
                </Button>
              </VStack>
            )}
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}

export default App
