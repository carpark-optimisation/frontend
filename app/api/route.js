export async function GET() {

  const res = await fetch(
      'https://www.healthmap.org/getAlerts.php?category%5B%5D=1&category%5B%5D=2&category%5B%5D=29&diseases%5B%5D=82&time_interval=1+month&heatscore=1&partner=hm',
      {
          method: 'GET',
      }
  )
 
  const data = await res.json()
 
  return Response.json(data)
}
