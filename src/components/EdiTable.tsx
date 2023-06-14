import React from 'react'
import { useEffect, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from '@tanstack/react-table'

import { rankItem } from '@tanstack/match-sorter-utils'

const EditableInput = ({ getValue, row: { index }, column: { id }, table }) => {
  const initialValue = getValue()

  const [value, setValue] = useState(initialValue)

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    console.log(index, id, value, ': instance')
    table.options.meta?.updateData(index, id, value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <input value={value} onChange={(e) => handleChange(e)} onBlur={onBlur} />
  )
}

// const EditableCheckBox = ({ getValue, table, row, column }) => {
//   // table, 'editable table '
//   // options.meta.updateData()
//   console.log(table, 'instance')
//   const initialValue = getValue()

//   const [value, setValue] = useState(initialValue)
//   const onBlur = () => {
//     console.log(row.index, column.id, value)
//     table.options.meta?.updateData(row.index, column.id, value)
//   }

//   return (
//     <input
//       type={'checkbox'}
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//       onBlur={onBlur}
//     />
//   )
// }

// const EditableTextArea = ({ getValue, table, row, column }) => {
//   // table, 'editable table '
//   // options.meta.updateData()
//   console.log(table, 'instance')
//   const initialValue = getValue()

//   const [value, setValue] = useState(initialValue)
//   const onBlur = () => {
//     console.log(row.index, column.id, value)
//     table.options.meta.updateData(row.index, column.id, value)
//   }
//   return (
//     <textarea
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//       onBlur={onBlur}
//     />
//   )
// }

const columnHelper = createColumnHelper()
const columns = [
  columnHelper.accessor('firstName', {
    header: () => 'First Name',
    id: 'firstName',
    cell: (info) => <EditableInput {...info} />,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    // cell: (info) => <EditableCheckBox {...info} />,
    // cell: (info) => <EditableCheckBox {...info} />,

    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('age', {
    id: 'age',
    header: () => 'Age',
    // cell: (info) => <EditableTextArea {...info} />,
    // cell: (info) => <EditableTextArea {...info} />,

    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    id: 'visits',
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    id: 'progress',
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  }),
]

const defaultData = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'drake',
    lastName: 'sebastian',
    age: 22,
    visits: 20,
    status: 'In Relationship',
    progress: 90,
  },
  {
    firstName: 'marshal',
    lastName: 'mathers',
    age: 42,
    visits: 10,
    status: 'Single',
    progress: 0,
  },
  {
    firstName: 'uncle',
    lastName: 'bob',
    age: 67,
    visits: 42,
    status: 'Married',
    progress: 95,
  },
  {
    firstName: 'heath',
    lastName: 'robins',
    age: 24,
    visits: 2,
    status: 'Single',
    progress: 0,
  },
  {
    firstName: 'Tom',
    lastName: 'hardy',
    age: 30,
    visits: 3,
    status: 'Single',
    progress: 0,
  },
]

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const EdiTable: React.FC = () => {
  const [data, setData] = React.useState(() => [...defaultData])
  const [sorting, setSorting] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 3,
  })
  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    // defaultColumn,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
    debugTable: true,
  })
  console.log(table, 'table')
  return (
    <div className='mt-4 flex flex-col'>
      <div className='-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className='p-2 font-lg shadow border border-block'
            placeholder='Search all columns...'
          />
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className='group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted()] ?? null}
                            <div>
                              <Filter column={header.column} instance={table} />
                            </div>
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className='px-6 py-4 whitespace-nowrap'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {/* <tfoot>
      {table.getFooterGroups().map((footerGroup) => (
        <tr key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <th key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext()
                  )}
            </th>
          ))}
        </tr>
      ))}
    </tfoot> */}
            </table>
            <div className='h-2' />
            <div className='flex items-center gap-2'>
              <button
                className='border rounded p-1'
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </button>
              <button
                className='border rounded p-1'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </button>
              <button
                className='border rounded p-1'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </button>
              <button
                className='border rounded p-1'
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </button>
              <span className='flex items-center gap-1'>
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </strong>
              </span>
              <span className='flex items-center gap-1'>
                | Go to page:
                <input
                  type='number'
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    table.setPageIndex(page)
                  }}
                  className='border p-1 rounded w-16'
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                }}
              >
                {/* [10, 20, 30, 40, 50] */}
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
              {/* {dataQuery.isFetching ? 'Loading...' : null} */}
            </div>
            {/* <div>{table.getRowModel().rows.length} Rows</div> */}
            <div>
              {/* <button onClick={() => rerender()}>Force Rerender</button> */}
            </div>
            {/* <pre>{JSON.stringify(pagination, null, 2)}</pre> */}
          </div>
        </div>
      </div>
    </div>
  )
}

function Filter({ column, instance }) {
  const firstValue = instance
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className='flex space-x-2'>
      <input
        type='number'
        value={columnFilterValue?.[0] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className='w-24 border shadow rounded'
      />
      <input
        type='number'
        value={columnFilterValue?.[1] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className='w-24 border shadow rounded'
      />
    </div>
  ) : (
    <input
      type='text'
      value={columnFilterValue ?? ''}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className='w-36 border shadow rounded'
    />
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export default EdiTable

//Table with search sort and pagination
