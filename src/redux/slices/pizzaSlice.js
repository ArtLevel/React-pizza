import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchPizzas = createAsyncThunk(
	'pizza/fetchPizzasStatus',
	async (params) => {
		const { currentPage, sortBy, order, category, search } = params
		const { data } = await axios.get(
			`https://6495b554b08e17c9179292b6.mockapi.io/items?page=${currentPage}&limit=8&${category}&sortby=${sortBy}&order=${order}&${search}`
		)

		return data
	}
)

const initialState = {
	items: [],
	status: 'loading', // loading, success, error
}

const pizzaSlice = createSlice({
	name: 'pizza',
	initialState,
	reducers: {
		setItems(state, action) {
			state.items = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPizzas.pending, (state) => {
				state.status = 'loading'
				state.items = []
			})
			.addCase(fetchPizzas.fulfilled, (state, action) => {
				state.status = 'success'
				state.items = action.payload
			})
			.addCase(fetchPizzas.rejected, (state) => {
				state.status = 'error'
				state.items = []
			})
	},
})

export const { setItems } = pizzaSlice.actions

export default pizzaSlice.reducer
