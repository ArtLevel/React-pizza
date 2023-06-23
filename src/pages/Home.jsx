import React, { useEffect, useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../components/Pagination/Pagination'
import qs from 'qs'

import { SearchContext } from './../App'

import { useSelector, useDispatch } from 'react-redux'
import {
	setCategoryId,
	setCurrentPage,
	setFilters,
} from './../redux/slices/filterSlice'

import Categories from './../components/Categories'
import PizzaBlock from './../components/PizzaBlock/PizzaBlock'
import PizzaSkeleton from './../components/PizzaBlock/Skeleton'
import Sort, { list } from './../components/Sort'
import { fetchPizzas } from '../redux/slices/pizzaSlice'

const Home = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const isSearch = useRef(false)
	const isMounted = useRef(false)

	const { categoryId, sort, currentPage } = useSelector(
		(state) => state.filterSlice
	)

	const { items, status } = useSelector((state) => state.pizzaSlice)

	const sortType = sort.sortProperty

	const { searchValue } = useContext(SearchContext)

	const arrayPizzas = items
		.filter((pizza) => {
			const pizzaTitleToLowerCase = pizza.title.toLowerCase()
			const searchValueToLowerCase = searchValue.toLowerCase()

			if (pizzaTitleToLowerCase.includes(searchValueToLowerCase)) {
				return true
			}

			return false
		})
		.map((pizza) => <PizzaBlock key={pizza.id} {...pizza} />)

	const skeletons = [...new Array(8)].map((undefined, index) => (
		<PizzaSkeleton key={index} />
	))

	const onChangeCategory = (id) => {
		dispatch(setCategoryId(id))
	}

	const onChangePage = (number) => {
		dispatch(setCurrentPage(number))
	}

	const getPizzas = async () => {
		const sortBy = sortType.replace('-', '')
		const order = sortType.includes('-') ? 'asc' : 'desc'
		const category = categoryId > 0 ? `category=${categoryId}` : ``

		dispatch(
			fetchPizzas({
				sortBy,
				order,
				category,
				currentPage,
			})
		)
	}

	// Если изменили параметры и был первый рендер
	useEffect(() => {
		if (isMounted.current) {
			const queryString = qs.stringify({
				sortProperty: sort.sortProperty,
				categoryId,
				currentPage,
			})

			navigate(`/?${queryString}`)
		}

		isMounted.current = true
	}, [categoryId, sortType, searchValue, currentPage])

	// Если был первый рендер, то проверяем URl-параметр и сохраняем в редукс
	useEffect(() => {
		if (window.location.search) {
			const params = qs.parse(window.location.search.substring(1))

			const sort = list.find((obj) => obj.sortProperty === params.sortProperty)

			dispatch(
				setFilters({
					...params,
					sort,
				})
			)

			isSearch.current = true
		}
	}, [])

	useEffect(() => {
		window.scrollTo(0, 0)

		if (!isSearch.current) {
			getPizzas()
		}

		isSearch.current = false
	}, [categoryId, sortType, searchValue, currentPage])

	return (
		<div className='container'>
			<div className='content__top'>
				<Categories
					value={categoryId}
					onChangeCategory={(index) => onChangeCategory(index)}
				/>
				<Sort />
			</div>
			<h2 className='content__title'>Все пиццы</h2>
			{status === 'error' ? (
				<div className='content__error-info'>
					<h2>Произошла ошибка 😕</h2>

					<p>
						К сожалению, не удалось получить питцы. Попробуйте повторить попытку
						позже.
					</p>
				</div>
			) : (
				<div className='content__items'>
					{status === 'loading' ? skeletons : arrayPizzas}
				</div>
			)}
			<Pagination
				currentPage={currentPage}
				onChangePage={(index) => onChangePage(index)}
			/>
		</div>
	)
}

export default Home
