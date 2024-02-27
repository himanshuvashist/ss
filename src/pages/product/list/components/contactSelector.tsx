import { AutoComplete, Button, Space } from 'antd'
import { FC, useCallback, useState } from 'react'
import { listPurchasesContacts } from '../../../../services/contacts'
import { ContactDataType, SearchParamsType } from '../../../../interface/common'
import { useSearchParams } from 'react-router-dom'
import { debounce } from '../../../../utils/common.utils'

interface ContactSelectorProps {
    loadProducts: (queryParams?: Record<string, any>) => void
}

const fixedListParams = {
    paginate: true
}

const fetch = async (queryParams?: Record<string, any>) => {
    let query = queryParams || {}
    try {
        const res = await listPurchasesContacts({
            query: { ...fixedListParams, ...query }
        })
        return res
    } catch (err) {
        console.log(err)
    }
}

const ContactSelector: FC<ContactSelectorProps> = ({ loadProducts }) => {
    let [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState('')
    const [selectedOption, setSelectedOption] =
        useState<ContactDataType | null>(null)
    const [options, setOptions] = useState<ContactDataType[]>([])

    // ==================================

    const fetchAndUpdate = async (value: string) => {
        const queryParams = { search: value }
        const res = await fetch(queryParams)
        const results = res?.data?.results
        const filteredContacts = results.filter((contact: ContactDataType) =>
            contact.company_name.toLowerCase().includes(value.toLowerCase())
        )
        setOptions(filteredContacts)
    }

    // ----- use debounce function after typing
    const debouncedFetchAndUpdate = useCallback(
        debounce(fetchAndUpdate, 500),
        []
    )

    const handleSearch = (value: string) => {
        setSearchValue(value)
        debouncedFetchAndUpdate(value)
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
        fetchAndUpdate(value)
        setSelectedOption(option)
        setSearchParamsAndLoadProducts({
            contact: `${option?.id}`,
            paginate: `${true}`
        })
    }

    const handleReset = () => {
        setSearchValue('')
        fetchAndUpdate('')
        setSearchParamsAndLoadProducts({})
    }

    const handleFocus = () => {
        fetchAndUpdate(searchValue)
    }

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
                placeholder="Search by Name/SKU"
            />
            <Button onClick={handleReset}>Reset</Button>
        </Space>
    )
}

const ContactSelectorWithErrorBoundary: FC<ContactSelectorProps> = (props) => {
    try {
        return <ContactSelector {...props} />
    } catch (error) {
        console.error('Error in ContactSelector:', error)
        return <div>Something went wrong.</div>
    }
}

export default ContactSelectorWithErrorBoundary
