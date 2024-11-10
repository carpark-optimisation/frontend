import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request) {

    const res = await fetch(
        'https://www.healthmap.org/getAlerts.php?category%5B%5D=1&category%5B%5D=2&category%5B%5D=29&diseases%5B%5D=82&time_interval=1+month&heatscore=1&partner=hm',
        {
            method: 'GET',
        }
    )

    const data = await res.json()

    return Response.json(data)
}

export async function POST(request) {
    try {
        const body = await request.json()
        const markerTypeEnum = ['optimize-carparks-centroids', 'optimize-carparks-random', 'optimize-carparks-poisson']
        // Validate request body
        if (!body) {
            return NextResponse.json(
                { error: 'Missing request body' },
                { status: 400 }
            )
        }

        // Example: calling an external API (replace with your API endpoint)
        try {
            const apiResponse = await axios.post(
                `http://127.0.0.1:5061/${markerTypeEnum[body.marker_type]}`,
                body,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any required API keys or authentication headers
                        // 'Authorization': `Bearer ${process.env.API_KEY}`
                    }
                }
            )

            // Return the external API response
            return NextResponse.json(
                {
                    data: apiResponse.data,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        requestId: crypto.randomUUID()
                    }
                },
                { status: 200 }
            )

        } catch (apiError) {
            // Handle specific API errors
            const statusCode = apiError.response?.status || 500
            const errorMessage = apiError.response?.data?.error || 'External API Error'

            return NextResponse.json(
                {
                    error: errorMessage,
                    details: apiError.response?.data
                },
                { status: statusCode }
            )
        }

    } catch (error) {
        console.error('Internal server error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

// export async function POST(request) {
//     // try {
//     const body = await request.json()
//     const hostname = 'http://127.0.0.1:5061/optimize-carparks-centroids';
//     const response = await fetch(
//         hostname,
//         {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(forward), // Forward the request body if needed
//         }
//     );
//     console.log("the response is")
//     console.log(response)

//     // Check if the response is successful
//     if (!response.ok) {
//         throw new Error(`Failed to fetch data from ${hostname}${path}`);
//     }

//     // Parse the JSON response
//     // const data = await response.json();

//     // // Send the data back to the client
//     // return Response.json(data)
//     // } catch (error) {
//     //     console.error('Error fetching data:', error);
//     //     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//     // }
// };

