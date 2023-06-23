import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  totalPrice: 0,
  items: []
}

const cartCountPrice = (state) => {
  return state.items.reduce((sum, obj) => obj.price * obj.count + sum, 0)
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id)

      if (findItem) {
        findItem.count++
      } else {
        state.items.push({
          ...action.payload,
          count: 1
        })
      }

      state.totalPrice = cartCountPrice(state)
    },
    minusItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload)

      if (findItem && findItem.count !== 1) {
        findItem.count--
      }

      state.totalPrice = cartCountPrice(state)
    },
    removeItem(state, action) {
      state.items = state.items.filter((obj) => obj.id !== action.payload)

      state.totalPrice = cartCountPrice(state)
    },
    clearItems(state) {
      state.items = []
      state.totalPrice = 0
    }
  }
})

export const { addItem, removeItem, clearItems, minusItem } = cartSlice.actions

export default cartSlice.reducer
