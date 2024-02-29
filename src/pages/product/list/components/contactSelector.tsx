import { AutoComplete, Button, Space } from 'antd'
import { FC, useCallback, useState } from 'react'
import { listPurchasesContacts } from '../../../../services/contacts'
import { ContactDataType, PaginateDataType, SearchParamsType } from '../../../../interface/common'
import { useSearchParams } from 'react-router-dom'
import { debounce, getQueryFromUrl } from '../../../../utils/common.utils'
import { PAGINATION_LIMIT } from '../../../../constants/app.constants'

interface SelectorProps {
    loadProducts: (queryParams?: Record<string, any>) => void
}

const fixedListParams = {
    paginate: true
}

const fetch = async (queryParams?: Record<string, any>) => {
    let query = queryParams || {}
        const res = await listPurchasesContacts({
            query: { ...fixedListParams, ...query }
        })
        return res  
}

const Selector: FC<SelectorProps> = ({ loadProducts }) => {
    let [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState('')
    const [selectedOption, setSelectedOption] =
        useState<ContactDataType | null>(null)
    const [options, setOptions] = useState<ContactDataType[]>([])
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginateDataType>({
        next: null,
        prev: null,
        count: null,
        resultsCount: 0,
        offset: null,
        hasOffset: true,
        limit: PAGINATION_LIMIT
    })

    const fetchAndUpdate = async (queryParams?: Record<string, any>) => {
        setLoading(true)
        const res = await fetch(queryParams)
        setLoading(false)
        const results = res?.data?.results
        setOptions(prevOptions => {
            if (queryParams?.offset) {
                return [...prevOptions, ...results]
            }
            return results
        }
        )
        setPagination((prev) => {
            return {
                ...prev,
                next: res.data.next,
                prev: res.data.previous,
                count: res.data.count,
                resultsCount: res.data.results.length,
                offset: queryParams?.offset ? Number(queryParams.offset) : null
            }
        })
    }

    const debouncedFetchAndUpdate = useCallback(
        debounce(fetchAndUpdate, 500),
        []
    )

    const handleSearch = (value: string) => {
        setSearchValue(value)
        const query = { ...fixedListParams, search: value, limit: PAGINATION_LIMIT, offset: null }
        debouncedFetchAndUpdate(query)
        if (selectedOption) {
            setSelectedOption(null)
        }
    }

    const setSearchParamsAndLoadProducts = async (
        searchQuery: SearchParamsType
    ) => {
        await setSearchParams((prev: URLSearchParams) => searchQuery)
        loadProducts(searchQuery)
    }

    const handleSelect = (value: string, option: ContactDataType) => {
        setSearchValue(value)
        const query = { ...fixedListParams, search: value, limit: PAGINATION_LIMIT, offset: null }
        fetchAndUpdate(query)
        setSelectedOption(option)
        setSearchParamsAndLoadProducts({
            contact: `${option?.id}`,
            paginate: `${true}`
        })
    }

    const handleReset = () => {
        setSearchValue('')
        const query = { ...fixedListParams, search: '', limit: PAGINATION_LIMIT, offset: null }
        fetchAndUpdate(query)
        setSearchParamsAndLoadProducts({})
    }

    const handleFocus = () => {
        const query = { ...fixedListParams, search: searchValue, limit: PAGINATION_LIMIT, offset: null }
        fetchAndUpdate(query)
    }

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {

        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        // When the user has scrolled to the bottom of the list
        if (scrollTop + clientHeight >= scrollHeight) {
        let abstractedQuery = getQueryFromUrl(`${pagination.next}`)
        await fetchAndUpdate(abstractedQuery);
        }
    };

    // ==================================

    return (
        <Space>
            <AutoComplete
                style={{ width: 250 }}
                options={options.map((contact: ContactDataType) => ({
                    ...contact,
                    value: contact.company_name
                }))}
                value={searchValue}
                onSelect={handleSelect}
                onSearch={handleSearch}
                onFocus={handleFocus}
                onPopupScroll={handleScroll}
                placeholder="Search by Name/SKU"
            />
            <Button onClick={handleReset}>Reset</Button>
        </Space>
    )
}

const SelectorWithErrorBoundary: FC<SelectorProps> = (props) => {
    try {
        return <Selector {...props} />
    } catch (error) {
        console.error('Error in Selector:', error)
        return <div>Something went wrong.</div>
    }
}

export default SelectorWithErrorBoundary
