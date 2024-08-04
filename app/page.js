'use client'

import { useState, useEffect } from 'react'
import { Container, Box, Stack, Typography, Button, Modal, TextField, Grid, Card, CardContent, CardActions, AppBar, Toolbar } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e53935', // Red color for primary buttons
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
})

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [updateItemName, setUpdateItemName] = useState('')
  const [updateItemQuantity, setUpdateItemQuantity] = useState(0)
  const [currentItem, setCurrentItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const updateItem = async (currentItem, newName, newQuantity) => {
    const docRef = doc(collection(firestore, 'inventory'), currentItem)
    const newDocRef = doc(collection(firestore, 'inventory'), newName)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      await deleteDoc(docRef)
      await setDoc(newDocRef, { quantity: newQuantity })
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleUpdateOpen = (item) => {
    setCurrentItem(item.name)
    setUpdateItemName(item.name)
    setUpdateItemQuantity(item.quantity)
    setUpdateOpen(true)
  }

  const handleUpdateClose = () => setUpdateOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          color: 'text.primary',
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Pantry Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Box
            display={'flex'}
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
            gap={2}
            mt={4}
          >
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" color='white'>
                  Add Item
                </Typography>
                <Stack width="100%" direction={'row'} spacing={2}>
                  <TextField
                    id="outlined-basic"
                    label="Item"
                    variant="outlined"
                    fullWidth
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      addItem(itemName)
                      setItemName('')
                      handleClose()
                    }}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            </Modal>

            <Modal
              open={updateOpen}
              onClose={handleUpdateClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" color='white'>
                  Update Item
                </Typography>
                <Stack width="100%" direction={'column'} spacing={2}>
                  <TextField
                    id="outlined-basic"
                    label="Item Name"
                    variant="outlined"
                    fullWidth
                    value={updateItemName}
                    onChange={(e) => setUpdateItemName(e.target.value)}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={updateItemQuantity}
                    onChange={(e) => setUpdateItemQuantity(parseInt(e.target.value))}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      updateItem(currentItem, updateItemName, updateItemQuantity)
                      handleUpdateClose()
                    }}
                  >
                    Update
                  </Button>
                </Stack>
              </Box>
            </Modal>

            <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
              Add New Item
            </Button>
            <TextField
              id="search-field"
              label="Search Items"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ marginBottom: 4, maxWidth: '800px' }}
            />
            <Grid container spacing={4}>
              {filteredInventory.map(({name, quantity}) => (
                <Grid item xs={12} sm={6} md={4} key={name}>
                  <Card sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {quantity}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" variant="contained" onClick={() => addItem(name)} color="primary">Add</Button>
                      <Button size="small" variant="contained" onClick={() => removeItem(name)} color="primary">Remove</Button>
                      <Button size="small" variant="contained" onClick={() => handleUpdateOpen({name, quantity})} color="primary">Update</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
