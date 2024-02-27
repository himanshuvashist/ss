import { FC, useEffect, useState } from 'react'
import ResultString from '../../../components/content/result.content'
import Heading from '../../../components/heading/basic.heading'
import Pagination from '../../../components/pagination/basic.pagination'
import { PAGINATION_LIMIT } from '../../../constants/app.constants'
import { PaginateDataType, UrlType } from '../../../interface/common'
import { listProducts } from '../../../services/products'
import { getQueryFromUrl } from '../../../utils/common.utils'
import ProductsTable from './components/products.table'
import ContactSelector from './components/contactSelector'
import { Button, Space } from 'antd'
import { useSearchParams } from 'react-router-dom'

const fixedListParams = {
    paginate: true
}

const ProductList: FC = () => {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoding] = useState<boolean>(false)
    const [pagination, setPagination] = useState<PaginateDataType>({
        next: null,
        prev: null,
        count: null,
        resultsCount: 0,
        offset: null,
        hasOffset: true,
        limit: PAGINATION_LIMIT
    })
    let [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        const contact = searchParams.get('contact') ?? null
        const paginate = searchParams.get('paginate') ?? null
        const limit = searchParams.get('limit') ?? null
        const offset = searchParams.get('offset') ?? null
        loadProducts({ contact, paginate, limit, offset })
    }

    const loadProducts = async (queryParams?: Record<string, any>) => {
        let query = queryParams || {}
        setLoding(true)
        try {
            const res = await listProducts({
                query: { ...fixedListParams, ...query }
            })

            setProducts(res.data.results)
            setPagination((prev) => {
                return {
                    ...prev,
                    next: res.data.next,
                    prev: res.data.previous,
                    count: res.data.count,
                    resultsCount: res.data.results.length,
                    offset: query?.offset ? Number(query.offset) : null
                }
            })
        } catch (err) {
            console.log(err)
        }
        setLoding(false)
    }

    const handleNext = (next: UrlType) => {
        if (next === null) {
            return
        }
        let query = getQueryFromUrl(next)
        setSearchParams((prev: URLSearchParams) => ({
            ...prev,
            ...query
        }))
        loadProducts(query)
    }

    const handlePrev = (prev: UrlType) => {
        if (prev === null) {
            return
        }
        let query = getQueryFromUrl(prev)
        setSearchParams((prev: URLSearchParams) => ({
            ...prev,
            ...query
        }))
        loadProducts(query)
    }
    return (
        <>
            <div style={{ marginBottom: '1rem' }}>
                <Heading titleLevel={2}>Products</Heading>
            </div>
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '0.5rem'
                }}
            >
                <div>
                    <ContactSelector loadProducts={loadProducts} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div>
                            <ResultString
                                loading={loading}
                                pagination={pagination}
                                pageString={'product'}
                            />
                        </div>
                        <div>
                            <Pagination
                                next={pagination.next}
                                prev={pagination.prev}
                                onNextClick={handleNext}
                                onPrevClick={handlePrev}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <ProductsTable list={products} loading={loading} />
                </div>
                <div>
                    <Pagination next={pagination.next} prev={pagination.prev} />
                </div>
            </div>
        </>
    )
}

export default ProductList
