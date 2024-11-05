'use client'
import { useEffect, useState } from "react";



export default function Home() {
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true)


    useEffect(() => {
            fetch('/api')
            .then((res) => res.json())
            .then((data) => {
                    console.log(data)
                    setData(data)
                    setLoading(false)
                    })
            }, [])

    if (isLoading) return <p>Loading...</p>
    if (data && data.list_view_header) return (
        <table border={1}>
            <tr>{data.list_view_header.map((v, k) => <td key={k + v}> {v} </td>)}</tr> 
            { data.listview.map((v,k) => 
                <tr key={k}>
                { v.map((vi,ki) => <td key={k + "-" + ki} dangerouslySetInnerHTML={{ __html: ki == 0 ? vi: vi }}/>)}
                </tr>)
            }
        </table>
    )
}

